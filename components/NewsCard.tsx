"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ShareMenu from './ShareMenu';

export default function NewsCard({ article, categoryName }: { article: any, categoryName?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lógica de imagen
  const attachmentUrl = article.attachments?.[0]?.url;
  const contentHtml = article.content_html || "";
  const imageMatch = contentHtml.match(/<img[^>]+src="([^">]+)"/);
  const internalImgUrl = imageMatch ? imageMatch[1] : null;
  const finalImageUrl = attachmentUrl || internalImgUrl;
  const datePublished = article.date_published;

  // Lógica de Categoría y Slugs
  const getAutoCategory = () => {
    if (categoryName && categoryName !== "") return categoryName;
    const categories = article.categories || [];
    const folderTag = categories.find((cat: string) => cat.includes('label/'));
    if (folderTag) return folderTag.split('/').pop();
    return "Nacionales";
  };

  const displayCategory = getAutoCategory();

  const generateSlug = (title: string) => {
    return title.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
  };

  const categorySlug = displayCategory.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '');
  const slug = generateSlug(article.title || "noticia");
  const finalCategoryPath = categorySlug === "noticia" ? "nacionales" : categorySlug;

  const articleHref = `/${finalCategoryPath}/${slug}?id=${encodeURIComponent(article.id)}`;
  
  // URL absoluta para el menú de compartir
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const fullUrl = `${baseUrl}${articleHref}`;

  if (!mounted) {
    return <div className="w-full h-64 bg-gray-100 rounded-xl animate-pulse" />;
  }

  return (
    <div className="bg-white border border-[#ebf0f6] rounded-xl overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-all duration-300 relative group">
      
      {/* Enlace invisible que cubre toda la tarjeta */}
      <Link href={articleHref} className="absolute inset-0 z-10" aria-label={article.title} />

      {/* Contenedor de Imagen */}
      <div className="relative h-52 w-full bg-gray-50 flex items-center justify-center overflow-hidden">
        {finalImageUrl ? (
          <img 
            src={finalImageUrl}
            alt={article.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-300 uppercase font-black italic tracking-tighter">
            mercatracho
          </div>
        )}
        <div className="absolute top-3 left-3 z-20">
          <span className="bg-[#2175eb] text-white text-[9px] font-black uppercase px-2 py-1 rounded shadow-sm tracking-widest">
            {displayCategory}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-5 flex flex-col flex-grow relative z-20">
        {datePublished && (
          <span className="text-[10px] text-gray-400 font-bold uppercase mb-2 tracking-tight">
            {new Date(datePublished).toLocaleDateString('es-HN', {
              day: 'numeric', month: 'long', year: 'numeric'
            })}
          </span>
        )}

        {/* Título como Link explícito sin subrayado */}
        <Link href={articleHref} className="relative z-30 block">
          <h2 className="font-medium text-[20px] leading-[26px] text-[#222222] mb-4 line-clamp-3 group-hover:text-[#2175eb] transition-colors">
            {article.title}
          </h2>
        </Link>
        
        {/* Footer */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-gray-400 text-[10px] uppercase font-bold tracking-tighter">
            {article.author || "RSS Feed"}
          </span>
          
          <div className="relative z-30">
            <ShareMenu url={fullUrl} title={article.title} />
          </div>
        </div>
      </div>
    </div>
  );
}