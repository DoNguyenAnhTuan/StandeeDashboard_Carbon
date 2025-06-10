import requests
import json
from datetime import datetime, timedelta
import os
HOST = "https://admin.qenergy.ai"
LOGIN_ENDPOINT = "/api/auth/login/"

# Danh sách các site cần lấy dữ liệu
SITES = [
    { "id": "708", "name": "EIU Block 5" },
    { "id": "709", "name": "EIU Block 4" },
    { "id": "710", "name": "EIU Block 8" },
    { "id": "711", "name": "EIU Block 10" },
    { "id": "712", "name": "EIU Block 11A" },
    { "id": "713", "name": "EIU Block 11B" },
    { "id": "716", "name": "EIU Block 3" },
    { "id": "717", "name": "EIU Block 6" },
    { "id": "714", "name": "EIU Garage" },
    { "id": "all", "name": "All Blocks" },
]

# Get today and tomorrow in format YYYY-MM-DD
today = datetime.today().strftime('%Y-%m-%d')
tomorrow = (datetime.today() + timedelta(days=1)).strftime('%Y-%m-%d')

# Step 1: Login and get access token
def get_access_token():
    login_url = f"{HOST}{LOGIN_ENDPOINT}"
    payload = {
        "role": 0,
        "password": "Qbots2022",
        "email": "eiu@qenergy.ai"
    }
    headers = { "Content-Type": "application/json" }

    response = requests.post(login_url, json=payload, headers=headers)
    if response.status_code == 200:
        return response.json().get("access_token")
    else:
        print("Login Failed:", response.status_code, response.text)
        return None

# Step 2: Fetch site data
def fetch_site_data(site_id, access_token):
    site_url = f"{HOST}/api/site/{site_id}/consumption/profile/{today}/{tomorrow}?resolution=hour"
    headers = { "Authorization": f"Bearer {access_token}" }

    response = requests.get(site_url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error fetching site {site_id}:", response.status_code, response.text)
        return None
results = []
# Main logic
def main():
    access_token = get_access_token()
    if not access_token:
        print("Failed to authenticate.")
        return

    output_dir = "./client/public/assets/data"
    os.makedirs(output_dir, exist_ok=True)

    summary_path = os.path.join(output_dir, "summary_total.txt")
    with open(summary_path, "w", encoding="utf-8") as summary_file:
    
        for site in SITES:
            site_id = site["id"]
            name = site["name"]
            print(f"\nFetching data for {name} (ID: {site_id})")

            site_data = fetch_site_data(site_id, access_token)
            if not site_data:
                continue

            # Ghi file json riêng cho từng site
            json_filename = os.path.join(output_dir, f"site_data_2025_{site_id}.json")
            with open(json_filename, "w", encoding="utf-8") as f:
                json.dump(site_data, f, indent=2)
            print(f"Saved {json_filename}")

            # Tính tổng actual
            total_actual = sum(entry.get("actual", 0) for entry in site_data if entry.get("actual") is not None)
            # tính tổng carbon emission
            total_emission = sum(entry.get("carbon_emission", 0) for entry in site_data if entry.get("carbon_emission") is not None)

            # Ghi từng file riêng (nếu bạn vẫn cần)
            # with open(f"site_data_total_{site_id}.txt", "w", encoding="utf-8") as f:
            #     f.write(f"{name} ({site_id}) | Ngày {today} | Tổng actual: {total_actual:.3f} kWh\n")

            # Ghi vào file tổng hợp
            summary_file.write(f"id: {site_id}, total_actual: {total_actual:.3f}\n")

            # Ghi vào JSON kết quả cho frontend
            block_result = {
                "name": name,
                "usage": round(total_actual, 3),
                "carbon_emission": round(total_emission, 3)
            }
            results.append(block_result)

    print(f"\n Da tong hop vao: {summary_path}")
    # --- Tạo actual_blocks.json cho frontend ---
    ID_TO_NAME = {
        "708": "EIU Block 5",
        "709": "EIU Block 4",
        "710": "EIU Block 8",
        "711": "EIU Block 10",
        "712": "EIU Block 11A",
        "713": "EIU Block 11B",
        "716": "EIU Block 3",
        "717": "EIU Block 6",
        "714": "EIU Garage",
        "all": "All Blocks",
    }

    json_data = []
    with open(summary_path, "r") as f:
        for line in f:
            parts = line.strip().split(",")
            site_id = parts[0].split(":")[1].strip()
            total = float(parts[1].split(":")[1].strip())
            json_data.append({
                "name": ID_TO_NAME.get(site_id, f"Unknown {site_id}"),
                "usage": round(total, 3)
            })

    # Ghi file JSON dùng cho frontend
    json_output_path = os.path.join("client/public/api/actual_blocks.json")
    os.makedirs(os.path.dirname(json_output_path), exist_ok=True)
    with open(json_output_path, "w") as f:
        json.dump(results, f, indent=2)

    print(f"\n da ghi file actual_blocks.json vào {json_output_path}")


        

if __name__ == "__main__":
    main()
