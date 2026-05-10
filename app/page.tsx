// app/page.tsx
import { CATEGORY_URLS } from './lib/urls';
import NewsCard from '@/components/NewsCard';

async function getInoreaderNews(categoryKey: string) {
  const URL = CATEGORY_URLS[categoryKey];
  const res = await fetch(URL, { next: { revalidate: 600 } });
  
  if (!res.ok) {
    throw new Error(`Error al cargar la categoría: ${categoryKey}`);
  }

  const data = await res.json();
  return data.items;
}

export default async function HomePage() {
  const articles = await getInoreaderNews('nacionales');

  return (
    <main className="max-w-7xl mx-auto p-4">
      {/* He eliminado la columna de temperatura. 
         Ahora el contenedor de noticias ocupa las 12 columnas del grid.
      */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((article: any, index: number) => (
              <div key={article.id} className={index === 0 ? "md:col-span-2" : ""}>
                <NewsCard article={article} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}