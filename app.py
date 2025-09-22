from datetime import date, datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
import pandas as pd
import requests
import math

# ---------------------------
# Load datasets (placeholder for actual file loading)
# ---------------------------
try:
    SOIL_DATA = pd.read_csv("soil_dataset.csv")
    GWDATA = pd.read_csv("gdwater.csv")
    CLASSDATA = pd.read_csv("class.csv")
except FileNotFoundError as e:
    raise RuntimeError(f"Required data file not found: {e.filename}") from e

# ---------------------------
# App setup
# ---------------------------
app = FastAPI(title="Rainwater Harvesting Tool (Final Polished Version)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# Static mappings
# ---------------------------
ROOF_RUNOFF_COEFF = {
    "concrete": 0.85,
    "metal": 0.9,
    "tile": 0.75,
    "green": 0.6,
    "asphalt": 0.75
}

USABLE_FRACTION = {
    "sandy": 0.9,
    "gravel": 0.9,
    "loamy": 0.85,
    "alluvial": 0.85,
    "clayey": 0.75
}

STRUCTURE_COST = {
    "pit": 600,
    "shaft": 1200,
    "tank": 800
}

REALISTIC_UNIT_VOLUME = {
    "pit": 5.0,
    "shaft": 10.0,
    "tank": 30.0
}

WATER_PRICE = {
    "Lower bound": 15,
    "Typical urban slab": 30,
    "High urban slab": 50
}

# ---------------------------
# Models
# ---------------------------
class EstimateRequest(BaseModel):
    district: str
    rooftop_area_sqm: float = Field(100, ge=0)
    people: int = Field(1, ge=0)
    open_space_sqm: float = Field(5.0, ge=0.0)
    roof_type: str = Field("concrete")

class EstimateResponse(BaseModel):
    rainfall_check: Dict[str, Any]
    infiltration_check: Dict[str, Any]
    groundwater_check: Dict[str, Any]
    combined_check: Dict[str, Any]
    structure_design: Dict[str, Any]
    economics: Dict[str, Any]
    notes: Dict[str, Any]

# ---------------------------
# Helpers
# ---------------------------
def get_coordinates_from_district(district_name: str) -> tuple[float, float]:
    url = "https://nominatim.openstreetmap.org/search"
    params = {"q": district_name, "format": "json", "limit": 1}
    headers = {"User-Agent": "RainwaterHarvestingApp/1.0"}
    try:
        r = requests.get(url, params=params, headers=headers, timeout=10)
        r.raise_for_status()
        data = r.json()
        if not data:
            raise HTTPException(status_code=404, detail="District not found")
        return float(data[0]['lat']), float(data[0]['lon'])
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"API error: {e}")

def fetch_open_meteo_rainfall(lat: float, lon: float) -> tuple[dict, float]:
    yyyy = date.today().year - 1
    url = "https://archive-api.open-meteo.com/v1/archive"
    params = {
        "latitude": lat,
        "longitude": lon,
        "daily": "precipitation_sum",
        "timezone": "auto",
        "start_date": f"{yyyy}-01-01",
        "end_date": f"{yyyy}-12-31"
    }
    try:
        r = requests.get(url, params=params, timeout=10)
        r.raise_for_status()
        data = r.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Weather API error: {e}")

    times = data.get("daily", {}).get("time", [])
    precs = data.get("daily", {}).get("precipitation_sum", [])
    
    if not times or not precs:
        return {}, 0.0

    monthly, annual = {}, 0.0
    for t, p in zip(times, precs):
        try:
            dt = datetime.strptime(t, "%Y-%m-%d")
            m = dt.strftime("%b")
            monthly[m] = monthly.get(m, 0.0) + p
            annual += p
        except (ValueError, TypeError):
            continue

    monthly = {k: round(v, 2) for k, v in monthly.items()}
    return monthly, round(annual, 2)

def lookup_soil_type(district_name: str) -> str:
    row = SOIL_DATA[SOIL_DATA["District"].str.lower() == district_name.lower()]
    return row.iloc[0]["Soil Type"] if not row.empty else "Loamy"

def lookup_gw_depth(district_name: str) -> Optional[float]:
    row = GWDATA[GWDATA["District"].str.lower() == district_name.lower()]
    if row.empty:
        return None
    
    depth_str = row.iloc[0]["Estimated Groundwater Depth (m bgl)"]
    if pd.isna(depth_str):
        return None

    parts = []
    # Split by "&" and handle various formats
    for r in str(depth_str).split("&"):
        r = r.strip().replace("m", "").replace("bgl", "").strip()
        if "-" in r:
            try:
                a, b = map(float, r.split("-"))
                parts.append((a, b))
            except ValueError:
                continue
        else:
            try:
                parts.append((float(r), float(r)))
            except ValueError:
                continue
    
    if parts:
        avg_depth = sum([(a + b) / 2 for a, b in parts]) / len(parts)
        return avg_depth
    return None

def lookup_classification(district_name: str) -> str:
    row = CLASSDATA[CLASSDATA["District"].str.lower() == district_name.lower()]
    return row.iloc[0]["Classification"] if not row.empty else "Typical urban slab"

# ---------------------------
# Logic
# ---------------------------
def rainfall_check(annual_rainfall: float, roof_area: float, runoff_coeff: float, people: int, monthly_rain: Dict) -> Dict:
    annual_harvest = annual_rainfall * roof_area * runoff_coeff
    annual_demand = people * 80 * 365
    coverage = (annual_harvest / annual_demand * 100) if annual_demand > 0 else 0
    
    if coverage >= 100:
        feasible_text = "Fully meets demand"
    elif coverage >= 50:
        feasible_text = "Partially meets demand"
    else:
        feasible_text = "Not feasible"
    
    return {
        "monthly_mm": monthly_rain,
        "annual_mm": annual_rainfall,
        "annual_harvest_liters": round(annual_harvest, 2),
        "annual_demand_liters": round(annual_demand, 2),
        "coverage_percent": round(coverage, 1),
        "feasibility": feasible_text
    }

def infiltration_check(soil_type: str, gw_depth: Optional[float]) -> Dict:
    soil = soil_type.lower()
    if "sand" in soil or "gravel" in soil:
        infil = "High"
    elif "loam" in soil or "alluvial" in soil:
        infil = "Medium"
    else:
        infil = "Low"
        
    if gw_depth is not None and gw_depth < 2:
        infil = "Low"
        
    return {"soil_type": soil_type, "infiltration": infil}

def combined_logic(rainfall_info: Dict, infiltration_info: Dict) -> Dict:
    feasible_text = rainfall_info["feasibility"]
    infil = infiltration_info["infiltration"]
    
    if feasible_text == "Fully meets demand" and infil == "High":
        rec = "Storage + shallow recharge pits/trenches"
    elif feasible_text == "Fully meets demand" and infil == "Medium":
        rec = "Storage + percolation shafts"
    elif feasible_text == "Fully meets demand" and infil == "Low":
        rec = "Storage tanks; recharge optional"
    elif feasible_text == "Partially meets demand" and infil == "High":
        rec = "Recharge + small storage"
    elif feasible_text == "Partially meets demand" and infil == "Medium":
        rec = "Percolation shafts + partial storage"
    else:
        rec = "Limited rooftop storage + alternate supply"
        
    return {"final_recommendation": rec}

def structure_design(soil_type: str, usable_m3: float, demand_m3: float) -> Dict:
    tank_size = min(max(usable_m3, 0.0), demand_m3, 50.0)
    if usable_m3 > 0 and tank_size < 10.0:
        tank_size = min(10.0, demand_m3, usable_m3)
        
    tank = {
        "structure_type": "tank",
        "volume_m3": round(tank_size, 2),
        "cost_inr": round(tank_size * STRUCTURE_COST["tank"], 2)
    }
    
    recharge = []
    if "sand" in soil_type.lower() or "gravel" in soil_type.lower():
        recharge.append({"structure_type": "pit", "volume_m3": 5, "cost_inr": 5 * STRUCTURE_COST["pit"]})
    elif "loam" in soil_type.lower() or "alluvial" in soil_type.lower():
        recharge.append({"structure_type": "shaft", "volume_m3": 10, "cost_inr": 10 * STRUCTURE_COST["shaft"]})
    else:
        recharge.append({"structure_type": "deep_well", "note": "Site-specific design"})
        
    return {"tank": tank, "recharge": recharge}

def economics(struct_design: Dict, classification: str) -> Dict:
    construction_cost = struct_design["tank"]["cost_inr"] + sum(s.get("cost_inr", 0) for s in struct_design["recharge"])
    water_price = WATER_PRICE.get(classification, 30)
    tank_vol = struct_design["tank"]["volume_m3"]
    gross_savings = tank_vol * water_price
    cbr = round((gross_savings / construction_cost) * 100, 2) if construction_cost > 0 else "N/A"
    
    return {
        "construction_cost_inr": round(construction_cost, 2),
        "annual_monetary_savings_inr": round(gross_savings, 2),
        "cost_benefit_ratio_percent": cbr
    }

# ---------------------------
# Endpoint
# ---------------------------
@app.post("/estimate", response_model=EstimateResponse)
def estimate(req: EstimateRequest):
    try:
        lat, lon = get_coordinates_from_district(req.district)
        monthly_rain, annual_rain = fetch_open_meteo_rainfall(lat, lon)
        soil_type = lookup_soil_type(req.district)
        gw_depth = lookup_gw_depth(req.district)
        classification = lookup_classification(req.district)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    runoff_coeff = ROOF_RUNOFF_COEFF.get(req.roof_type.lower(), 0.85)
    rainfall_info = rainfall_check(annual_rain, req.rooftop_area_sqm, runoff_coeff, req.people, monthly_rain)

    infiltration_info = infiltration_check(soil_type, gw_depth)
    combined_info = combined_logic(rainfall_info, infiltration_info)

    frac = USABLE_FRACTION.get(soil_type.lower(), 0.85)
    usable_m3 = (rainfall_info["annual_harvest_liters"] * frac) / 1000
    demand_m3 = rainfall_info["annual_demand_liters"] / 1000

    struct_design = structure_design(soil_type, usable_m3, demand_m3)
    economics_info = economics(struct_design, classification)

    return {
        "rainfall_check": rainfall_info,
        "infiltration_check": infiltration_info,
        "groundwater_check": {"groundwater_depth": gw_depth},
        "combined_check": combined_info,
        "structure_design": struct_design,
        "economics": economics_info,
        "notes": {
            "key_features": [
                "Feasibility check for rooftop RWH",
                "Suggested type of RWH/Recharge structures",
                "Soil type & infiltration rate",
                "Groundwater depth",
                "Local rainfall data",
                "Recommended structure sizes",
                "Cost estimation & cost–benefit analysis"
            ]
        }
    }