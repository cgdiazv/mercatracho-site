'use client';

import { useState, useEffect } from 'react';

interface WeatherProps {
  cityQuery: string;
  displayName: string;
}

export default function Weather({ cityQuery, displayName }: WeatherProps) {
  const [data, setData] = useState<{ temp: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityQuery}&units=metric&appid=${API_KEY}`;
        
        const res = await fetch(url);
        const json = await res.json();

        if (json.main) {
          setData({ temp: Math.round(json.main.temp) });
        }
      } catch (error) {
        console.error(`Error al cargar el clima de ${displayName}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [cityQuery, displayName]);

  if (loading || !data) {
    return (
      <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-[#ebf0f6] animate-pulse">
        <div className="w-6 h-3 bg-gray-100 rounded"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-[#ebf0f6] shadow-sm">
      <span className="text-[11px] font-bold text-[#222222] uppercase tracking-wider">
        {displayName}
      </span>
      
      <div className="h-3 w-[1px] bg-gray-300"></div>
      
      <span className="text-[12px] font-bold text-[#2175eb]">
        {data.temp}°C
      </span>

      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-orange-400">
        <path d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2ZM10 15a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 15ZM10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM15.657 4.343a.75.75 0 0 1 0 1.06l-1.06 1.061a.75.75 0 1 1-1.061-1.06l1.06-1.061a.75.75 0 0 1 1.061 0ZM6.464 13.536a.75.75 0 0 1 0 1.06l-1.06 1.061a.75.75 0 1 1-1.061-1.06l1.06-1.061a.75.75 0 0 1 1.061 0ZM18 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 18 10ZM5 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 5 10ZM15.657 15.657a.75.75 0 0 1-1.06 0l-1.061-1.06a.75.75 0 1 1 1.06-1.061l1.061 1.06a.75.75 0 0 1 0 1.06ZM6.464 6.464a.75.75 0 0 1-1.06 0l-1.061-1.06a.75.75 0 0 1 1.06-1.061l1.061 1.06a.75.75 0 0 1 0 1.06Z" />
      </svg>
    </div>
  );
}