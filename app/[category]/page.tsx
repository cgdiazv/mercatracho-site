// app/[category]/page.tsx
import { CATEGORY_URLS } from '../lib/urls';
import NewsCard from '@/components/NewsCard';

async function getNews(category: string) {
  const url = CATEGORY_URLS[category];
  
  if (!url) return []; // Si la categoría no existe, devuelve vacío

  const res = await fetch(url, { next: { revalidate: 600 } });
  const data = await res.json();
  return data.items;
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const { category } = params;
  const articles = await getNews(category);

  return (
    <main className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold uppercase mb-6 border-b-4 border-blue-900 inline-block">
        {category}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {articles.map((article: any) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </main>
  );
}