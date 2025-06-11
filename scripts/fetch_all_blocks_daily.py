import requests
import json
from datetime import datetime, timedelta
import os
import pandas as pd
from xgboost import XGBRegressor
import numpy as np

# ======= CẤU HÌNH =======
HOST = "https://admin.qenergy.ai"
LOGIN_ENDPOINT = "/api/auth/login/"
EMAIL = "eiu@qenergy.ai"
PASSWORD = "Qbots2022"

today = datetime.today()
start_date = (today - timedelta(days=12)).strftime('%Y-%m-%d')
end_date = (today + timedelta(days=1)).strftime('%Y-%m-%d')
RESOLUTION = "day"

def get_access_token():
    response = requests.post(f"{HOST}{LOGIN_ENDPOINT}", json={
        "role": 0,
        "email": EMAIL,
        "password": PASSWORD
    }, headers={ "Content-Type": "application/json" })

    if response.status_code == 200:
        return response.json().get("access_token")
    else:
        print("Đăng nhập thất bại:", response.status_code, response.text)
        return None

def fetch_all_site_data(token):
    url = f"{HOST}/api/site/all/consumption/profile/{start_date}/{end_date}?resolution={RESOLUTION}"
    headers = { "Authorization": f"Bearer {token}" }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print("Lỗi khi lấy dữ liệu:", response.status_code, response.text)
        return None

def generate_forecast(data, output_dir):
    df = pd.DataFrame(data)

    if "_id" in df.columns:
        df = df.drop(columns=["_id"])

    df["Day"] = pd.to_datetime([
        f"{item['_id']['year']}-{item['_id']['month']:02}-{item['_id']['day']:02}"
        for item in data
    ])
    df = df.sort_values("Day").dropna()

    for col in df.select_dtypes(include='number').columns:
        if col != "carbon_emission":
            Q1 = df[col].quantile(0.25)
            Q3 = df[col].quantile(0.75)
            IQR = Q3 - Q1
            df[col] = df[col].clip(Q1 - 1.5 * IQR, Q3 + 1.5 * IQR)

    X = df.drop(columns=["Day", "carbon_emission"])
    y = df["carbon_emission"]

    model = XGBRegressor(n_estimators=100, learning_rate=0.1, max_depth=5, random_state=42)
    model.fit(X, y)

    # Xác định ngày hôm nay
    today_date = df["Day"].max()

    # Lấy 7 ngày gần nhất + hôm nay
    past_days = df["Day"].tolist()[-8:]
    result = []

    for d in past_days:
        idx = df[df["Day"] == d].index[0]
        x_row = X.loc[idx]
        y_real = y.loc[idx]
        y_pred = float(model.predict([x_row])[0])
        result.append({
            "date": d.strftime("%Y-%m-%d"),
            "actual": float(round(y_real, 2)),
            "forecast": float(round(y_pred, 2))
        })

    # Dự đoán 3 ngày tương lai
    X_future = []
    for i in range(1, 4):
        rolling = X.tail(4 - i).mean()
        X_future.append(rolling)
    X_future = pd.DataFrame(X_future, columns=X.columns)
    future_dates = [today_date + timedelta(days=i) for i in range(1, 4)]
    y_future = model.predict(X_future)

    for d, f_ in zip(future_dates, y_future):
        result.append({
            "date": d.strftime("%Y-%m-%d"),
            "actual": None,
            "forecast": float(round(f_, 2))
        })

    forecast_path = os.path.join(output_dir, "forecast_carbon.json")
    with open(forecast_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2)

    print(f"Da luu du doan: {forecast_path}")

def main():
    token = get_access_token()
    if not token:
        return

    data = fetch_all_site_data(token)
    if not data:
        return

    output_dir = "./client/public/assets/data"
    os.makedirs(output_dir, exist_ok=True)

    json_path = os.path.join(output_dir, "site_all_daily.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print(f"Da luu du lieu tho: {json_path}")

    generate_forecast(data, output_dir)

if __name__ == "__main__":
    main()
