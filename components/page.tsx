import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';

// Definimos una estructura esperada para el objeto del artículo
interface Article {
    id: string;
    title: string;
    author: string;
    published: number; // Timestamp de Unix
    canonical: { href: string }[]; // Array de posibles imágenes
    summary: { content: string };
    content: { content: string }; // Contenido HTML completo
}

/**
 * Obtiene los datos de un artículo específico desde nuestro endpoint de API.
 */
async function getArticle(category: string, id: string): Promise<Article | null> {
    try {
        // Usamos una URL absoluta para el fetch en el servidor
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/news/article?category=${category}&id=${id}`, {
            next: { revalidate: 3600 } // Revalidar cada hora
        });

        if (!res.ok) {
            return null;
        }
        return res.json();
    } catch (error) {
        console.error("Fallo al obtener el artículo:", error);
        return null;
    }
}

/**
 * Genera los metadatos de la página (título, descripción, etc.) para SEO.
 */
export async function generateMetadata({ params }: { params: { slug: string, category: string } }): Promise<Metadata> {
    const id = params.slug.split('-').pop();
    if (!id) {
        return { title: 'Noticia no encontrada' };
    }

    const article = await getArticle(params.category, id);

    if (!article) {
        return { title: 'Noticia no encontrada' };
    }

    const description = article.summary.content.replace(/<[^>]*>?/gm, '').substring(0, 160);

    return {
        title: `${article.title} | Mercatracho`,
        description: description,
        openGraph: {
            title: article.title,
            description: description,
            images: [
                {
                    url: article.canonical?.[0]?.href || '/placeholder.png',
                    width: 1200,
                    height: 630,
                    alt: article.title,
                },
            ],
            type: 'article',
            publishedTime: new Date(article.published * 1000).toISOString(),
            authors: [article.author],
        },
    };
}

export default async function ArticlePage({ params }: { params: { slug: string, category: string } }) {
    // El ID del artículo es la última parte del slug
    const id = params.slug.split('-').pop();

    if (!id) {
        notFound();
    }

    const article = await getArticle(params.category, id);

    if (!article) {
        notFound();
    }

    const imageUrl = article.canonical?.[0]?.href;
    const publishedDate = new Date(article.published * 1000).toLocaleDateString('es-HN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <article>
                    <header className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
                            {article.title}
                        </h1>
                        <div className="text-sm text-gray-500">
                            <span>Por {article.author}</span>
                            <span className="mx-2">&middot;</span>
                            <time dateTime={new Date(article.published * 1000).toISOString()}>
                                {publishedDate}
                            </time>
                        </div>
                    </header>

                    {imageUrl && (
                        <figure className="mb-8">
                            <Image src={imageUrl} alt={article.title} width={800} height={450} className="w-full h-auto object-cover rounded-lg shadow-md" priority />
                        </figure>
                    )}

                    <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: article.content.content }} />
                </article>
            </div>
        </div>
    );
}