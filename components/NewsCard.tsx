"use client";

import { useState, useEffect } from 'react';

export default function NewsCard({ article, categoryName }: { article: any, categoryName?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // --- LÓGICA DE EXTRACCIÓN DE IMÁGENES (Tu código original) ---
  const attachmentUrl = article.attachments?.[0]?.url;
  const contentHtml = article.content_html || "";
  const imageMatch = contentHtml.match(/<img[^>]+src="([^">]+)"/);
  const internalImgUrl = imageMatch ? imageMatch[1] : null;

  const finalImageUrl = attachmentUrl || internalImgUrl;
  const datePublished = article.date_published;

  // --- NUEVA LÓGICA: EXTRACCIÓN DE CARPETA DE INOREADER ---
  const getAutoCategory = () => {
    // Si ya pasaste una categoría por prop, úsala
    if (categoryName) return categoryName;
    
    // Si no, búscala en el array de categories del JSON
    const categories = article.categories || [];
    const folderTag = categories.find((cat: string) => cat.includes('label/'));
    
    if (folderTag) {
      return folderTag.split('/').pop(); // Extrae "Deportes", "Economía", etc.
    }
    
    return "Noticia"; // Fallback
  };

  const displayCategory = getAutoCategory();

  if (!mounted) {
    return <div className="p-4 border rounded-xl bg-gray-50 h-64 animate-pulse" />;
  }

  return (
    <div className="bg-white border border-[#ebf0f6] rounded-xl overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-shadow duration-300 group">
      
      {/* Contenedor de Imagen */}
      <div className="relative h-52 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
        {finalImageUrl ? (
          <img 
            src={finalImageUrl}
            alt={article.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x250?text=Mercatracho";
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-[#2175eb]/20">
            <span className="text-2xl font-black tracking-tighter uppercase italic">mercatracho</span>
          </div>
        )}
        
        {/* Badge de Categoría sobre la imagen (opcional, se ve muy Pro) */}
        <div className="absolute top-3 left-3">
          <span className="bg-[#2175eb] text-white text-[9px] font-black uppercase px-2 py-1 rounded shadow-sm tracking-widest">
            {displayCategory}
          </span>
        </div>
      </div>

      {/* Contenido de la Tarjeta */}
      <div className="p-5 flex flex-col flex-grow">
        
        {/* Fecha estilizada */}
        {datePublished && (
          <span className="text-[10px] text-gray-400 font-bold uppercase mb-2 tracking-tight">
            {new Date(datePublished).toLocaleDateString('es-HN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </span>
        )}

        {/* Título con tu font-medium 20px */}
        <h2 className="font-medium text-[20px] leading-[26px] text-[#222222] mb-4 line-clamp-3 group-hover:text-[#2175eb] transition-colors">
          {article.title}
        </h2>
        
        {/* Footer con Fuente (Origin) */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-gray-400 text-[10px] uppercase font-bold tracking-tighter">
            {article.author || "Redacción"}
          </span>
          <span className="text-[#2175eb] text-[10px] uppercase tracking-widest font-black">
             {article._feed_title || "Mercatracho"}
          </span>
        </div>
      </div>
    </div>
  );
}