// app/perfil/editar/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import Link from 'next/link';

export default function EditarPerfilPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Estados del formulario
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");

  // Sincronizar con la sesión al cargar para que no aparezca vacío
  useEffect(() => {
    if (session?.user) {
      setNombre(session.user.name || "");
      // El teléfono lo traeremos de la DB más adelante, 
      // por ahora se mantiene como estado local.
    }
  }, [session]);

  if (status === "unauthenticated") redirect("/login");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, telefono }),
      });

      if (res.ok) {
        router.push('/perfil');
        router.refresh(); 
      } else {
        alert("Error al guardar los datos");
      }
    } catch (error) {
      alert("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f6f7] pt-12 pb-16 px-4 md:px-6">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <Link href="/perfil" className="text-[#2175eb] font-black text-[10px] uppercase tracking-widest flex items-center gap-2 mb-4 group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Volver al perfil
          </Link>
          <h1 className="text-3xl font-black text-[#222222] tracking-tighter">
            Editar <span className="text-[#2175eb]">Información</span>
          </h1>
        </div>

        <div className="bg-white rounded-[32px] p-8 md:p-12 border border-[#ebf0f6] shadow-sm">
          <form onSubmit={handleUpdate} className="space-y-6">
            
            {/* Campo Nombre */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                Nombre Público
              </label>
              <input 
                type="text" 
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-[#f9fafb] border border-[#ebf0f6] rounded-2xl px-5 py-4 text-gray-800 focus:outline-none focus:border-[#2175eb] transition-all font-medium"
              />
            </div>

            {/* Campo Email - MOSTRADO PERO PROTEGIDO */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                Correo Electrónico
              </label>
              <input 
                type="email" 
                value={session?.user?.email || ""}
                disabled
                className="w-full bg-gray-50 border border-[#ebf0f6] rounded-2xl px-5 py-4 text-gray-400 font-medium cursor-not-allowed"
                title="El correo no se puede cambiar porque está vinculado a Google"
              />
              <p className="text-[9px] text-gray-400 mt-2 ml-1 italic">
                * Vinculado a tu cuenta de Google
              </p>
            </div>

            {/* Campo Teléfono */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                WhatsApp / Teléfono
              </label>
              <input 
                type="tel" 
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="+504 ...."
                className="w-full bg-[#f9fafb] border border-[#ebf0f6] rounded-2xl px-5 py-4 text-gray-800 focus:outline-none focus:border-[#2175eb] transition-all font-medium"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] bg-[#222222] text-white hover:bg-[#2175eb] transition-all shadow-xl shadow-gray-200 active:scale-[0.98] disabled:bg-gray-400"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}