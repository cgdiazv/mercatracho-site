// components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-12 mt-12">
      {/* Reducimos el max-width para que las columnas se acerquen al centro */}
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Ajustamos el gap de 12 a 4 para que estén más pegadas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20">
          
          {/* Columna 1 */}
          <div className="flex flex-col space-y-3">
            <Link href="#" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">Memebresías</Link>
            <Link href="#" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">Beneficios Mercatracho</Link>
            <Link href="#" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">Productos y Servicios</Link>
            <Link href="#" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">Apoyo a la Comunidad</Link>
          </div>

          {/* Columna 2 */}
          <div className="flex flex-col space-y-3">
            <Link href="#" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">Empleos</Link>
            <Link href="#" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">Acerca de Mercatracho</Link>
            <Link href="#" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">Centro de Prensa</Link>
            <Link href="#" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">Contáctenos</Link>
          </div>

          {/* Columna 3 */}
          <div className="flex flex-col space-y-3">
            <Link href="#" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">Tu Cuenta</Link>
            <Link href="#" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">Perfil de Usuario</Link>
            <Link href="#" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">Órdenes Recientes</Link>
            <Link href="#" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">Tus Direcciones</Link>
          </div>
        </div>

        {/* Copyright centrado */}
        <div className="text-center pt-8">
          <p className="text-gray-400 text-[13px] tracking-wide">
            © 2015-2026 Mercatracho. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}