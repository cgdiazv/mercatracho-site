// app/[category]/[slug]/page.tsx
import { CATEGORY_URLS } from '@/app/lib/urls';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
  searchParams: Promise<{ id: string }>;
}

async function getArticle(categoryKey: string, articleId: string) {
  const key = categoryKey.toLowerCase();
  const url = CATEGORY_URLS[key] || CATEGORY_URLS['nacionales'];
  
  if (!url) return null;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    
    const data = await res.json();
    const decodedId = decodeURIComponent(articleId);

    return data.items.find((item: any) => String(item.id) === decodedId) || null;
  } catch (error) {
    console.error("Error en getArticle:", error);
    return null;
  }
}

function formatDate(article: any) {
  try {
    const rawDate = article.published || article.date_published || article.updated;
    if (!rawDate) return "Fecha no disponible";

    if (typeof rawDate === 'number') {
      const date = rawDate < 10000000000 ? new Date(rawDate * 1000) : new Date(rawDate);
      return date.toLocaleDateString('es-HN', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    const date = new Date(rawDate);
    if (isNaN(date.getTime())) return "Fecha no disponible";
    return date.toLocaleDateString('es-HN', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch (e) {
    return "Fecha no disponible";
  }
}

export default async function ArticlePage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const article = await getArticle(resolvedParams.category, resolvedSearchParams.id);

  if (!article) {
    return (
      <main className="min-h-screen bg-[#f5f6f7] pt-10 px-6">
        <div className="max-w-4xl mx-auto py-20 text-center bg-white rounded-2xl shadow-sm border border-[#ebf0f6]">
          <h1 className="text-2xl font-bold text-gray-800">Noticia no encontrada</h1>
          <Link href="/" className="text-[#2175eb] mt-6 inline-block font-bold underline">
            Volver a la portada
          </Link>
        </div>
      </main>
    );
  }

  const mainImage = article.visual?.url || article.attachments?.[0]?.url;
  let cleanContent = article.content_html || article.summary?.content || '';

  if (mainImage) {
    cleanContent = cleanContent.replace(/<img[^>]*>/, '');
  }

  return (
    <main className="min-h-screen bg-[#f5f6f7] pt-10 pb-16 px-4 md:px-6">
      
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-[#ebf0f6] overflow-hidden">
        
        <div className="px-6 md:px-12 pt-8">
          <nav className="mb-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <Link href="/" className="text-[#2175eb] hover:opacity-70 transition-opacity">Mercatracho</Link>
            <span className="text-gray-300">/</span>
            <span>{resolvedParams.category}</span>
          </nav>

          <header className="mb-8">
            <h1 className="text-3xl md:text-5xl font-bold text-[#222222] leading-[1.1] tracking-tight mb-6">
              {article.title}
            </h1>
            
            <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm text-gray-500 border-y border-gray-100 py-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#2175eb] rounded-full flex items-center justify-center text-white font-bold text-[9px]">
                  M
                </div>
                <span className="font-bold text-gray-900 uppercase text-[10px] tracking-tight">
                  {/* Cambio solicitado: Fuente RSS en lugar de Redacción */}
                  Fuente: {article.origin?.title || 'RSS'}
                </span>
              </div>
              <span className="hidden md:block text-gray-300">|</span>
              <span className="text-[10px] uppercase font-bold tracking-tight text-gray-400">
                {formatDate(article)}
              </span>
            </div>
          </header>
        </div>

        {mainImage && (
          <div className="w-full relative aspect-video bg-gray-100">
            <img 
              src={mainImage} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="px-6 md:px-12 py-10">
          <article 
            className="prose prose-lg max-w-none text-[#2d3748]"
            dangerouslySetInnerHTML={{ __html: cleanContent }}
          />

          <footer className="mt-16 pt-8 border-t border-gray-100 flex flex-col items-center">
            {/* Se eliminó el texto de Fuente RSS de aquí abajo */}
            <Link 
              href="/" 
              className="bg-[#2175eb] text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.15em] hover:bg-blue-700 transition-all shadow-md"
            >
              Volver a la Portada
            </Link>
          </footer>
        </div>
      </div>
    </main>
  );
}