'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage({ text: 'Las contraseñas no coinciden.', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email, password }),
      });

      if (res.ok) {
        setMessage({ text: '¡Contraseña actualizada! Redirigiendo al login...', type: 'success' });
        setTimeout(() => router.push('/login'), 3000);
      } else {
        const data = await res.json();
        setMessage({ text: data.error || 'El enlace ha expirado o es inválido.', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error de conexión.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[450px] w-full bg-white rounded-[32px] shadow-sm border border-[#ebf0f6] p-8 md:p-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black text-[#222222] tracking-tighter mb-2">Nueva Contraseña</h1>
        <p className="text-gray-400 text-sm font-medium">Ingresa tu nueva clave para recuperar el acceso.</p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-2xl text-[11px] font-black uppercase tracking-wider text-center ${
          message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Nueva Contraseña</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="••••••••"
            required 
            minLength={6}
            className="w-full bg-[#f9fafb] border border-[#ebf0f6] rounded-2xl px-5 py-4 text-gray-800 focus:outline-none focus:border-[#2175eb] transition-all font-medium"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Confirmar Contraseña</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            placeholder="••••••••"
            required 
            className="w-full bg-[#f9fafb] border border-[#ebf0f6] rounded-2xl px-5 py-4 text-gray-800 focus:outline-none focus:border-[#2175eb] transition-all font-medium"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] bg-[#222222] text-white hover:bg-[#2175eb] transition-all shadow-xl shadow-gray-200 active:scale-[0.98] disabled:bg-gray-400"
        >
          {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
        </button>
      </form>
    </div>
  );
}

// Next.js requiere Suspense para usar useSearchParams en componentes de cliente
export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-[#f5f6f7] flex items-start justify-center p-4 pt-8 md:pt-12">
      <Suspense fallback={