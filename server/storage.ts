import { sensorData, systemStatus, type SensorData, type InsertSensorData, type SystemStatus, type InsertSystemStatus, type DashboardData } from "@shared/schema";

export interface IStorage {
  // Sensor data methods
  createSensorData(data: InsertSensorData): Promise<SensorData>;
  getLatestSensorData(): Promise<SensorData | undefined>;
  getSensorDataInRange(startDate: Date, endDate: Date): Promise<SensorData[]>;
  
  // System status methods
  updateSystemStatus(status: InsertSystemStatus): Promise<SystemStatus>;
  getSystemStatus(): Promise<SystemStatus | undefined>;
  
  // Dashboard methods
  getDashboardData(): Promise<DashboardData>;
}

export class MemStorage implements IStorage {
  private sensorDataStore: Map<number, SensorData>;
  private systemStatusStore: SystemStatus | undefined;
  private currentSensorId: number;

  constructor() {
    this.sensorDataStore = new Map();
    this.currentSensorId = 1;
    this.systemStatusStore = undefined;
    this.initializeData();
  }

  private initializeData() {
    // Initialize with some baseline data
    const initialSensorData: SensorData = {
      id: this.currentSensorId++,
      timestamp: new Date(),
      temperature: 34,
      humidity: 70,
      airQualityIndex: 50,
      noiseLevel: 45,
      energyUsage: 2.4,
      pm25: 12,
      pm10: 18,
      o3: 35,
      co: 0.4,
    };
    
    this.sensorDataStore.set(initialSensorData.id, initialSensorData);

    this.systemStatusStore = {
      id: 1,
      sensorsOnline: 5,
      totalSensors: 5,
      networkStatus: "Connected",
      dataSyncStatus: "Active",
      lastUpdate: new Date(),
    };
  }

  async createSensorData(insertData: InsertSensorData): Promise<SensorData> {
    const id = this.currentSensorId++;
    const sensorData: SensorData = {
      ...insertData,
      id,
      timestamp: new Date(),
    };
    this.sensorDataStore.set(id, sensorData);
    return sensorData;
  }

  async getLatestSensorData(): Promise<SensorData | undefined> {
    if (this.sensorDataStore.size === 0) return undefined;
    
    const latestId = Math.max(...this.sensorDataStore.keys());
    return this.sensorDataStore.get(latestId);
  }

  async getSensorDataInRange(startDate: Date, endDate: Date): Promise<SensorData[]> {
    return Array.from(this.sensorDataStore.values()).filter(
      (data) => data.timestamp >= startDate && data.timestamp <= endDate
    );
  }

  async updateSystemStatus(status: InsertSystemStatus): Promise<SystemStatus> {
    const updatedStatus: SystemStatus = {
      id: this.systemStatusStore?.id || 1,
      ...status,
      lastUpdate: new Date(),
    };
    this.systemStatusStore = updatedStatus;
    return updatedStatus;
  }

  async getSystemStatus(): Promise<SystemStatus | undefined> {
    return this.systemStatusStore;
  }

  async getDashboardData(): Promise<DashboardData> {
    const current = await this.getLatestSensorData();
    const systemStatus = await this.getSystemStatus();
    
    if (!current || !systemStatus) {
      throw new Error("No data available");
    }

    // Generate mock weekly stats
    const weeklyStats = {
      avgTemperature: 32.5,
      peakHumidity: 85,
      totalEnergy: 124,
      temperatureChange: 2.1,
      humidityChange: -5,
      energyChange: -8,
    };

    // Generate mock weekly temperatures
    const weeklyTemperatures = [
      { day: "Mon", temperature: 32 },
      { day: "Tue", temperature: 34 },
      { day: "Wed", temperature: 31 },
      { day: "Thu", temperature: 33 },
      { day: "Fri", temperature: 35 },
      { day: "Sat", temperature: 34 },
      { day: "Sun", temperature: 34 },
    ];

    // Generate mock hourly energy usage
    const hourlyEnergyUsage = [1.2, 1.8, 2.4, 3.2, 4.0, 3.0, 2.0, 1.4];

    return {
      current,
      systemStatus,
      weeklyStats,
      weeklyTemperatures,
      hourlyEnergyUsage,
    };
  }

  // Method to generate realistic sensor data variations
  generateRealisticSensorData(): InsertSensorData {
    const baseData = Array.from(this.sensorDataStore.values()).pop();
    if (!baseData) {
      return {
        temperature: 34,
        humidity: 70,
        airQualityIndex: 50,
        noiseLevel: 45,
        energyUsage: 2.4,
        pm25: 12,
        pm10: 18,
        o3: 35,
        co: 0.4,
      };
    }

    // Generate small variations around current values
    return {
      temperature: Math.max(25, Math.min(40, baseData.temperature + (Math.random() - 0.5) * 2)),
      humidity: Math.max(40, Math.min(90, baseData.humidity + (Math.random() - 0.5) * 5)),
      airQualityIndex: Math.max(0, Math.min(100, baseData.airQualityIndex + (Math.random() - 0.5) * 10)),
      noiseLevel: Math.max(30, Math.min(80, baseData.noiseLevel + (Math.random() - 0.5) * 10)),
      energyUsage: Math.max(1, Math.min(5, baseData.energyUsage + (Math.random() - 0.5) * 0.5)),
      pm25: Math.max(5, Math.min(50, baseData.pm25 + (Math.random() - 0.5) * 5)),
      pm10: Math.max(10, Math.min(80, baseData.pm10 + (Math.random() - 0.5) * 8)),
      o3: Math.max(20, Math.min(60, baseData.o3 + (Math.random() - 0.5) * 10)),
      co: Math.max(0.1, Math.min(1.0, baseData.co + (Math.random() - 0.5) * 0.2)),
    };
  }
}

export const storage = new MemStorage();
