// app/[category]/[slug]/page.tsx
import { CATEGORY_URLS } from '@/app/lib/urls';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
  searchParams: Promise<{ id: string }>;
}

async function getArticle(categoryKey: string, articleId: string) {
  const key = categoryKey.toLowerCase();
  const decodedId = decodeURIComponent(articleId).trim();
  const categoriesToTry = [key, ...Object.keys(CATEGORY_URLS).filter(k => k !== key)];

  for (const cat of categoriesToTry) {
    const url = CATEGORY_URLS[cat];
    if (!url) continue;
    try {
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (!res.ok) continue;
      const data = await res.json();
      const found = data.items.find((item: any) => {
        const itemId = String(item.id).trim();
        return itemId === decodedId || decodedId.endsWith(itemId) || itemId.endsWith(decodedId);
      });
      if (found) return found;
    } catch (error) {
      console.error(`Error en categoría ${cat}:`, error);
    }
  }
  return null;
}

function formatDate(article: any) {
  const rawDate = article.published || article.updated || article.date_published;
  if (!rawDate) return '';
  const date = typeof rawDate === 'number' && rawDate < 10000000000 
    ? new Date(rawDate * 1000) 
    : new Date(rawDate);
  return new Intl.DateTimeFormat('es-HN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export default async function ArticlePage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  if (!resolvedSearchParams.id) return null;

  const article = await getArticle(resolvedParams.category, resolvedSearchParams.id);

  if (!article) {
    return (
      <main className="min-h-screen bg-[#f5f6f7] pt-24 px-6 text-center">
        <h1 className="text-xl font-bold">Noticia no encontrada</h1>
        <Link href="/" className="text-[#2175eb] underline mt-4 inline-block font-bold">Volver al inicio</Link>
      </main>
    );
  }

  const mainImage = article.visual?.url || article.attachments?.[0]?.url || null;
  let bodyContent = article.content_html || article.content?.content || article.summary?.content || '';

  if (mainImage && bodyContent) {
    bodyContent = bodyContent.replace(/<img[^>]*>/, '');
  }

  return (
    /**
     * AJUSTE DE ALTURA DESKTOP:
     * pt-12 para móvil (compacto).
     * md:pt-16 para escritorio (sube el contenido comparado con el pt-32 anterior).
     */
    <main className="min-h-screen bg-[#f5f6f7] pt-5 md:pt-10 pb-16 px-4 md:px-6">
      
      <article className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-[#ebf0f6] overflow-hidden">
        
        {/* Encabezado */}
        <header className="p-6 md:p-12 pb-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-[#2175eb] text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-md shadow-sm">
              {resolvedParams.category}
            </span>
            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
              {formatDate(article)}
            </span>
          </div>

          <h1 className="text-[28px] md:text-5xl font-black text-[#222222] leading-[1.1] tracking-tight mb-8">
            {article.title}
          </h1>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2175eb] rounded-full flex items-center justify-center text-white font-bold text-xs shadow-inner">
              M
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-gray-900 leading-none mb-1">
                {article.author || 'Redacción Mercatracho'}
              </p>
              <p className="text-[10px] text-gray-400 font-bold uppercase leading-none">
                {article.origin?.title || 'Fuente RSS'}
              </p>
            </div>
          </div>
        </header>

        {/* Imagen Destacada */}
        {mainImage && (
          <div className="w-full bg-gray-100">
            <img 
              src={mainImage} 
              alt={article.title}
              className="w-full h-auto object-cover max-h-[600px] w-full"
            />
          </div>
        )}

        {/* Cuerpo de la Noticia */}
        <div className="p-6 md:p-12 pt-10">
          <div 
            className="prose prose-lg max-w-none text-[#333333] leading-relaxed
              prose-p:mb-6 prose-p:text-[18px] md:prose-p:text-lg
              prose-img:rounded-2xl prose-img:shadow-lg
              prose-a:text-[#2175eb] prose-a:font-bold prose-strong:text-[#222222]"
            dangerouslySetInnerHTML={{ __html: bodyContent }}
          />

          <footer className="mt-12 pt-10 border-t border-gray-100 flex flex-col items-center">
            <Link href="/" className="text-[#2175eb] font-black text-[11px] uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">
              ← Volver a la portada
            </Link>
          </footer>
        </div>
      </article>
    </main>
  );
}