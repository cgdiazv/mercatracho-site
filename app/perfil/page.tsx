// app/perfil/page.tsx
'use client';

import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from 'next/link';

export default function PerfilPage() {
  const { data: session, status } = useSession();

  // 1. Redirección si no hay sesión
  if (status === "unauthenticated") {
    redirect("/login");
  }

  // 2. Estado de carga estético
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f6f7]">
        <div className="animate-pulse font-black text-[#2175eb] tracking-widest uppercase text-[10px]">
          Cargando perfil...
        </div>
      </div>
    );
  }

  const userInitial = session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U';
  const userImage = session?.user?.image;

  return (
    <main className="min-h-screen bg-[#f5f6f7] pt-12 pb-16 px-4 md:px-6">
      <div className="max-w-2xl mx-auto">
        
        <h1 className="text-3xl md:text-5xl font-black text-[#222222] mb-10 tracking-tighter">
          Mi <span className="text-[#2175eb]">Cuenta</span>
        </h1>

        <div className="grid gap-6">
          
          {/* Tarjeta de Usuario */}
          <div className="bg-white rounded-[32px] p-8 border border-[#ebf0f6] shadow-sm flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-[#2175eb] rounded-full flex items-center justify-center text-white text-4xl font-black shadow-lg overflow-hidden border-2 border-white">
              {userImage ? (
                <img 
                  src={userImage} 
                  alt={session?.user?.name || ""} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                userInitial
              )}
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-black text-[#222222] leading-tight">
                {session?.user?.name}
              </h2>
              <p className="text-gray-400 font-medium mb-4">{session?.user?.email}</p>
              <span className="inline-block bg-blue-50 text-[#2175eb] text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-blue-100">
                Lector Registrado
              </span>
            </div>
          </div>

          {/* Tarjeta de Suscripción */}
          <div className="bg-white rounded-[32px] p-8 border border-[#ebf0f6] shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Estado de Membresía</h3>
              <span className="text-xs font-bold text-gray-400 italic">Plan Gratuito</span>
            </div>
            
            <p className="text-gray-600 font-medium mb-8 leading-relaxed">
              Actualmente estás usando la versión básica. Suscríbete a Premium para eliminar anuncios y apoyar el periodismo independiente.
            </p>

            <Link 
              href="/membresia"
              className="inline-block w-full text-center py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] bg-[#2175eb] text-white hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-blue-100"
            >
              Mejorar a Premium
            </Link>
          </div>

          {/* Acciones de Cuenta */}
          <div className="bg-white rounded-[32px] p-8 border border-[#ebf0f6] shadow-sm">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Configuración</h3>
             <div className="space-y-4">
                <Link 
                    href="/perfil/editar" className="w-full text-left py-2 text-sm font-bold text-gray-700 hover:text-[#2175eb] transition-colors block"
                >
                    Editar información personal
                </Link>
                <button className="w-full text-left py-2 text-sm font-bold text-gray-700 hover:text-[#2175eb] transition-colors">
                  Historial de pagos
                </button>
                <div className="pt-4 mt-4 border-t border-gray-50">
                  <button 
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full text-left py-2 text-sm font-bold text-red-500 hover:text-red-700 transition-colors flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                    </svg>
                    Cerrar sesión de forma segura
                  </button>
                </div>
             </div>
          </div>

        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-[#2175eb] font-black text-[11px] uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">
            ← Volver a la portada
          </Link>
        </div>
      </div>
    </main>
  );
}