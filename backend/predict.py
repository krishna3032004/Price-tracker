# import pandas as pd
# from prophet import Prophet  # Install with: pip install prophet
# from fastapi import FastAPI, Request
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from typing import List

# app = FastAPI()

# # For CORS if your frontend is hosted elsewhere
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# class PricePoint(BaseModel):
#     date: str
#     price: float

# class History(BaseModel):
#     history: List[PricePoint]

# @app.post("/predict")
# def predict_price(history: History):
#     # Step 1: Convert to DataFrame
#     df = pd.DataFrame([{"ds": h.date, "y": h.price} for h in history.history])

#     # Step 2: Prophet model
#     model = Prophet(daily_seasonality=True)
#     model.fit(df)

#     # Step 3: Forecast for next 30 days
#     future = model.make_future_dataframe(periods=30)
#     forecast = model.predict(future)

#     # Step 4: Extract last 30 days
#     forecast = forecast[["ds", "yhat"]].tail(30)
#     return forecast.to_dict(orient="records")












# backend/price-predictor/main.py

# import pandas as pd
# from prophet import Prophet
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from typing import List

# # FastAPI app setup
# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # For dev, use specific domain in prod
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Input schema
# class PricePoint(BaseModel):
#     date: str  # "YYYY-MM-DD"
#     price: float

# class History(BaseModel):
#     history: List[PricePoint]

# # 🎉 Festivals Data
# festivals = pd.DataFrame({
#     'holiday': [
#         'diwali', 'diwali',
#         'holi', 'holi',
#         'raksha_bandhan', 'raksha_bandhan',
#         'dussehra', 'dussehra',
#         'independence_day', 'independence_day',
#         'republic_day', 'republic_day',
#         'christmas', 'christmas',
#         'eid', 'eid',
#     ],
#     'ds': pd.to_datetime([
#         "2024-11-01", "2025-10-20",  # Diwali
#         "2024-03-25", "2025-03-14",  # Holi
#         "2024-08-19", "2025-08-09",  # Raksha Bandhan
#         "2024-10-12", "2025-09-30",  # Dussehra
#         "2024-08-15", "2025-08-15",  # Independence Day
#         "2025-01-26", "2024-01-26",  # Republic Day
#         "2024-12-25", "2025-12-25",  # Christmas
#         "2024-04-10", "2025-03-30",  # Eid (tentative)
#     ]),
#     'lower_window': -2,
#     'upper_window': 2
# })

# # @app.post("/predict")
# # def predict_price(history: History):
# #     # Step 1: Prepare DataFrame
# #     df = pd.DataFrame([{"ds": h.date, "y": h.price} for h in history.history])
# #     print(df)

# #     # Step 2: Initialize Prophet with holidays
# #     model = Prophet(daily_seasonality=True, holidays=festivals)
# #     model.fit(df)

# #     # Step 3: Create future dates for 30-day forecast
# #     future = model.make_future_dataframe(periods=30)

# #     # Step 4: Predict
# #     forecast = model.predict(future)

# #     # Step 5: Return only the forecast part
# #     result = forecast[['ds', 'yhat']].tail(30)
# #     return result.to_dict(orient='records')















# import pandas as pd
# from prophet import Prophet
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from typing import List

# app = FastAPI()

# # Allow all origins
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# class PricePoint(BaseModel):
#     date: str
#     price: float

# class History(BaseModel):
#     history: List[PricePoint]

# @app.post("/predict")
# def predict_price(history: History):
#     input_data = history.history

#     if len(input_data) < 7:
#         # If data is too short, return same price for next 30 days
#         fixed_price = input_data[-1].price
#         return [{"ds": pd.Timestamp.today() + pd.Timedelta(days=i), "yhat": fixed_price} for i in range(1, 31)]

#     # Step 1: Prepare DataFrame
#     df = pd.DataFrame([{"ds": h.date, "y": h.price} for h in input_data])
#     df["ds"] = pd.to_datetime(df["ds"])

#     # Step 2: Define Festivals
#     festivals = pd.DataFrame({
#         'holiday': 'festival',
#         'ds': pd.to_datetime([
#             "2025-01-26", "2025-03-29", "2025-08-15", "2025-11-01", "2025-11-12",  # Republic, Holi, Independence, Diwali (2024-25)
#             "2024-01-26", "2024-03-08", "2024-08-15", "2024-11-12"
#         ]),
#         'lower_window': 0,
#         'upper_window': 1,
#     })

#     # Step 3: Fit Prophet model with holidays
#     model = Prophet(daily_seasonality=True, holidays=festivals)
#     model.fit(df)

#     # Step 4: Future dates
#     future = model.make_future_dataframe(periods=30)
#     forecast = model.predict(future)

#     # Step 5: Round predictions to nearest price in input
#     original_prices = list(set([round(h.price) for h in input_data]))
#     def closest_price(val):
#         return min(original_prices, key=lambda x: abs(x - val))

#     forecast["yhat"] = forecast["yhat"].apply(closest_price)

#     # Step 6: Return last 30 predictions only
#     result = forecast[["ds", "yhat"]].tail(30)
#     return result.to_dict(orient="records")























import pandas as pd
from prophet import Prophet
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model classes
class PricePoint(BaseModel):
    date: str
    price: int  # force int

class History(BaseModel):
    history: List[PricePoint]

# Festival dates
FESTIVALS = [
     "2025-10-21",  # Diwali 2025
    "2026-11-08",  # Diwali 2026
    "2025-03-14",  # Holi 2025
    "2026-03-04",  # Holi 2026
    "2025-08-09",  # Raksha Bandhan 2025
    "2026-08-28",  # Raksha Bandhan 2026
    "2025-08-15",  # Independence Day (recurring)
    "2026-08-15",
    "2025-01-26",  # Republic Day
    "2026-01-26",
    "2025-10-02",  # Gandhi Jayanti
    "2026-10-02",
]

@app.post("/predict")
def predict_price(history: History):
    if not history.history:
        return [{"ds": pd.Timestamp.today().date().isoformat(), "yhat": 100}]  # constant fallback

    df = pd.DataFrame([{"ds": h.date, "y": h.price} for h in history.history])
    df["ds"] = pd.to_datetime(df["ds"])


    # Edge case: Only 1 data point
    if len(df) < 2:
        only_point = df.iloc[0]
        future_dates = pd.date_range(start=only_point["ds"], periods=30)
        print("bhai chl rh ahia kya kmuje btao")
        result = [{"ds": date.date().isoformat(), "yhat": int(only_point["y"])} for date in future_dates]
        return result



    try:


        unique_prices = sorted(df["y"].unique().tolist())
        lowest_price = int(df["y"].min())

        print(df)
    # Add holiday window (-2 to +1 days from each festival)
        holidays = []
        for fest in FESTIVALS:
            fest_date = pd.to_datetime(fest)
            for offset in [-2, -1, 0, 1, 2]:  # window
                holidays.append({"ds": fest_date + pd.Timedelta(days=offset), "holiday": "festival"})
        holidays_df = pd.DataFrame(holidays)

        model = Prophet(daily_seasonality=True, holidays=holidays_df)
        model.fit(df)
        print(df)
    # Forecast next 30 days
        future = model.make_future_dataframe(periods=30)
        forecast = model.predict(future)

    # Round prediction to closest real price from history
        def round_to_known_prices(yhat):
            print(yhat)
            print(unique_prices)
            print(min(unique_prices, key=lambda x: abs(x - yhat)))
            return min(unique_prices, key=lambda x: abs(x - yhat))

        result = []
        for _, row in forecast.tail(30).iterrows():
            date_str = row["ds"].date().isoformat()
            if row["ds"].date() in holidays_df["ds"].dt.date.values:
                price = lowest_price
            else:
                price = round_to_known_prices(row["yhat"])
            result.append({"ds": date_str, "yhat": price})

        print(result)    
        return result

    except Exception as e:
        # Fallback in case of unexpected error
        return [{"ds": pd.Timestamp.today().date().isoformat(), "yhat": 100, "error": str(e)}]