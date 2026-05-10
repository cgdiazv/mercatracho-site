"use client";

import { useState, useEffect } from 'react';

export default function NewsCard({ article, categoryName }: { article: any, categoryName?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // --- LÓGICA DE EXTRACCIÓN (Basada en tu JSON de Inoreader) ---
  const attachmentUrl = article.attachments?.[0]?.url;
  const contentHtml = article.content_html || "";
  const imageMatch = contentHtml.match(/<img[^>]+src="([^">]+)"/);
  const internalImgUrl = imageMatch ? imageMatch[1] : null;

  const finalImageUrl = attachmentUrl || internalImgUrl;
  const datePublished = article.date_published;

  if (!mounted) {
    return <div className="p-4 border rounded-xl bg-gray-50 h-64 animate-pulse" />;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-shadow duration-300">
      
      {/* Contenedor de Imagen */}
      <div className="relative h-48 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
        {finalImageUrl ? (
          <img 
            src={finalImageUrl}
            alt={article.title}
            className="object-cover w-full h-full"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x250?text=Mercatracho";
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-blue-200">
            <span className="text-2xl font-black tracking-tighter uppercase italic">mercatracho</span>
          </div>
        )}
      </div>

      {/* Contenido de la Tarjeta */}
      <div className="p-4 flex flex-col flex-grow">
        
        {/* Fecha */}
        {datePublished && (
          <span className="text-[10px] text-[#2175eb] font-bold uppercase mb-1">
            {new Date(datePublished).toLocaleDateString('es-HN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </span>
        )}

        {/* Título (Ahora tiene más peso visual) */}
        <h2 className="font-medium text-[20px] leading-[24px] text-[#222222] mb-4 line-clamp-3">
          {article.title}
        </h2>
        
        {/* Footer con Categoría */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-end text-blue-900 text-[10px] uppercase tracking-widest font-bold">
          <span>{categoryName || "Noticia"}</span>
        </div>
      </div>
    </div>
  );
}