'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setMessage({ 
          text: 'Si el correo existe, recibirás un enlace en unos minutos.', 
          type: 'success' 
        });
      } else {
        setMessage({ 
          text: 'Hubo un error. Por favor intenta de nuevo.', 
          type: 'error' 
        });
      }
    } catch (error) {
      setMessage({ text: 'Error de conexión con el servidor.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    // Reducimos el padding-top a pt-8 en móvil y pt-12 en desktop para subirla más
    <main className="min-h-screen bg-[#f5f6f7] flex items-start justify-center p-4 pt-8 md:pt-12">
      <div className="max-w-[450px] w-full">
        
        {/* Tarjeta Principal */}
        <div className="bg-white rounded-[32px] shadow-sm border border-[#ebf0f6] p-8 md:p-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-[#222222] tracking-tighter mb-2">
              Recuperar Clave
            </h1>
            <p className="text-gray-400 text-sm font-medium">
              Te enviaremos un enlace seguro para restablecer tu contraseña.
            </p>
          </div>

          {message.text && (
            <div className={`mb-6 p-4 rounded-2xl text-[11px] font-black uppercase tracking-wider text-center ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-600 border border-green-100' 
                : 'bg-red-50 text-red-600 border border-red-100'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">
                Correo Electrónico
              </label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="nombre@ejemplo.com"
                required 
                className="w-full bg-[#f9fafb] border border-[#ebf0f6] rounded-2xl px-5 py-4 text-gray-800 focus:outline-none focus:border-[#2175eb] focus:ring-4 focus:ring-blue-50 transition-all font-medium"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] bg-[#222222] text-white hover:bg-[#2175eb] transition-all shadow-xl shadow-gray-200 active:scale-[0.98] disabled:bg-gray-400"
            >
              {loading ? 'Enviando...' : 'Enviar enlace de acceso'}
            </button>
          </form>

          <div className="mt-10 text-center">
            <Link 
              href="/login" 
              className="text-[#2175eb] font-black text-[11px] uppercase tracking-widest hover:underline"
            >
              Regresar al inicio de sesión
            </Link>
          </div>
        </div>

        {/* Botón de Regreso a Home */}
        <div className="mt-8 text-center pb-10">
          <Link href="/" className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-[#2175eb] transition-colors gap-2 inline-flex items-center group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Regresar a noticias
          </Link>
        </div>
      </div>
    </main>
  );
}