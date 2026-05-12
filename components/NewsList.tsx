"use client";

import { useState } from 'react';
import NewsCard from './NewsCard';

export default function NewsList({ 
  initialArticles, 
  initialContinuation, 
  categoryName,
  categoryKey 
}: { 
  initialArticles: any[], 
  initialContinuation: string,
  categoryName: string,
  categoryKey: string
}) {
  const [articles, setArticles] = useState(initialArticles);
  const [continuation, setContinuation] = useState(initialContinuation);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (!continuation || loading) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/news?category=${categoryKey}&c=${continuation}`);
      
      if (!res.ok) throw new Error("Error en la respuesta de la API");
      
      const data = await res.json();

      if (data.items && data.items.length > 0) {
        setArticles(prev => [...prev, ...data.items]);
        setContinuation(data.continuation || "");
      } else {
        setContinuation("");
      }
    } catch (error) {
      console.error("Error cargando más noticias:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {articles.map((article, index) => (
          <div 
            key={`${article.id}-${index}`} 
            className={index === 0 ? "md:col-span-2 lg:col-span-2" : ""}
          >
            {/* Pasamos categoryName. Si viene de la Home, NewsCard usará su lógica de detección mejorada */}
            <NewsCard article={article} categoryName={categoryName} />
          </div>
        ))}
      </div>

      {continuation && (
        <div className="mt-12 mb-20">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-10 py-4 bg-white border-2 border-[#2175eb] text-[#2175eb] text-[13px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-[#2175eb] hover:text-white transition-all duration-300 shadow-sm disabled:opacity-50 flex items-center gap-3 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                Cargando...
              </>
            ) : (
              "Cargar más noticias"
            )}
          </button>
        </div>
      )}
    </div>
  );
}