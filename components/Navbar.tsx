// components/Navbar.tsx
import Image from 'next/image';
import Link from 'next/link';

// Icono simple de usuario (puedes usar Lucide-react o Heroicons si los tienes instalados)
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
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
  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-[#ebf0f6]">
      <div className="max-w-7xl mx-auto px-6 py-6">
        
        {/* FILA PRINCIPAL */}
        <div className="flex items-start justify-between gap-10">
          
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 mt-[7px]">
            <Image 
              src="/logo.png" 
              alt="mercatracho" 
              width={105} 
              height={26} 
              className="h-[1.3rem] w-auto object-contain" 
              priority 
            />
          </Link>

          {/* Bloque Central: Buscador + Enlaces */}
          <div className="flex-grow max-w-[900px]">
            <input 
              type="text" 
              placeholder="Buscar noticias..." 
              className="w-full bg-[#f5f6f7] border border-[#ebf0f6] rounded-full py-2.5 px-6 text-[15px] focus:outline-none focus:border-[#2175eb] focus:ring-1 focus:ring-[#2175eb] transition-all" 
            />
            
            <div className="mt-4 flex gap-8 pl-2">
              {categories.map(cat => (
                <Link 
                  key={cat.slug} 
                  href={`/${cat.slug}`} 
                  className="font-medium text-[12px] tracking-normal text-[#222222] uppercase hover:text-[#2175eb] transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Botón de Cuenta/Ingreso */}
          <div className="flex-shrink-0 mt-[4px]">
            <Link 
              href="/login" 
              className="flex items-center gap-2 text-[#222222] hover:text-[#2175eb] transition-colors py-2 px-3 rounded-full hover:bg-gray-50"
            >
              <UserIcon />
              <span className="text-[12px] font-medium uppercase tracking-tight hidden lg:block">Ingresar</span>
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}