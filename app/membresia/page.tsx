// app/membresia/page.tsx
import Link from 'next/link';

export default function MembresiaPage() {
  // CONFIGURACIÓN: Link de Stripe actualizado
  const STRIPE_CHECKOUT_URL = "https://buy.stripe.com/9B69AS8uj5A0dXg2Yl4Ni00";

  const beneficios = [
    { detalle: "Acceso ilimitado a noticias premium", basico: true, premium: true },
    { detalle: "Navegación sin anuncios publicitarios", basico: false, premium: true },
    { detalle: "Boletín informativo diario por email", basico: true, premium: true },
    { detalle: "Alertas de noticias de última hora", basico: true, premium: true },
    { detalle: "Contenido exclusivo y reportajes a fondo", basico: false, premium: true },
    { detalle: "Soporte prioritario 24/7", basico: false, premium: true },
  ];

  return (
    <main className="min-h-screen bg-[#f5f6f7] pt-12 md:pt-16 pb-16 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Encabezado */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-7xl font-black text-[#222222] mb-6 tracking-tighter leading-none">
            Membresía <span className="text-[#2175eb]">Mercatracho</span>
          </h1>
          <p className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Tu apoyo nos permite seguir contando las historias que importan en Honduras. 
          </p>
        </div>

        {/* Tarjetas de Planes */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          
          {/* Plan Básico */}
          <div className="bg-white rounded-[32px] p-8 border border-[#ebf0f6] shadow-sm flex flex-col">
            <h2 className="text-2xl font-black text-[#222222] mb-2 uppercase tracking-tight">Acceso Gratuito</h2>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-black text-[#222222]">$0</span>
              <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">/ mes</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-grow font-medium">
              Ideal para mantenerte informado con lo esencial del día a día sin costo alguno.
            </p>
            <div className="w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] bg-[#f5f6f7] text-gray-400 text-center select-none border border-gray-100">
              Suscripción Activa
            </div>
          </div>

          {/* Plan Premium */}
          <div className="bg-white rounded-[32px] p-8 border-2 border-[#2175eb] shadow-xl flex flex-col relative overflow-hidden">
            {/* Badge */}
            <div className="absolute top-0 right-0 bg-[#2175eb] text-white text-[9px] font-black px-5 py-1.5 rounded-bl-2xl uppercase tracking-[0.15em]">
              Más Popular
            </div>
            
            <h2 className="text-2xl font-black text-[#222222] mb-2 uppercase tracking-tight">Premium Digital</h2>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-black text-[#2175eb]">$5.99</span>
              <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">/ mes</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-8 flex-grow font-medium">
              Acceso total, sin publicidad y contenido exclusivo diseñado para nuestra comunidad más fiel.
            </p>
            
            <a 
              href={STRIPE_CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] bg-[#2175eb] text-white hover:bg-blue-600 transition-all text-center block active:scale-95"
            >
              Suscribirme Ahora
            </a>
          </div>
        </div>

        {/* Tabla Comparativa */}
        <div className="bg-white rounded-[32px] border border-[#ebf0f6] shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 bg-gray-50/30">
            <h3 className="text-xl font-black text-[#222222] uppercase tracking-tight">Detalles de los planes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">Beneficios exclusivos</th>
                  <th className="p-6 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Básico</th>
                  <th className="p-6 text-[10px] font-black uppercase text-[#2175eb] tracking-widest text-center">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {beneficios.map((b, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-6 text-gray-700 font-bold text-sm">{b.detalle}</td>
                    <td className="p-6 text-center">
                      {b.basico ? (
                        <div className="w-6 h-6 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto text-xs font-bold">✓</div>
                      ) : (
                        <span className="text-gray-200 text-lg">-</span>
                      )}
                    </td>
                    <td className="p-6 text-center">
                      {b.premium ? (
                        <div className="w-6 h-6 bg-blue-50 text-[#2175eb] rounded-full flex items-center justify-center mx-auto text-xs font-bold">✓</div>
                      ) : (
                        <span className="text-gray-200 text-lg">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Botón de Regreso */}
        <div className="mt-16 text-center">
          <Link href="/" className="group inline-flex items-center gap-2 text-[#2175eb] font-black text-[10px] uppercase tracking-[0.2em]">
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Volver a la portada
          </Link>
        </div>
      </div>
    </main>
  );
}