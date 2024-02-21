import xarray as xr
import pandas as pd

def process_netcdf_file(ds, latitude, longitude):    
    # Extract location coordinates
    data_at_specific_location = ds.sel(latitude = latitude, longitude = longitude, method='nearest')
    
    max_wave_height = data_at_specific_location.hmax.values.max()
    return max_wave_height

def update_database(locations, max_wave_height, date):
    # Update the database with the maximum wave height for the day
    print(f"Date: {date}, Max Wave Height: {max_wave_height}")

def main():
    latitude = float(sys.argv[1])
    longitude = float(sys.argv[2])

    # Load list of processed files from a database or file
    processed_files = set()
    
    for file_path in get_new_files():
        if file_path not in processed_files:
            # Extract date from the netcdf file
            ds = xr.open_dataset(file_path)
            date_string = ds.time.values.max()
            date_format = '%Y-%m-%d'
            date = datetime.strptime(date_string, date_format) # i.e: 2022-02-15

            # Process the netCDF file
            max_wave_height = process_netcdf_file(ds)

            # Update the database with the maximum wave height for each location
            update_database(max_wave_height, latitude, longitude, date)

            # Add the processed file to the set of processed files
            processed_files.add(file_path)

    print("Processed files:", processed_files)

def get_new_files():
    # Function to retrieve new or updated netCDF files since the last run
    return ['path/to/file1.nc', ...]

if __name__ == "__main__":
    main()