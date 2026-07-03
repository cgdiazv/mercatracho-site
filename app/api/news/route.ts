import { NextRequest, NextResponse } from 'next/server';
import { CATEGORY_URLS } from '@/app/lib/urls';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const continuation = searchParams.get('c');

  if (!category) {
    return NextResponse.json({ error: 'Categoría no proporcionada' }, { status: 400 });
  }

  // Lógica especial para la página de inicio que mezcla múltiples categorías
  if (category === 'home') {
    if (!continuation) {
      return NextResponse.json({ items: [], continuation: "" });
    }

    try {
      const continuations: Record<string, string> = JSON.parse(continuation);
      
      const requests = Object.keys(continuations).map(key => {
        const baseUrl = CATEGORY_URLS[key];
        const cont = continuations[key];
        if (!baseUrl) return Promise.resolve({ key, data: { items: [] } });

        const urlToFetch = cont ? `${baseUrl}?c=${cont}` : baseUrl;
        
        return fetch(urlToFetch, { cache: 'no-store' })
          .then(res => res.json().then(data => ({ key, data })))
          .catch(() => ({ key, data: { items: [] } }));
      });

      const results = await Promise.all(requests);
      
      let allArticles: any[] = [];
      const newContinuations: Record<string, string> = {};

      results.forEach(({ key, data }) => {
        if (data.items) {
          allArticles = [...allArticles, ...data.items];
        }
        if (data.continuation) {
          newContinuations[key] = data.continuation;
        }
      });

      allArticles.sort((a, b) => {
        const dateA = a.published || new Date(a.date_published).getTime() / 1000;
        const dateB = b.published || new Date(b.date_published).getTime() / 1000;
        return dateB - dateA;
      });

      return NextResponse.json({
        items: allArticles,
        continuation: Object.keys(newContinuations).length > 0 ? JSON.stringify(newContinuations) : "",
      });
    } catch (error) {
      console.error('Error fetching home news page:', error);
      return NextResponse.json({ error: 'Error interno del servidor procesando home' }, { status: 500 });
    }
  }

  const baseUrl = CATEGORY_URLS[category];

  if (!baseUrl) {
    return NextResponse.json({ error: 'Categoría no válida' }, { status: 404 });
  }

  // Construct the URL with the continuation token
  const urlToFetch = continuation ? `${baseUrl}?c=${continuation}` : baseUrl;

  try {
    const res = await fetch(urlToFetch, { 
      // We can use a short cache or no-store since this is loading more dynamic data
      cache: 'no-store' 
    });

    if (!res.ok) {
      console.error(`Failed to fetch from Inoreader API. Status: ${res.status}`);
      return NextResponse.json({ error: 'Error al obtener datos del proveedor' }, { status: 502 });
    }

    const data = await res.json();
    
    // Return the items and the next continuation token
    return NextResponse.json({
      items: data.items || [],
      continuation: data.continuation || "",
    });

  } catch (error) {
    console.error('Error fetching news page:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
