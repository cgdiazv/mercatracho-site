"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function NewsCard({ article, categoryName }: { article: any, categoryName?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // --- LÓGICA DE EXTRACCIÓN DE IMÁGENES ---
  const attachmentUrl = article.attachments?.[0]?.url;
  const contentHtml = article.content_html || "";
  const imageMatch = contentHtml.match(/<img[^>]+src="([^">]+)"/);
  const internalImgUrl = imageMatch ? imageMatch[1] : null;

  const finalImageUrl = attachmentUrl || internalImgUrl;
  const datePublished = article.date_published;

  // --- EXTRACCIÓN DE CATEGORÍA ---
  const getAutoCategory = () => {
    // 1. Si pasaste la categoría desde el page.tsx (nacionales, deportes, etc.)
    if (categoryName) return categoryName;
    
    // 2. Si no, buscar en las categorías de Inoreader
    const categories = article.categories || [];
    const folderTag = categories.find((cat: string) => cat.includes('label/'));
    
    if (folderTag) {
      return folderTag.split('/').pop() || "Nacionales";
    }
    
    return "Nacionales"; // Fallback seguro que SI existe en tu lib/urls.ts
  };

  const displayCategory = getAutoCategory();

  // --- GENERACIÓN DE SLUG PARA LA URL ---
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Quitar acentos para la URL
      .replace(/[^\w\s-]/g, '') 
      .replace(/[\s_-]+/g, '-') 
      .replace(/^-+|-+$/g, ''); 
  };

  // --- CONSTRUCCIÓN DE LA RUTA ---
  // Importante: El categorySlug debe ser exacto a tu archivo lib/urls.ts
  const categorySlug = displayCategory
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, ''); // Quitamos espacios para que "Economía y Negocios" sea "economia" si así está en tu archivo

  const slug = generateSlug(article.title || "noticia");
  
  // Si por algún error el slug queda como "noticia", lo forzamos a "nacionales"
  // para que el fetch en slug/page.tsx no falle.
  const finalCategoryPath = categorySlug === "noticia" ? "nacionales" : categorySlug;

  const articleHref = `/${finalCategoryPath}/${slug}?id=${encodeURIComponent(article.id)}`;

  // Skeleton de carga (Gris suave, sin bordes negros)
  if (!mounted) {
    return <div className="w-full h-64 bg-gray-100 rounded-xl animate-pulse" />;
  }

  return (
    <Link href={articleHref} className="group block h-full">
      <div className="bg-white border border-[#ebf0f6] rounded-xl overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-all duration-300">
        
        {/* Contenedor de Imagen */}
        <div className="relative h-52 w-full bg-gray-50 flex items-center justify-center overflow-hidden">
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
            <div className="flex flex-col items-center justify-center text-[#2175eb]/10">
              <span className="text-2xl font-black tracking-tighter uppercase italic text-gray-300">mercatracho</span>
            </div>
          )}
          
          {/* Badge de Categoría */}
          <div className="absolute top-3 left-3">
            <span className="bg-[#2175eb] text-white text-[9px] font-black uppercase px-2 py-1 rounded shadow-sm tracking-widest">
              {displayCategory}
            </span>
          </div>
        </div>

        {/* Contenido de la Tarjeta */}
        <div className="p-5 flex flex-col flex-grow">
          
          {/* Fecha */}
          {datePublished && (
            <span className="text-[10px] text-gray-400 font-bold uppercase mb-2 tracking-tight">
              {new Date(datePublished).toLocaleDateString('es-HN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          )}

          {/* Título */}
          <h2 className="font-medium text-[20px] leading-[26px] text-[#222222] mb-4 line-clamp-3 group-hover:text-[#2175eb] transition-colors">
            {article.title}
          </h2>
          
          {/* Footer */}
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
    </Link>
  );
}