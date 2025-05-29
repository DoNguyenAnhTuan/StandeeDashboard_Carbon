import { pgTable, text, serial, integer, real, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const sensorData = pgTable("sensor_data", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  temperature: real("temperature").notNull(),
  humidity: real("humidity").notNull(),
  airQualityIndex: integer("air_quality_index").notNull(),
  noiseLevel: real("noise_level").notNull(),
  energyUsage: real("energy_usage").notNull(),
  pm25: real("pm25").notNull(),
  pm10: real("pm10").notNull(),
  o3: real("o3").notNull(),
  co: real("co").notNull(),
});

export const systemStatus = pgTable("system_status", {
  id: serial("id").primaryKey(),
  sensorsOnline: integer("sensors_online").notNull(),
  totalSensors: integer("total_sensors").notNull(),
  networkStatus: text("network_status").notNull(),
  dataSyncStatus: text("data_sync_status").notNull(),
  lastUpdate: timestamp("last_update").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSensorDataSchema = createInsertSchema(sensorData).omit({
  id: true,
  timestamp: true,
});

export const insertSystemStatusSchema = createInsertSchema(systemStatus).omit({
  id: true,
  lastUpdate: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type SensorData = typeof sensorData.$inferSelect;
export type InsertSensorData = z.infer<typeof insertSensorDataSchema>;
export type SystemStatus = typeof systemStatus.$inferSelect;
export type InsertSystemStatus = z.infer<typeof insertSystemStatusSchema>;

// Dashboard data types
export interface DashboardData {
  current: SensorData;
  systemStatus: SystemStatus;
  weeklyStats: {
    avgTemperature: number;
    peakHumidity: number;
    totalEnergy: number;
    temperatureChange: number;
    humidityChange: number;
    energyChange: number;
  };
  weeklyTemperatures: Array<{
    day: string;
    temperature: number;
  }>;
  hourlyEnergyUsage: number[];
}
