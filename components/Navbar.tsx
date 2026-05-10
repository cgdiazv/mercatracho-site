// components/Navbar.tsx
import Image from 'next/image';
import Link from 'next/link';

const categories = [
  { name: 'Nacionales', slug: 'nacionales' },
  { name: 'Deportes', slug: 'deportes' },
  { name: 'Economía', slug: 'economia' },
  { name: 'Cultura', slug: 'cultura' }
];

export default function Navbar() {
  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-[#ebf0f6]">
      <div className="max-w-7xl mx-auto px-6 py-6">
        
        {/* FILA PRINCIPAL */}
        <div className="flex items-start justify-between gap-10">
          
          {/* Logo - Incrementado un 5% */}
          <Link href="/" className="flex-shrink-0 mt-[7px]">
            <Image 
              src="/logo.png" 
              alt="mercatracho" 
              width={105} // De 100 a 105
              height={26} 
              className="h-[1.3rem] w-auto object-contain" // Ajuste fino de altura
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
            
            {/* ENLACES: Alineados a la izquierda del buscador */}
            <div className="mt-4 flex gap-8 pl-2">
              {categories.map(cat => (
                <Link 
                  key={cat.slug} 
                  href={`/${cat.slug}`} 
                  className="font-bold text-[12px] tracking-normal text-[#222222] uppercase hover:text-[#2175eb] transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Espacio para equilibrio */}
          <div className="hidden md:block w-[105px]"></div>
        </div>
      </div>
    </nav>
  );
}