import xarray as xr
import json
import sys
import os

def process_data(latitude, longitude):

    # Get the current directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Construct the file path
    filename = os.path.join(current_dir, "waves_2019-01-01.nc")
    
    # Open the NetCDF file
    ds = xr.open_dataset(filename)

    data_at_specific_location = ds.sel(latitude = latitude, longitude = longitude, method='nearest')

    max_value = data_at_specific_location.hmax.values.max()
    unit = data_at_specific_location.hmax.units

    return json.dumps({'max_value': float(max_value), 'unit': unit})

if __name__ == "__main__":
    latitude = float(sys.argv[1])
    longitude = float(sys.argv[2])
    result = process_data(latitude, longitude)
    print(result)
