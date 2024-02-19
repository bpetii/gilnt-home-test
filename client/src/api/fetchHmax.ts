export const fetchHmax = async (selectedPosition: [number, number]) => {
    try {
      const response = await fetch(`http://localhost:3000/api/climate_data?latitude=${selectedPosition[0]}&longitude=${selectedPosition[1]}`);
      const data = await response.json();
      return {value: data.hmax, unit: data.unit};
    } catch (error) {
        throw new Error('Error fetching climate data')
    }
};
