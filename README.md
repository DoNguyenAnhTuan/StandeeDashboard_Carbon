````markdown
# 📊 StandeeDashboard_Carbon

A real-time dashboard system for visualizing energy consumption and carbon emission data across multiple EIU blocks. It fetches data from the QEnergy API and presents it with dynamic charts and live status indicators.

---

## ⚡ Features

- 🔌 Live monitoring of electricity usage
- 🌱 Carbon emission tracking by block
- 📅 Daily/hourly data aggregation
- 📈 Forecasting carbon emissions using machine learning (XGBoost)
- 🖥 Built-in dashboard UI with WebSocket updates

---

## 🏗️ Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Recharts
- **Backend**: Express.js (Node), Python scripts
- **Data Source**: QEnergy API
- **ML Forecast**: Python + XGBoost

---

## 🔧 Setup Instructions

1. **Clone the repo**  
   ```bash
   git clone https://github.com/DoNguyenAnhTuan/StandeeDashboard_Carbon.git
   cd StandeeDashboard_Carbon
````

2. **Install Node packages**

   ```bash
   npm install
   ```

3. **Install Python dependencies**

   ```bash
   pip install -r scripts/requirements.txt
   ```

4. **Run the dashboard**

   ```bash
   npm run dev
   ```

---

## 📁 Directory Structure

```
StandeeDashboard_Carbon/
├── client/                      # Frontend assets (charts, UI)
│   └── public/
├── scripts/                     # Python scripts to fetch/process data
├── server/                      # Express backend
├── .gitignore
├── README.md
```

---

## 📊 Forecast Example

> `/client/public/assets/data/forecast_carbon.json` includes the predicted carbon emission for 3 future days based on the last 8 days of usage data.

```json
[
  { "date": "2025-06-10", "actual": 2340.05, "forecast": 2090.38 },
  { "date": "2025-06-11", "actual": 842.85, "forecast": 656.22 },
  { "date": "2025-06-12", "actual": null, "forecast": 1233.38 }
]
```

---

## 📌 Use Cases

* Energy awareness campaigns
* Visual display for sustainability events
* Admin-level monitoring tool at EIU

---

## 🧑‍💻 Author

**Do Nguyen Anh Tuan**
🌐 [Portfolio](https://donguyenanhtuan.github.io/AnhTuan-Portfolio/)
🎓 MSc IT @ Lac Hong University
🏢 FabLab @ Eastern International University
🔍 Research: Computer Vision, Object Detection, Carbon Forecasting

