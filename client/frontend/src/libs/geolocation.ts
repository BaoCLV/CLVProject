// Function to fetch country by city name in English
export const getCountryByCity = async (city: string): Promise<string | null> => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)}&key=${process.env.NEXT_PUBLIC_OPENCAGE_API_KEY}&limit=1&language=en`
      );
  
      if (!response.ok) {
        console.error('Failed to fetch data from OpenCage API:', response.statusText);
        return null;
      }
  
      const data = await response.json();
  
      const results = data.results;
      if (results && results.length > 0) {
        const country = results[0].components.country;
        return country || null;
      }
  
      return null;
    } catch (error) {
      console.error('Error fetching country:', error);
      return null;
    }
  };
  