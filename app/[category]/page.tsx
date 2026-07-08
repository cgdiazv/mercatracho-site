// app/[category]/page.tsx
import { CATEGORY_URLS } from '../lib/urls';
import NewsList from '@/components/NewsList';
import Weather from '@/components/Weather';

// Tipado para Next.js 15
interface CategoryParams {
  params: Promise<{ category: string }>;
}

async function getCategoryData(categoryKey: string) {
  const url = CATEGORY_URLS[categoryKey];
  
  if (!url) return null;

  try {
    const res = await fetch(url, { 
      next: { revalidate: 21600 } 
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error cargando categoría:", error);
    return null;
  }
}

export default async function CategoryPage({ params }: CategoryParams) {
  const resolvedParams = await params;
  const categoryKey = resolvedParams.category.toLowerCase();
  
  const data = await getCategoryData(categoryKey);

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Sección no encontrada</h1>
        <p className="text-gray-500 mt-2">La categoría "{categoryKey}" no está configurada.</p>
      </div>
    );
  }

  const getDisplayName = (url: string) => {
    if (!url) return categoryKey;
    const cleanUrl = url.replace(/\\/g, ''); 
    const parts = cleanUrl.split('/');
    const index = parts.findIndex(p => p === 'tag' || p === 'label');
    return index !== -1 ? decodeURIComponent(parts[index + 1]) : categoryKey;
  };

  const displayName = getDisplayName(data.feed_url);

  return (
    <main className="max-w-7xl mx-auto px-6 py-6">
      {/* Header Compacto */}
      <header className="mb-6 pt-4 border-b border-gray-100 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-y-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#2175eb] rounded-full" />
            <h1 className="text-3xl font-black uppercase tracking-tighter text-[#222222]">
              {displayName}
            </h1>
          </div>
          <p className="text-gray-400 text-[10px] uppercase font-bold tracking-[0.2em] ml-4.5 mt-1">
            Mercatracho {displayName}
          </p>
        </div>

        <div className="flex items-center gap-2 ml-4.5 md:ml-0 md:self-center">
          <Weather cityQuery="San Pedro Sula,HN" displayName="SPS" />
          <Weather cityQuery="Tegucigalpa,HN" displayName="TGU" />
        </div>
      </header>

      {/* Lista de noticias con botón de cargar más */}
      <NewsList 
        initialArticles={data.items || []} 
        initialContinuation={data.continuation || ""}
        categoryName={displayName}
        categoryKey={categoryKey}
      />
    </main>
  );
}