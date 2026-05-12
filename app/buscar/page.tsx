'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SearchResults() {
  const searchParams = useSearchParams();
  const queryTerm = searchParams.get('q') || '';
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/buscar?q=${encodeURIComponent(queryTerm)}`);
        const data = await res.json();
        setResults(data.items || []);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (queryTerm) fetchResults();
  }, [queryTerm]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-[#2175eb] rounded-full"></div>
        <p className="mt-4 text-gray-400 font-bold uppercase text-[10px] tracking-widest">Buscando noticias...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12 border-b border-gray-50 pb-8">
        <h1 className="text-3xl font-medium text-[#222222] tracking-tight">
          Resultados para: <span className="text-[#2175eb] font-bold">"{queryTerm}"</span>
        </h1>
        <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em] mt-2 font-bold">
          Buscador de noticias Mercatracho
        </p>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {results.map((article) => (
            <Link 
              href={`/${article.categoryKey}/${article.slug}?id=${encodeURIComponent(article.realId)}`} 
              key={article.id} 
              className="group"
            >
              <article className="flex flex-col h-full border-b border-gray-50 pb-8 cursor-pointer">
                {article.attachments?.[0]?.url && (
                  <div className="aspect-video overflow-hidden rounded-[24px] mb-5 bg-gray-100">
                    <img 
                      src={article.attachments[0].url} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  </div>
                )}
                <div className="flex flex-col flex-grow">
                  <h2 className="text-xl font-medium text-[#222222] leading-tight mb-4 group-hover:text-[#2175eb] transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-gray-500 text-sm font-medium line-clamp-3 leading-relaxed mb-6">
                    {article.content_html?.replace(/<[^>]*>?/gm, '').substring(0, 140)}...
                  </p>
                  <div className="mt-auto">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#2175eb]">Leer noticia completa →</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-[#f5f6f7] rounded-[40px] border border-dashed border-gray-200">
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">No encontramos noticias para "{queryTerm}"</p>
        </div>
      )}
    </div>
  );
}

export default function BuscarPage() {
  return (
    <main className="min-h-screen bg-white">
      <Suspense fallback={null}>
        <SearchResults />
      </Suspense>
    </main>
  );
}