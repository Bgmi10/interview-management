import re
import requests
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from typing import Optional
from config import GOOGLE_SHEET_ROOMS_URL, GOOGLE_SHEET_AVAILABILITY_URL, GOOGLE_SHEET_RATES_URL
# App configuration
app = FastAPI(title="Hotel Booking API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],
)

def fetch_data_from_google_sheet_room(url):
    try:
        res = requests.get(url)
        res.raise_for_status()  # Raise an error for non-200 status codes
        raw_text = res.text

        match = re.search(r"google\.visualization\.Query\.setResponse\((.*)\);", raw_text, re.DOTALL)
        if not match:
            raise ValueError("Could not extract JSON from the response.")

        json_data = json.loads(match.group(1))
        rows = json_data.get("table", {}).get("rows", [])
        parsed_rooms = []

        for row in rows:
            cells = row.get("c", [])
            parsed_rooms.append({
                "Room ID": cells[0]["v"] if cells[0] and "v" in cells[0] else "",
                "Room Name": cells[1]["v"] if cells[1] and "v" in cells[1] else "",
                "Capacity": int(cells[2]["v"]) if cells[2] and "v" in cells[2] else 0,
                "Description": cells[3]["v"] if cells[3] and "v" in cells[3] else "",
                "Image URL": cells[4]["v"] if cells[4] and "v" in cells[4] else ""
            })

        return parsed_rooms

    except Exception as e:
        print(f"An error occurred: {e}")
        return []

def fetch_data_from_google_sheets(sheet_url):
    """Fetch and parse data from Google Sheets with proper date handling for rates"""
    try:
        # Fetching the raw data from the sheet URL
        response = requests.get(sheet_url)
        if response.status_code == 200:
            raw_data = response.text

            # Remove the comment /*O_o*/ at the start of the response
            raw_data = raw_data.replace('/*O_o*/', '').strip()

            # Extract the JSON data
            match = re.search(r'google\.visualization\.Query\.setResponse\((\{.*\})\);', raw_data)
            if match:
                json_str = match.group(1)
                json_data = json.loads(json_str)

                if "table" in json_data:
                    table = json_data["table"]
                    rows = table.get("rows", [])
                    cols = table.get("cols", [])

                    # First row contains headers (dates)
                    if not rows:
                        return []

                    # Get date columns from first row (skip first two columns which are Room ID and Rate ID)
                    date_columns = []
                    first_row_cells = rows[0].get("c", [])
                    for cell in first_row_cells[2:]:  # Skip first two columns
                        if "f" in cell:  # Formatted value contains the date
                            date_columns.append(cell["f"])
                        elif "v" in cell:  # Fallback to raw value
                            date_columns.append(str(cell["v"]))
                        else:
                            date_columns.append("")

                    result = []
                    # Process each row (skip first row which is header)
                    for row in rows[1:]:
                        row_data = {}
                        cells = row.get("c", [])

                        # Room ID (first column)
                        if len(cells) > 0:
                            row_data["Room ID"] = cells[0].get("v", "")

                        # Rate ID (second column)
                        if len(cells) > 1:
                            row_data["Rate ID"] = cells[1].get("v", "")

                        # Date rates (remaining columns)
                        for i in range(2, len(cells)):
                            if i-2 < len(date_columns):
                                date = date_columns[i-2]
                                if date:  # Only add if we have a date
                                    # Use formatted value if available, otherwise raw value
                                    cell_value = cells[i].get("f") if "f" in cells[i] else cells[i].get("v")
                                    row_data[date] = cell_value

                        result.append(row_data)

                    return result
                else:
                    print("❌ No table found in the data")
                    return None
            else:
                print("❌ Unable to extract JSON from response")
                return None
        else:
            print(f"❌ Failed to fetch data, Status Code: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Error fetching data: {e}")
        return None


def is_room_available(room_id, availability_data, check_in, check_out):
    """Check if a room is available for the given date range"""
    try:
        check_in_date = datetime.strptime(check_in, "%Y-%m-%d")
        check_out_date = datetime.strptime(check_out, "%Y-%m-%d")

        # Validate dates
        if check_in_date >= check_out_date:
            print("⚠️ Invalid date range: check-in must be before check-out")
            return False

        # Find the room's availability data
        room_availability = None
        for row in availability_data:
            if str(row.get("Room ID", "")) == str(room_id):
                room_availability = row
                break

        if not room_availability:
            print(f"⚠️ No availability data found for room ID {room_id}")
            return False

        # Check each date in the range
        current_date = check_in_date
        while current_date < check_out_date:
            date_str = current_date.strftime("%Y-%m-%d")

            # Check if the date is in the data and is available
            if date_str not in room_availability or "✅ Available" not in str(room_availability.get(date_str, "")):
                return False

            # Move to next day
            current_date = current_date + timedelta(days=1)

        return True
    except Exception as e:
        print(f"Error checking availability: {str(e)}")
        return False

def get_cheapest_rate(room_id, rates_data, check_in, check_out):
    """Get the cheapest rate for a room across the date range"""
    try:
        check_in_date = datetime.strptime(check_in, "%Y-%m-%d")
        check_out_date = datetime.strptime(check_out, "%Y-%m-%d")

        # Validate dates
        if check_in_date >= check_out_date:
            print("⚠️ Invalid date range: check-in must be before check-out")
            return 0

        # Find room rates
        room_rates = None
        for row in rates_data:
            if str(row.get("Room ID", "")) == str(room_id):
                room_rates = row
                break

        if not room_rates:
            print(f"⚠️ No rate data found for room ID {room_id}")
            return 0

        # Debug: Print keys in the room_rates dictionary
        print(f"Available dates in rates data: {list(room_rates.keys())}")

        # Check each date in the range
        current_date = check_in_date
        total_nights = (check_out_date - check_in_date).days
        total_price = 0
        rates_found = 0

        while current_date < check_out_date:
            date_str = current_date.strftime("%Y-%m-%d")

            # Get price for this date
            try:
                if date_str in room_rates:
                    price = float(room_rates[date_str])
                    total_price += price
                    rates_found += 1
                    print(f"Found rate for {date_str}: ${price}")
                else:
                    print(f"No rate found for {date_str}")
            except (ValueError, TypeError) as e:
                print(f"Error parsing rate for {date_str}: {str(e)}")
                # If price isn't available or not a number, use a default
                pass

            # Move to next day
            current_date = current_date + timedelta(days=1)

        # Return average price per night if we found prices
        if rates_found > 0:
            avg_price = round(total_price / rates_found, 2)
            print(f"Average price per night: ${avg_price}")
            return avg_price
        else:
            # If no rates found for the dates, use a default or fall back to room list price
            print("No rates found for the selected dates")
            return 0
    except Exception as e:
        print(f"Error calculating rates: {str(e)}")
        return 0

@app.get("/rooms/")
def get_rooms(check_in: str, check_out: str):
    """Get rooms with availability and pricing for the given date range"""
    try:
        # Validate date format
        try:
            check_in_date = datetime.strptime(check_in, "%Y-%m-%d")
            check_out_date = datetime.strptime(check_out, "%Y-%m-%d")

            if check_in_date >= check_out_date:
                raise HTTPException(status_code=400, detail="Check-in date must be before check-out date")
        except ValueError:
            raise HTTPException(status_code=400, detail="Dates must be in YYYY-MM-DD format")

        # Fetch data from Google Sheets
        rooms = fetch_data_from_google_sheet_room(GOOGLE_SHEET_ROOMS_URL)
        availability = fetch_data_from_google_sheets(GOOGLE_SHEET_AVAILABILITY_URL)
        rates = fetch_data_from_google_sheets(GOOGLE_SHEET_RATES_URL)

        # Process each room
        result_rooms = []
        for room in rooms:
            room_id = str(room.get("Room ID", ""))
            if not room_id:
                continue

            # Check availability
            is_available = is_room_available(room_id, availability, check_in, check_out)

            # Get cheapest rate
            price = get_cheapest_rate(room_id, rates, check_in, check_out)

            # Build room data object
            room_data = {
                "id": room_id,
                "name": room.get("Room Name", ""),
                "description": room.get("Description", ""),
                "capacity": room.get("Capacity", ""),
                "image": room.get("Image URL", ""),
                "is_available": is_available,
                "price": price
            }
            result_rooms.append(room_data)

        return {"rooms": result_rooms, "total": len(result_rooms)}
    except Exception as e:
        print(f"Error in get_rooms: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/availability/")
def get_availability():
    """Get raw availability data for debugging"""
    try:
        availability = fetch_data_from_google_sheets(GOOGLE_SHEET_AVAILABILITY_URL)
        return {"success": True, "count": len(availability), "availability": availability}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.get("/rates/")
def get_rates():
    """Get raw rates data for debugging"""
    try:
        rates = fetch_data_from_google_sheets(GOOGLE_SHEET_RATES_URL)
        return {
            "success": True,
            "count": len(rates),
            "rates": rates
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)



({"version":"0.6","reqId":"0","status":"ok","sig":"1762555566","table":

  { "cols":  [ 
    {"id":"A","label":"Room ID","type":"string"},
    {"id":"B","label":"Name","type":"string"},
    {"id":"C","label":"Max Guests","type":"number","pattern":"General"},
    {"id":"D","label":"Description","type":"string"},
    {"id":"E","label":"Image URL","type":"string"}
    ],
    "rows":  [
        {"c": [ 
            {"v":"1"},
            {"v":"Upupu"},
            {"v":2.0,"f":"2"},
            {"v":"A modern style, uniquely decorated accessible room, inspired by the Hoopoe bird, which can be found in our garden, you will need to be lucky to spot one. With a King bed, this room is situated on the ground floor of the house with its own private garden, near the reception. This room offers a very unique bathroom inside our 12th century stone tower, with a modern shower, anti-fog mirror and electronic bidet toilet. 27sqm + Private Garden"},
            {"v":"https://static.wixstatic.com/media/d681db_cbd47f15630c4092b4c08a1c4554743f~mv2.png/v1/fill/w_762,h_710,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/Screen%20Shot%202024-05-23%20at%209_58_30%20AM.png"}
            ]
        }, 
        {"c": [
            {"v":"2"},
            {"v":"Cinghiale"},
            {"v":3.0,"f":"3"},
            {"v":"A modern style, uniquely decorated accessible apartment inspired by the wild Boar of Tuscany. With a King Sized bed, and a separate room for living with a bar, sofa, coffee table & chairs, this room can host 2 people, or on request, 4, with an extra bed set up in the living room. Located on the ground floor, it has its own private garden accessible from both the bedroom and living room. The bathroom offers a modern shower, anti-fog mirror and electronic bidet toilet. 46sqm + Private Garden"},
            {"v":"https://static.wixstatic.com/media/d681db_58a6cb21d8764654aed9f14c28364119~mv2.jpg/v1/fill/w_291,h_272,al_c,lg_1,q_80,enc_avif,quality_auto/d681db_58a6cb21d8764654aed9f14c28364119~mv2.jpg"}
            ]
        }, 
        {"c": [
            {"v":"3"},
            {"v":"Volpe"},
            {"v":2.0,"f":"2"},
            {"v":"A modern style, uniquely decorated room, inspired by the Fox we see in and around our farm and garden. With a King Sized Bed this room is located on the 1st floor of the house, accessed via stairs. Its bathroom is very unique, inside our 12th century stone tower, with a modern shower, stone bathtub, anti-fog mirror and electronic bidet toilet. 27sqm"},
            {"v":"https://static.wixstatic.com/media/d681db_8ce8857f04a1404cb9ce087df536103a~mv2.jpg/v1/fill/w_291,h_272,al_c,lg_1,q_80,enc_avif,quality_auto/d681db_8ce8857f04a1404cb9ce087df536103a~mv2.jpg"}
            ]
        },
        {"c": [
                {"v":"4"},
                {"v":"Fagiano"}, 
                {"v":2.0,"f":"2"},
                {"v":"A modern style, uniquely decorated room inspired by the local Pheasant we often see in our farm. With a king sized bed this room is located on the 1st floor of the house, via stairs. The room opens to a private section of a south facing, outdoor terrace, with views over our garden. The bathroom has a modern shower, anti-fog mirror and electronic bidet toilet. 26sqm + Garden View Terrace"},
                {"v":"https://static.wixstatic.com/media/d681db_7bb1b49213db458fad9069a7beeef59b~mv2.png/v1/fill/w_674,h_628,al_c,q_90,enc_avif,quality_auto/d681db_7bb1b49213db458fad9069a7beeef59b~mv2.png"}
                ]
        }, 
        { "c": [ 
                    {"v":"5"},
                    {"v":"Cervo"},
                    {"v":2.0,"f":"2"},
                    {"v":"A modern style, uniquely decorated room inspired by the local Deer we often see in our farm. With a king sized bed, this room is located on the 1st floor of the house, via stairs. The room opens to a private section of a south facing, outdoor terrace, with views over our garden. The bathroom has a modern shower, anti-fog mirror and electronic bidet toilet. 26sqm + Garden View Terrace"},
                    {"v":"https://static.wixstatic.com/media/d681db_a7ed110d20414237922336967989dd52~mv2.jpg/v1/fill/w_576,h_576,al_c,lg_1,q_80,enc_avif,quality_auto/d681db_a7ed110d20414237922336967989dd52~mv2.jpg"}
                    ]
        },
        { "c": [ 
                {"v":"6"},
                {"v":"Faraona"},
                {"v":2.0,"f":"2"},
                {"v":"A modern style, uniquely decorated and laid out room inspired by the Guinea Fowl which we have as pets on our farm. With a king sized bed & walk in wardrobe, this room offers views over the garden with a Juliet balcony. The room is on the 2nd floor of the house, accessible by 2 flights of stairs. The bathroom has a unique layout, with a modern shower, stone bathtub, anti-fog mirror and electronic bidet toilet. 35sqm"},
                {"v":"https://static.wixstatic.com/media/860fa5_8c3ad071635e4903a4113fb6a0790541~mv2.jpg/v1/fill/w_762,h_762,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/860fa5_8c3ad071635e4903a4113fb6a0790541~mv2.jpg"}
                ]
        },  
        {"c": [ 
                {"v":"7"},
                {"v":"Fenicottero"},
                {"v":2.0,"f":"2"},
                {"v":"A modern style, uniquely decorated room inspired by the beautiful Flamingos of Orbetello lake in southern Tuscany, the biggest flamboyance of flamingos in Europe. With a king sized bed, this room has panoramic windows with vineyard & garden views. The room is on the 2nd floor of the house, accessible by 2 flights of stairs. The bathroom offers a modern shower, anti-fog mirror and electronic bidet toilet. 26sqm"},
                {"v":"https://static.wixstatic.com/media/d681db_bf47ecba28734f6ca307b1c68c63d3cd~mv2.png/v1/fill/w_672,h_672,al_c,q_90,enc_avif,quality_auto/d681db_bf47ecba28734f6ca307b1c68c63d3cd~mv2.png"}
                ]
        }, 
        {"c": [ 
                  {"v":"8"},
                  {"v":"Lupo"},
                  {"v":3.0,"f":"3"},
                  {"v":"A modern style, uniquely decorated room inspired by the Wolf, which we sometimes see around us in March or April. With a large bedroom with King Sized bed, panoramic views over the vineyard and a sky windows in both the bedroom and bathroom. This room offers a very unique, 6m high bathroom inside our 12th century stone tower together with a modern shower, circular stone bathtub, anti-fog mirror and electronic bidet toilet. 40sqm"},
                  {"v":"https://static.wixstatic.com/media/d681db_b20d704bed2942d08186b6ad89c0ff73~mv2.jpg/v1/fill/w_533,h_533,al_c,q_80,enc_avif,quality_auto/d681db_b20d704bed2942d08186b6ad89c0ff73~mv2.jpg"}
                  ]
        }
    ],"parsedNumHeaders":1 }
})