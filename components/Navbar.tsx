"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Iconos
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

const categories = [
  { name: 'Nacionales', slug: 'nacionales' },
  { name: 'Deportes', slug: 'deportes' },
  { name: 'Economía', slug: 'economia' },
  { name: 'Entretenimiento', slug: 'entretenimiento' },
  { name: 'Salud', slug: 'salud' },
  { name: 'Tecnología', slug: 'tecnologia' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="bg-white sticky top-0 z-50 border-b border-[#ebf0f6] shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* --- VERSIÓN DESKTOP (PC) --- */}
          <div className="hidden md:flex items-start justify-between gap-10 py-6">
            <Link href="/" className="flex-shrink-0 mt-[10px]">
              <Image src="/logo.png" alt="mercatracho" width={105} height={26} className="h-[1.3rem] w-auto object-contain" priority />
            </Link>

            <div className="flex-grow max-w-[900px]">
              <input 
                type="text" 
                placeholder="Buscar noticias..." 
                className="w-full bg-[#f5f6f7] border border-[#ebf0f6] rounded-full py-2.5 px-6 text-[15px] focus:outline-none focus:border-[#2175eb] transition-all" 
              />
              <div className="mt-4 flex gap-8 pl-2">
                {categories.map(cat => (
                  <Link key={cat.slug} href={`/${cat.slug}`} className="font-bold text-[11px] tracking-widest text-[#222222] uppercase hover:text-[#2175eb] transition-colors">
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/login" className="flex items-center gap-2 text-[#222222] hover:text-[#2175eb] transition-colors py-2 px-3 mt-[4px]">
              <UserIcon />
              <span className="text-[11px] font-bold uppercase tracking-tight">Ingresar</span>
            </Link>
          </div>

          {/* --- VERSIÓN MÓVIL (CELULAR) --- */}
          <div className="md:hidden flex flex-col py-4">
            <div className="flex items-center justify-between mb-4 relative min-h-[40px]">
              
              <div className="flex items-center">
                <Link href="/login" className="p-2 text-[#222222]" aria-label="Ingresar">
                  <UserIcon />
                </Link>
              </div>

              <div className="absolute left-1/2 -translate-x-1/2">
                <Link href="/">
                  <Image src="/logo.png" alt="mercatracho" width={140} height={36} className="h-7 w-auto object-contain" priority />
                </Link>
              </div>

              <div className="flex items-center">
                <button onClick={() => setIsOpen(true)} className="p-2 text-[#222222]" aria-label="Abrir menú">
                  <MenuIcon />
                </button>
              </div>
            </div>

            <div className="w-full">
              <input type="text" placeholder="Buscar noticias..." className="w-full bg-[#f5f6f7] border border-[#ebf0f6] rounded-full py-2 px-5 text-[14px] focus:outline-none" />
            </div>
          </div>
        </div>
      </nav>

      {/* --- DRAWER (MENÚ LATERAL) --- */}
      <div 
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setIsOpen(false)}
      >
        <div 
          className={`fixed top-0 left-0 h-full w-[280px] bg-white shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Cabecera del Drawer (Sin título, solo botón cerrar alineado a la derecha) */}
          <div className="flex items-center justify-end p-5 border-b border-gray-100">
            <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500 hover:bg-gray-50 rounded-full">
              <CloseIcon />
            </button>
          </div>

          <div className="flex flex-col py-2">
            {categories.map((cat) => (
              <Link 
                key={cat.slug} 
                href={`/${cat.slug}`} 
                onClick={() => setIsOpen(false)}
                className="px-6 py-4 font-bold text-[12px] uppercase tracking-widest text-[#222222] border-b border-gray-50 hover:bg-gray-50 hover:text-[#2175eb] transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}