"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Componente para el menú de compartir
function ShareMenu({ url, title }: { url: string, title: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const links = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    copy: () => {
      navigator.clipboard.writeText(url);
      alert("Enlace copiado");
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={(e) => {
          e.preventDefault(); // Evita navegar a la noticia
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-1.5 text-[#2175eb] text-[10px] uppercase tracking-widest font-black hover:opacity-70 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
        </svg>
        Compartir
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute bottom-full right-0 mb-2 w-32 bg-white border border-[#ebf0f6] rounded-lg shadow-xl z-40 overflow-hidden py-1">
            <a href={links.whatsapp} target="_blank" className="block px-3 py-2 text-[9px] font-black uppercase text-gray-700 hover:bg-gray-50">WhatsApp</a>
            <a href={links.facebook} target="_blank" className="block px-3 py-2 text-[9px] font-black uppercase text-gray-700 hover:bg-gray-50">Facebook</a>
            <button onClick={links.copy} className="w-full text-left px-3 py-2 text-[9px] font-black uppercase text-[#2175eb] hover:bg-gray-50 border-t border-gray-50">Copiar Link</button>
          </div>
        </>
      )}
    </div>
  );
}

export default function NewsCard({ article, categoryName }: { article: any, categoryName?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const attachmentUrl = article.attachments?.[0]?.url;
  const contentHtml = article.content_html || "";
  const imageMatch = contentHtml.match(/<img[^>]+src="([^">]+)"/);
  const internalImgUrl = imageMatch ? imageMatch[1] : null;
  const finalImageUrl = attachmentUrl || internalImgUrl;
  const datePublished = article.date_published;

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

  // URL para compartir (ajusta el dominio si ya tienes uno oficial)
  const fullUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/${finalCategoryPath}/${slug}?id=${encodeURIComponent(article.id)}`
    : "";

  const articleHref = `/${finalCategoryPath}/${slug}?id=${encodeURIComponent(article.id)}`;

  if (!mounted) {
    return <div className="w-full h-64 bg-gray-100 rounded-xl animate-pulse" />;
  }

  return (
    <div className="bg-white border border-[#ebf0f6] rounded-xl overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-all duration-300 relative group">
      
      {/* Enlace que envuelve toda la tarjeta excepto el footer interactivo */}
      <Link href={articleHref} className="absolute inset-0 z-10" />

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

        <h2 className="font-medium text-[20px] leading-[26px] text-[#222222] mb-4 line-clamp-3 group-hover:text-[#2175eb] transition-colors">
          {article.title}
        </h2>
        
        {/* Footer con el botón de Compartir */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between pointer-events-none">
          <span className="text-gray-400 text-[10px] uppercase font-bold tracking-tighter">
            {article.author || "RSS Feed"}
          </span>
          
          {/* Habilitamos clics solo en el menú de compartir */}
          <div className="pointer-events-auto">
            <ShareMenu url={fullUrl} title={article.title} />
          </div>
        </div>
      </div>
    </div>
  );
}