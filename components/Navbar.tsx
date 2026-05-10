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
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-8 relative min-h-[120px]">
        <Link href="/">
          <Image src="/logo.png" alt="mercatracho" width={80} height={20} className="h-5 w-auto object-contain" priority />
        </Link>
        <div className="hidden md:flex flex-col items-center gap-3 absolute left-1/2 -translate-x-1/2">
          <div className="w-[800px]">
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="w-full bg-[#f5f6f7] border border-[#ebf0f6] rounded-full py-2.5 px-5 text-base focus:outline-none focus:border-[#2175eb] focus:ring-1 focus:ring-[#2175eb]" 
            />
          </div>
          <div className="flex gap-6">
            {categories.map(cat => (
              <a key={cat.slug} href={`/${cat.slug}`} className="font-medium text-[12px] leading-[18px] text-[#222222] uppercase hover:text-[#2175eb]">
                {cat.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}