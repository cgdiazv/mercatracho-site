// app/page.tsx
import { CATEGORY_URLS } from './lib/urls';
import NewsCard from '@/components/NewsCard';

async function getInoreaderNews(categoryKey: string) {
  const URL = CATEGORY_URLS[categoryKey];
  const res = await fetch(URL, { next: { revalidate: 21600 } }); // 6 horas
  
  if (!res.ok) {
    throw new Error(`Error al cargar la categoría: ${categoryKey}`);
  }

  const data = await res.json();
  return data.items;
}

export default async function HomePage() {
  const articles = await getInoreaderNews('nacionales');

  return (
    <main className="max-w-7xl mx-auto px-6 pt-4 pb-10">
      {/* Cambiamos gap-8 por gap-4 para reducir el espacio entre cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article: any, index: number) => (
          <div 
            key={article.id} 
            className={index === 0 ? "md:col-span-2 lg:col-span-2" : ""}
          >
            <NewsCard article={article} />
          </div>
        ))}
      </div>
    </main>
  );
}