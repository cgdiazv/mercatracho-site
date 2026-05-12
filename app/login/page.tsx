'use client';

import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Función para manejar el login con Google
  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/' });
  };

  // Función para manejar el login con credenciales (Email/Password)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Extraemos los datos del formulario de forma segura
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      // Llamada a NextAuth con el proveedor "credentials"
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false, // Evita recarga automática para manejar el error aquí
      });

      if (result?.error) {
        // Personaliza el mensaje según el error devuelto por el authorize de route.ts
        setError('Correo o contraseña incorrectos. Por favor, verifica tus datos.');
        setLoading(false);
      } else {
        // Login exitoso: Redirigir y refrescar el estado de la sesión
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      console.error("Error durante el inicio de sesión:", err);
      setError('Ocurrió un problema técnico. Intenta más tarde.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f6f7] flex items-center justify-center p-4 md:p-6">
      <div className="max-w-[450px] w-full">
        
        {/* Tarjeta de Login */}
        <div className="bg-white rounded-[32px] shadow-sm border border-[#ebf0f6] p-8 md:p-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-[#222222] tracking-tighter mb-2">
              Bienvenido de nuevo
            </h1>
            <p className="text-gray-400 text-sm font-medium">
              Ingresa para gestionar tu suscripción y leer contenido exclusivo.
            </p>
          </div>

          {/* Alerta de Error (Solo aparece si hay un error) */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-[11px] font-black uppercase tracking-wider rounded-2xl text-center">
              {error}
            </div>
          )}

          {/* Opciones de Login Social */}
          <div className="space-y-3 mb-8">
            <button 
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-4 border-2 border-[#ebf0f6] rounded-2xl font-bold text-sm text-[#222222] hover:bg-gray-50 transition-all active:scale-[0.98]"
            >
              <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
              Continuar con Google
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#ebf0f6]"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.2em] text-gray-300">
              <span className="bg-white px-4">O usa tu correo</span>
            </div>
          </div>

          {/* Formulario de Correo/Contraseña */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                Correo Electrónico
              </label>
              <input 
                name="email"
                type="email" 
                placeholder="nombre@ejemplo.com"
                required
                className="w-full bg-[#f9fafb] border border-[#ebf0f6] rounded-2xl px-5 py-4 text-gray-800 focus:outline-none focus:border-[#2175eb] focus:ring-4 focus:ring-blue-50 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1 flex justify-between">
                Contraseña
                <Link href="/recuperar-clave" className="text-[#2175eb] lowercase tracking-normal font-bold hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </label>
              <input 
                name="password"
                type="password" 
                placeholder="••••••••"
                required
                className="w-full bg-[#f9fafb] border border-[#ebf0f6] rounded-2xl px-5 py-4 text-gray-800 focus:outline-none focus:border-[#2175eb] focus:ring-4 focus:ring-blue-50 transition-all font-medium"
              />
            </div>

            {/* Este botón ahora disparará el handleSubmit por ser type="submit" */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] bg-[#222222] text-white hover:bg-[#2175eb] transition-all shadow-xl shadow-gray-200 mt-4 active:scale-[0.98] disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Verificando...' : 'Entrar a mi cuenta'}
            </button>
          </form>

          {/* Call to Action para Membresía */}
          <p className="text-center mt-10 text-gray-400 text-sm font-medium">
            ¿No tienes cuenta?{' '}
            <Link href="/registro" className="text-[#2175eb] font-black hover:underline">
              Suscríbete aquí
            </Link>
          </p>
        </div>

        {/* Botón de Regreso */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-[#2175eb] transition-colors gap-2 inline-flex items-center group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Regresar a noticias
          </Link>
        </div>
      </div>
    </main>
  );
}