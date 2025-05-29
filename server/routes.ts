import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import type { DashboardData } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard data endpoint
  app.get("/api/dashboard", async (req, res) => {
    try {
      const dashboardData = await storage.getDashboardData();
      res.json(dashboardData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
  });

  // System status endpoint
  app.get("/api/system-status", async (req, res) => {
    try {
      const systemStatus = await storage.getSystemStatus();
      res.json(systemStatus);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch system status" });
    }
  });

  // Latest sensor data endpoint
  app.get("/api/sensor-data/latest", async (req, res) => {
    try {
      const latestData = await storage.getLatestSensorData();
      res.json(latestData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch latest sensor data" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  const connectedClients = new Set<WebSocket>();

  wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
    connectedClients.add(ws);

    // Send initial dashboard data
    storage.getDashboardData().then(data => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'dashboard_data', data }));
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
      connectedClients.delete(ws);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      connectedClients.delete(ws);
    });
  });

  // Broadcast updated data to all connected clients
  function broadcastDashboardUpdate(data: DashboardData) {
    const message = JSON.stringify({ type: 'dashboard_data', data });
    connectedClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  // Simulate real-time sensor data updates
  setInterval(async () => {
    try {
      // Generate new sensor data
      const newSensorData = storage.generateRealisticSensorData();
      await storage.createSensorData(newSensorData);

      // Get updated dashboard data
      const dashboardData = await storage.getDashboardData();
      
      // Broadcast to all connected clients
      broadcastDashboardUpdate(dashboardData);
    } catch (error) {
      console.error('Error updating sensor data:', error);
    }
  }, 30000); // Update every 30 seconds

  return httpServer;
}
