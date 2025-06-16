import json
import os
from datetime import datetime
from collections import defaultdict

# Đường dẫn file đầu vào và thư mục đầu ra
input_path = "./client/public/assets/data/site_data_2025_all.json"
output_dir = "./client/public/assets/data"
output_path = os.path.join(output_dir, "bar_data.json")

# Đọc dữ liệu
with open(input_path, "r", encoding="utf-8") as f:
    data = json.load(f)

# Gom theo giờ
hourly_data = defaultdict(lambda: {"consumption": 0.0, "efficiency": 0.0})

for entry in data:
    dt = datetime.fromisoformat(entry["_id"])
    hour_str = dt.strftime("%H:%M")  # ex: "03:00" hoặc "15:30"

    hourly_data[hour_str]["consumption"] += entry.get("actual", 0)
    hourly_data[hour_str]["efficiency"] += entry.get("carbon_emission", 0)

# Chuyển sang list dạng barData
bar_data = []
for hour in sorted(hourly_data.keys()):
    bar_data.append({
        "hour": hour,
        "consumption": round(hourly_data[hour]["consumption"], 2),
        "carbon_emission": round(hourly_data[hour]["efficiency"], 2)
    })

# Đảm bảo thư mục output tồn tại
os.makedirs(output_dir, exist_ok=True)

# Ghi ra file
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(bar_data, f, ensure_ascii=False, indent=2)

print(f"Da tao file: {output_path}")
# Kết quả sẽ là một file JSON chứa dữ liệu tiêu thụ và hiệu suất theo từng giờ