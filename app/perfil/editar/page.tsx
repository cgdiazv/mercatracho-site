'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import Link from 'next/link';

export default function EditarPerfilPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");

  useEffect(() => {
    if (session?.user) {
      setNombre(session.user.name || "");
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

  // Función para eliminar la cuenta
  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      const res = await fetch('/api/user/delete', { method: 'DELETE' });

      if (res.ok) {
        // Cerramos sesión y mandamos al inicio tras borrar
        await signOut({ callbackUrl: '/' });
      } else {
        alert("No se pudo eliminar la cuenta. Inténtalo de nuevo.");
      }
    } catch (error) {
      alert("Error al conectar con el servidor");
    } finally {
      setDeleteLoading(false);
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

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                Correo Electrónico
              </label>
              <input 
                type="email" 
                value={session?.user?.email || ""}
                disabled
                className="w-full bg-gray-50 border border-[#ebf0f6] rounded-2xl px-5 py-4 text-gray-400 font-medium cursor-not-allowed"
              />
              <p className="text-[9px] text-gray-400 mt-2 ml-1 italic">
                * Vinculado a tu cuenta de Google
              </p>
            </div>

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
              disabled={loading || isConfirmingDelete}
              className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] bg-[#222222] text-white hover:bg-[#2175eb] hover:cursor-pointer transition-all shadow-xl shadow-gray-200 active:scale-[0.98] disabled:bg-gray-400"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </form>

          {/* SECCIÓN: ELIMINAR CUENTA */}
          <div className="mt-12 pt-8 border-t border-gray-100">
                        
            {!isConfirmingDelete ? (
              <button 
                type="button"
                onClick={() => setIsConfirmingDelete(true)}
                className="text-[11px] font-bold uppercase tracking-widest text-red-400 hover:text-red-600 hover:cursor-pointer transition-colors"
              >
                Eliminar mi cuenta
              </button>
            ) : (
              <div className="bg-red-50 p-6 rounded-3xl border border-red-100 animate-in fade-in zoom-in duration-300">
                <p className="text-xs text-red-800 font-bold mb-4 uppercase tracking-tight">
                  ¿Estás completamente seguro? Esta acción borrará tus datos y no se puede deshacer.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                    className="bg-red-500 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all disabled:opacity-50"
                  >
                    {deleteLoading ? 'Eliminando...' : 'Sí, eliminar cuenta'}
                  </button>
                  <button 
                    onClick={() => setIsConfirmingDelete(false)}
                    className="bg-white text-gray-500 border border-gray-200 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}