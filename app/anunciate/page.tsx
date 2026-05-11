// app/anunciate/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AnunciatePage() {
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setEnviado(true);
      }
    } catch (error) {
      alert("Hubo un error al enviar. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f6f7] pt-12 md:pt-16 pb-16 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Encabezado */}
        <div className="text-center mb-12">
          <span className="text-[#2175eb] font-black text-[10px] uppercase tracking-[0.3em] mb-4 block">
            Publicidad & Alianzas
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-[#222222] mb-6 tracking-tighter leading-none">
            Impulsa tu <span className="text-[#2175eb]">Negocio</span>
          </h1>
          <p className="text-gray-500 text-lg font-medium max-w-xl mx-auto leading-relaxed">
            Llega a miles de lectores comprometidos en Honduras. Completa el formulario y nuestro equipo se pondrá en contacto contigo.
          </p>
        </div>

        <div className="bg-white rounded-[32px] shadow-sm border border-[#ebf0f6] overflow-hidden">
          {!enviado ? (
            <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                    Nombre Completo
                  </label>
                  <input 
                    name="nombre"
                    required
                    type="text" 
                    placeholder="Ej. Juan López"
                    className="w-full bg-[#f9fafb] border border-[#ebf0f6] rounded-2xl px-5 py-4 text-gray-800 focus:outline-none focus:border-[#2175eb] focus:ring-4 focus:ring-blue-50 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                    Nombre de la Empresa
                  </label>
                  <input 
                    name="empresa"
                    required
                    type="text" 
                    placeholder="Ej. Servicios López S.A."
                    className="w-full bg-[#f9fafb] border border-[#ebf0f6] rounded-2xl px-5 py-4 text-gray-800 focus:outline-none focus:border-[#2175eb] focus:ring-4 focus:ring-blue-50 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                    Correo Electrónico
                  </label>
                  <input 
                    name="email"
                    required
                    type="email" 
                    placeholder="juan@ejemplo.com"
                    className="w-full bg-[#f9fafb] border border-[#ebf0f6] rounded-2xl px-5 py-4 text-gray-800 focus:outline-none focus:border-[#2175eb] focus:ring-4 focus:ring-blue-50 transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                    Teléfono / WhatsApp
                  </label>
                  <input 
                    name="telefono"
                    required
                    type="tel" 
                    placeholder="+504 ...."
                    className="w-full bg-[#f9fafb] border border-[#ebf0f6] rounded-2xl px-5 py-4 text-gray-800 focus:outline-none focus:border-[#2175eb] focus:ring-4 focus:ring-blue-50 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                  ¿En qué estás interesado?
                </label>
                <select name="interes" className="w-full bg-[#f9fafb] border border-[#ebf0f6] rounded-2xl px-5 py-4 text-gray-800 focus:outline-none focus:border-[#2175eb] focus:ring-4 focus:ring-blue-50 transition-all font-medium appearance-none">
                  <option>Banners en el sitio web</option>
                  <option>Contenido patrocinado (Publirreportaje)</option>
                  <option>Menciones en Redes Sociales</option>
                  <option>Publicidad en el Newsletter</option>
                  <option>Otro / Alianza especial</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                  Cuéntanos un poco más
                </label>
                <textarea 
                  name="mensaje"
                  rows={4}
                  placeholder="Háblanos de tu negocio y tus objetivos..."
                  className="w-full bg-[#f9fafb] border border-[#ebf0f6] rounded-2xl px-5 py-4 text-gray-800 focus:outline-none focus:border-[#2175eb] focus:ring-4 focus:ring-blue-50 transition-all font-medium resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] bg-[#222222] text-white hover:bg-[#2175eb] transition-all shadow-xl shadow-gray-200 active:scale-[0.98] disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando...' : 'Enviar Solicitud'}
              </button>
            </form>
          ) : (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                ✓
              </div>
              <h2 className="text-2xl font-black text-[#222222] mb-4">¡Solicitud Recibida!</h2>
              <p className="text-gray-500 font-medium mb-8">
                La información ha sido enviada a <strong>info@mercatracho.com</strong>. Nuestro equipo te contactará en menos de 24 horas.
              </p>
              <button 
                onClick={() => setEnviado(false)}
                className="text-[#2175eb] font-black text-[10px] uppercase tracking-widest hover:underline"
              >
                Enviar otra solicitud
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Link href="/" className="text-[#2175eb] font-black text-[11px] uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">
            ← Volver a la portada
          </Link>
        </div>
      </div>
    </main>
  );
}