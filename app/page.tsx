import { CATEGORY_URLS } from './lib/urls';
import NewsList from '@/components/NewsList';
import Weather from '@/components/Weather';

async function getAllNews() {
  const categoriesToMix = ['nacionales', 'deportes', 'economia', 'entretenimiento', 'salud', 'tecnologia'];
  
  try {
    const requests = categoriesToMix.map(key => 
      fetch(CATEGORY_URLS[key], { next: { revalidate: 3600 } })
        .then(res => res.json())
        .catch(() => ({ items: [] }))
    );

    const results = await Promise.all(requests);

    let allArticles: any[] = [];
    results.forEach(data => {
      if (data.items) {
        allArticles = [...allArticles, ...data.items];
      }
    });

    allArticles.sort((a, b) => {
      const dateA = a.published || new Date(a.date_published).getTime() / 1000;
      const dateB = b.published || new Date(b.date_published).getTime() / 1000;
      return dateB - dateA;
    });

    return allArticles.slice(0, 45);
  } catch (error) {
    console.error("Error mezclando noticias:", error);
    return [];
  }
}

export default async function HomePage() {
  const articles = await getAllNews();

  return (
    <main className="max-w-7xl mx-auto px-6 py-6">
      {/* Header de Portada Principal */}
      <header className="mb-8 pt-4 border-b border-gray-100 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-y-4">
        
        {/* Lado Izquierdo: Título y Subtítulo */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-6 bg-[#2175eb] rounded-full" />
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-[#222222]">
              Últimas Noticias
            </h1>
          </div>
          
          <p className="text-gray-400 text-[10px] uppercase font-bold tracking-[0.2em] ml-4.5">
            Lo más reciente de Honduras y el Mundo
          </p>
        </div>

        {/* Lado Derecho (Desktop) / Abajo de todo (Mobil) */}
        <div className="flex items-center gap-2 ml-4.5 md:ml-0 md:self-center">
          <Weather cityQuery="San Pedro Sula,HN" displayName="SPS" />
          <Weather cityQuery="Tegucigalpa,HN" displayName="TGU" />
        </div>

      </header>

      {/* Listado de Noticias */}
      <NewsList 
        initialArticles={articles} 
        initialContinuation="" 
        categoryName="" 
        categoryKey="" 
      />
    </main>
  );
}