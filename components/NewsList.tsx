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
      // Llamamos a tu route.ts pasándole la categoría y el token actual
      const res = await fetch(`/api/news?category=${categoryKey}&c=${continuation}`);
      
      if (!res.ok) throw new Error("Error en la respuesta de la API");
      
      const data = await res.json();

      if (data.items && data.items.length > 0) {
        // Unimos los artículos nuevos a los que ya teníamos
        setArticles(prev => [...prev, ...data.items]);
        // ¡IMPORTANTE! Actualizamos el token con el nuevo que mandó Inoreader
        setContinuation(data.continuation || "");
      } else {
        // Si no vienen items, matamos el token para que desaparezca el botón
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
            key={`${article.id}-${index}`} // Key única para evitar errores de React
            className={index === 0 ? "md:col-span-2 lg:col-span-2" : ""}
          >
            <NewsCard article={article} categoryName={categoryName} />
          </div>
        ))}
      </div>

      {/* Solo mostramos el botón si hay un token de continuación */}
      {continuation && (
        <div className="mt-12 mb-20">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-10 py-4 bg-white border-2 border-[#2175eb] text-[#2175eb] text-[13px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-[#2175eb] hover:text-white transition-all duration-300 shadow-sm disabled:opacity-50 flex items-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#2175eb] border-t-transparent rounded-full animate-spin"></div>
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