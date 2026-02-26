export const nhtsaService = {
  async decodeVin(vin: string) {
    try {
      const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`);
      if (!response.ok) throw new Error("Failed to fetch VIN data");
      
      const data = await response.json();
      const results = data.Results;
      
      const getValue = (variable: string) => {
        const item = results.find((r: any) => r.Variable === variable);
        return item ? item.Value : '';
      };

      return {
        year: getValue('Model Year'),
        make: getValue('Make'),
        model: getValue('Model'),
        vehicleType: getValue('Vehicle Type'),
        bodyClass: getValue('Body Class'),
        manufacturer: getValue('Manufacturer Name')
      };
    } catch (error) {
      console.error("NHTSA API Error:", error);
      throw error;
    }
  }
};
