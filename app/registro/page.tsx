// app/membresia/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || 'Ocurrió un error al registrarse');
        setLoading(false);
      } else {
        // Registro exitoso, lo mandamos al login
        router.push('/login?registered=true');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f6f7] flex items-center justify-center p-4 md:p-6">
      <div className="max-w-[450px] w-full">
        <div className="bg-white rounded-[32px] shadow-sm border border-[#ebf0f6] p-8 md:p-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-[#222222] tracking-tighter mb-2">
              Únete a Mercatracho
            </h1>
            <p className="text-gray-400 text-sm font-medium">
              Crea tu cuenta para acceder a noticias exclusivas y deportes.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-2xl text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Nombre Completo</label>
              <input name="name" type="text" placeholder="Tu nombre" required className="w-full bg-[#f9fafb] border border-[#ebf0f6] rounded-2xl px-5 py-4 text-gray-800 focus:outline-none focus:border-[#2175eb] transition-all font-medium" />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Correo Electrónico</label>
              <input name="email" type="email" placeholder="nombre@ejemplo.com" required className="w-full bg-[#f9fafb] border border-[#ebf0f6] rounded-2xl px-5 py-4 text-gray-800 focus:outline-none focus:border-[#2175eb] transition-all font-medium" />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Contraseña</label>
              <input name="password" type="password" placeholder="Mínimo 6 caracteres" minLength={6} required className="w-full bg-[#f9fafb] border border-[#ebf0f6] rounded-2xl px-5 py-4 text-gray-800 focus:outline-none focus:border-[#2175eb] transition-all font-medium" />
            </div>

            <button type="submit" disabled={loading} className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] bg-[#222222] text-white hover:bg-[#2175eb] transition-all shadow-xl shadow-gray-200 mt-4 active:scale-[0.98] disabled:bg-gray-400">
              {loading ? 'Creando cuenta...' : 'Suscribirme ahora'}
            </button>
          </form>

          <p className="text-center mt-10 text-gray-400 text-sm font-medium">
            ¿Ya tienes cuenta? <Link href="/login" className="text-[#2175eb] font-black hover:underline">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </main>
  );
}