import { CATEGORY_URLS } from "@/app/lib/urls";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const queryTerm = searchParams.get("q")?.toLowerCase() || "";

  if (!queryTerm) return NextResponse.json({ items: [] });

  try {
    const categories = ['nacionales', 'deportes', 'economia', 'entretenimiento', 'salud', 'tecnologia'];
    
    const requests = categories.map(key => 
      fetch(CATEGORY_URLS[key as keyof typeof CATEGORY_URLS], { next: { revalidate: 60 } })
        .then(res => res.json())
        .then(data => ({
          items: (data.items || []).map((item: any) => ({
            ...item,
            categoryKey: key, 
            // Slug estético para la URL
            slug: item.title.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, ''),
            // Guardamos el ID real para que tu página individual lo encuentre
            realId: item.id 
          }))
        }))
        .catch(() => ({ items: [] }))
    );

    const responses = await Promise.all(requests);
    let allArticles: any[] = [];

    responses.forEach(data => {
      if (data.items) allArticles = [...allArticles, ...data.items];
    });

    const filtered = allArticles.filter((article: any) => {
      const titulo = (article.title || "").toLowerCase();
      const contenido = (article.content_html || "").toLowerCase().replace(/<[^>]*>?/gm, '');
      return titulo.includes(queryTerm) || contenido.includes(queryTerm);
    });

    const uniqueResults = Array.from(new Map(filtered.map(item => [item.id, item])).values());

    return NextResponse.json({ items: uniqueResults });
  } catch (error) {
    return NextResponse.json({ error: "Error al buscar" }, { status: 500 });
  }
}