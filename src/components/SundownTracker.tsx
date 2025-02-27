'use client';

import { useState, useEffect } from 'react';
import SunCalc from 'suncalc';

interface City {
  name: string;
  latitude: number;
  longitude: number;
  timeZone: string;
}

const majorCities: City[] = [
  { name: 'New York', latitude: 40.7128, longitude: -74.0060, timeZone: 'America/New_York' },
  { name: 'London', latitude: 51.5074, longitude: -0.1278, timeZone: 'Europe/London' },
  { name: 'Tokyo', latitude: 35.6762, longitude: 139.6503, timeZone: 'Asia/Tokyo' },
  { name: 'Paris', latitude: 48.8566, longitude: 2.3522, timeZone: 'Europe/Paris' },
  { name: 'Sydney', latitude: -33.8688, longitude: 151.2093, timeZone: 'Australia/Sydney' },
  { name: 'Dubai', latitude: 25.2048, longitude: 55.2708, timeZone: 'Asia/Dubai' },
  { name: 'Singapore', latitude: 1.3521, longitude: 103.8198, timeZone: 'Asia/Singapore' },
  { name: 'Los Angeles', latitude: 34.0522, longitude: -118.2437, timeZone: 'America/Los_Angeles' },
  { name: 'Berlin', latitude: 52.5200, longitude: 13.4050, timeZone: 'Europe/Berlin' },
  { name: 'Cairo', latitude: 30.0444, longitude: 31.2357, timeZone: 'Africa/Cairo' },
  { name: 'Mumbai', latitude: 19.0760, longitude: 72.8777, timeZone: 'Asia/Kolkata' },
  { name: 'Rio de Janeiro', latitude: -22.9068, longitude: -43.1729, timeZone: 'America/Sao_Paulo' },
  { name: 'Moscow', latitude: 55.7558, longitude: 37.6173, timeZone: 'Europe/Moscow' },
  { name: 'Mexico City', latitude: 19.4326, longitude: -99.1332, timeZone: 'America/Mexico_City' },
  { name: 'Toronto', latitude: 43.6532, longitude: -79.3832, timeZone: 'America/Toronto' },
];

export default function SundownTracker() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [cities, setCities] = useState<Array<City & { currentTime: string; sundownTime: string }>>([]); 

  // Update the current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      updateCityTimes();
    }, 1000);

    // Initialize city times
    updateCityTimes();

    return () => clearInterval(timer);
  }, []);

  // Calculate and format times for each city
  const updateCityTimes = () => {
    const now = new Date();
    
    const updatedCities = majorCities.map(city => {
      // Get current time in city's timezone
      const cityCurrentTime = new Date(now.toLocaleString('en-US', { timeZone: city.timeZone }));
      
      // Calculate sundown time
      const sunTimes = SunCalc.getTimes(
        new Date(cityCurrentTime.getFullYear(), cityCurrentTime.getMonth(), cityCurrentTime.getDate()),
        city.latitude,
        city.longitude
      );
      
      // Format times
      const formattedCurrentTime = cityCurrentTime.toLocaleTimeString('en-US', {
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      });
      
      const formattedSundownTime = sunTimes.sunset.toLocaleTimeString('en-US', {
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true,
        timeZone: city.timeZone
      });
      
      return {
        ...city,
        currentTime: formattedCurrentTime,
        sundownTime: formattedSundownTime
      };
    });
    
    setCities(updatedCities);
  };

  // Filter cities based on search term
  const filteredCities = cities.filter(city => 
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Sundown Times for Major Cities
      </h1>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search cities..."
          className="w-full p-2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCities.map((city) => (
          <div 
            key={city.name} 
            className="border border-gray-200 rounded p-4 shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold mb-2">{city.name}</h2>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-gray-500">Current Time</p>
                <p className="font-medium">{city.currentTime}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Sundown Time</p>
                <p className="font-medium">{city.sundownTime}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredCities.length === 0 && (
        <p className="text-center text-gray-500 my-8">No cities found matching &quot;{searchTerm}&quot;</p>
      )}
      
      <p className="text-xs text-gray-400 text-center mt-8">
        Last updated: {currentTime.toLocaleTimeString()}
      </p>
    </div>
  );
}