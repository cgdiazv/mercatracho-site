import Link from 'next/link';
import { notFound } from 'next/navigation';

interface WeatherDetails {
  city: string;
  country: string;
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  description: string;
  sunrise: number;
  sunset: number;
}

async function getWeatherDetails(cityQuery: string): Promise<WeatherDetails | null> {
  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_KEY;

  if (!API_KEY) {
    return null;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityQuery)}&units=metric&appid=${API_KEY}&lang=es`;

  try {
    const res = await fetch(url, { next: { revalidate: 1800 } });

    if (!res.ok) {
      return null;
    }

    const json = await res.json();

    if (!json.main) {
      return null;
    }

    return {
      city: json.name ?? cityQuery,
      country: json.sys?.country ?? '',
      temp: Math.round(json.main.temp),
      feelsLike: Math.round(json.main.feels_like),
      tempMin: Math.round(json.main.temp_min),
      tempMax: Math.round(json.main.temp_max),
      humidity: json.main.humidity,
      pressure: json.main.pressure,
      windSpeed: json.wind?.speed ?? 0,
      description: json.weather?.[0]?.description ?? 'Sin descripción',
      sunrise: json.sys?.sunrise ?? 0,
      sunset: json.sys?.sunset ?? 0,
    };
  } catch (error) {
    console.error('Error cargando el clima completo:', error);
    return null;
  }
}

function formatHour(timestamp: number) {
  if (!timestamp) return '—';

  return new Intl.DateTimeFormat('es-HN', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(timestamp * 1000);
}

export default async function WeatherDetailsPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const cityQuery = decodeURIComponent(city);

  if (!cityQuery) {
    notFound();
  }

  const weather = await getWeatherDetails(cityQuery);

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-10">
      <Link
        href="/"
        className="mb-6 inline-flex items-center text-sm font-semibold text-[#2175eb] transition hover:underline"
      >
        ← Volver a noticias
      </Link>

      <section className="rounded-3xl border border-[#ebf0f6] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-400">
              Pronóstico actual
            </p>
            <h1 className="mt-2 text-3xl font-black uppercase tracking-tight text-[#222222]">
              {weather?.city ?? cityQuery}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {weather?.country ? `Región: ${weather.country}` : 'Consulta del clima en tiempo real'}
            </p>
          </div>

          <div className="rounded-2xl bg-[#f5f9ff] px-4 py-3 text-center">
            <p className="text-4xl font-black text-[#2175eb]">
              {weather ? `${weather.temp}°C` : '—'}
            </p>
            <p className="text-sm font-medium capitalize text-gray-600">
              {weather?.description ?? 'Sin datos disponibles'}
            </p>
          </div>
        </div>

        {weather ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">Sensación</p>
              <p className="mt-2 text-xl font-bold text-[#222222]">{weather.feelsLike}°C</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">Mín / Máx</p>
              <p className="mt-2 text-xl font-bold text-[#222222]">{weather.tempMin}° / {weather.tempMax}°</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">Humedad</p>
              <p className="mt-2 text-xl font-bold text-[#222222]">{weather.humidity}%</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">Viento</p>
              <p className="mt-2 text-xl font-bold text-[#222222]">{weather.windSpeed} m/s</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">Presión</p>
              <p className="mt-2 text-xl font-bold text-[#222222]">{weather.pressure} hPa</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">Amanecer</p>
              <p className="mt-2 text-xl font-bold text-[#222222]">{formatHour(weather.sunrise)}</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">Atardecer</p>
              <p className="mt-2 text-xl font-bold text-[#222222]">{formatHour(weather.sunset)}</p>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-gray-600">
            No se pudo cargar la información del clima en este momento. Intenta nuevamente más tarde.
          </div>
        )}
      </section>
    </main>
  );
}
