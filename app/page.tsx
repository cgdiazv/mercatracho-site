// app/page.tsx
import { CATEGORY_URLS } from './lib/urls';
import NewsList from '@/components/NewsList';

async function getAllNews() {
  // 1. Definimos qué categorías queremos mezclar en la portada
  const categoriesToMix = ['nacionales', 'deportes', 'economia', 'entretenimiento', 'salud','tecnologia'];
  
  try {
    // 2. Ejecutamos todas las peticiones en paralelo para máxima velocidad
    const requests = categoriesToMix.map(key => 
      fetch(CATEGORY_URLS[key], { next: { revalidate: 3600 } })
        .then(res => res.json())
        .catch(() => ({ items: [] })) // Si una falla, retornamos vacio
    );

    const results = await Promise.all(requests);

    // 3. Unimos todos los artículos en una sola lista
    let allArticles: any[] = [];
    results.forEach(data => {
      if (data.items) {
        allArticles = [...allArticles, ...data.items];
      }
    });

    // 4. ORDENAMOS POR FECHA (de la más reciente a la más antigua)
    // Usamos 'published' o 'date_published' según lo que envíe Inoreader
    allArticles.sort((a, b) => {
      const dateA = a.published || new Date(a.date_published).getTime() / 1000;
      const dateB = b.published || new Date(b.date_published).getTime() / 1000;
      return dateB - dateA;
    });

    // 5. Limitamos a los primeros 40-50 artículos para la portada
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
      <header className="mb-8 pt-4 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
           <div className="w-1.5 h-6 bg-[#2175eb] rounded-full" />
           <h1 className="text-3xl font-black uppercase tracking-tighter text-[#222222]">
            Últimas Noticias
          </h1>
        </div>
        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-[0.2em] ml-4.5 mt-1">
          Lo más reciente de Honduras y el Mundo
        </p>
      </header>

      {/* Usamos NewsList. 
        Nota: Al ser una mezcla, pasamos categoryKey="nacionales" 
        como base para el botón de "Cargar más", 
        o podrías quitar el token de continuación para la portada mezclada.
      */}
      <NewsList 
        initialArticles={articles} 
        initialContinuation="" 
        categoryName="" // IMPORTANTE: Dejar vacío para que la Card busque su propia etiqueta
        categoryKey=""  // IMPORTANTE: Dejar vacío
      />
    </main>
  );
}