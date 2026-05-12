"use client";

import { useState } from 'react';

export default function ShareMenu({ url, title }: { url: string, title: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      alert("Enlace copiado al portapapeles");
      setIsOpen(false);
    }
  };

  // Formato: Título seguido de la URL (esto ayuda a activar la previsualización de WhatsApp)
  const shareText = `${title}\n\n${url}`;

  const links = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  };

  return (
    <div className="relative">
      <button 
        onClick={(e) => {
          e.preventDefault(); 
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-1.5 text-[#2175eb] text-[10px] uppercase tracking-widest font-black hover:opacity-70 transition-all cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
        </svg>
        Compartir
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30 cursor-default" onClick={() => setIsOpen(false)} />
          <div className="absolute bottom-full right-0 mb-2 w-32 bg-white border border-[#ebf0f6] rounded-lg shadow-xl z-40 overflow-hidden py-1">
            <a 
              href={links.whatsapp} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 text-[9px] font-black uppercase text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              WhatsApp
            </a>
            <a 
              href={links.facebook} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 text-[9px] font-black uppercase text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Facebook
            </a>
            <button 
              onClick={handleCopy}
              className="w-full text-left px-3 py-2 text-[9px] font-black uppercase text-[#2175eb] hover:bg-gray-50 border-t border-gray-50 transition-colors cursor-pointer"
            >
              Copiar Link
            </button>
          </div>
        </>
      )}
    </div>
  );
}