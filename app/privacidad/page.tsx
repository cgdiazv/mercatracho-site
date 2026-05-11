// app/privacidad/page.tsx
import Link from 'next/link';

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-[#f5f6f7] pt-12 pb-24 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Cabecera */}
        <div className="mb-12">
          <Link href="/" className="text-[#2175eb] font-black text-[10px] uppercase tracking-widest flex items-center gap-2 mb-6 group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Volver al inicio
          </Link>
          <h1 className="text-4xl md:text-6xl font-black text-[#222222] tracking-tighter mb-4">
            Política de <span className="text-[#2175eb]">Privacidad</span>
          </h1>
          <p className="text-gray-400 font-medium italic text-sm">
            Última actualización: 10 de mayo de 2026
          </p>
        </div>

        {/* Contenido Principal */}
        <div className="bg-white rounded-[40px] p-8 md:p-16 border border-[#ebf0f6] shadow-sm text-[#444444] leading-relaxed space-y-12">
          
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2175eb] mb-4">1. Compromiso de Seguridad</h2>
            <p className="font-medium text-lg text-[#222222]">
              En cumplimiento de la normativa de Protección de Datos de Carácter Personal, Mercatracho garantiza la seguridad, integridad y privacidad de los datos aportados a través de nuestros formularios y sistemas de autenticación.
            </p>
          </section>

          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2175eb] mb-4">2. Recogida y Uso de Datos</h2>
            <p className="mb-4">
              Los datos personales introducidos libremente por el usuario son empleados única y exclusivamente para labores de gestión administrativa, técnica y comercial. Esto incluye:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li><strong>Autenticación:</strong> Uso de Google Auth para gestionar tu identidad de forma segura.</li>
              <li><strong>Gestión:</strong> Procesamiento de datos necesarios para la prestación de servicios contratados (membresías, newsletters).</li>
              <li><strong>Soporte:</strong> Uso de información de contacto para asistencia técnica o administrativa.</li>
            </ul>
            <p className="bg-gray-50 p-4 rounded-2xl border border-gray-100 italic text-sm">
              En ningún caso se cederán datos personales a terceros ajenos a la empresa sin consentimiento expreso, salvo entidades íntimamente ligadas a la prestación del servicio (como procesadores de pago o firmas legales/administrativas).
            </p>
          </section>

          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2175eb] mb-4">3. Responsabilidad del Usuario</h2>
            <p>
              La información facilitada por el usuario deberá ser veraz. El usuario garantiza la autenticidad de todos aquellos datos que comunique y es responsable de mantener dicha información actualizada. El usuario será el único responsable de manifestaciones falsas o inexactas que realice.
            </p>
          </section>

          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2175eb] mb-4">4. Seguridad y Cifrado</h2>
            <p>
              La transmisión de datos se efectúa de forma encriptada bajo una conexión segura. Sin embargo, el sitio no puede garantizar la invulnerabilidad absoluta ante ataques cibernéticos externos imposibles de detectar por las medidas de seguridad actuales. 
            </p>
            <p className="mt-4">
              Mercatracho no será responsable de incidencias derivadas de un acceso no autorizado o de la falta de diligencia del usuario en la custodia de sus claves de acceso.
            </p>
          </section>

          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2175eb] mb-4">5. Propiedad Intelectual</h2>
            <p>
              Queda expresamente prohibida la reproducción, distribución, comunicación pública o transformación total o parcial de los contenidos y software de este sitio, incluso citando las fuentes, sin el consentimiento previo y por escrito de Mercatracho.
            </p>
          </section>

          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2175eb] mb-4">6. Derechos del Usuario</h2>
            <p>
              Tienes pleno derecho a ejercitar tus derechos de acceso, rectificación, cancelación y oposición en cualquier momento. Puedes gestionar tu información desde tu panel de usuario o contactándonos directamente.
            </p>
          </section>

          <section className="pt-8 border-t border-gray-100">
            <p className="font-bold text-[#222222]">
              Consultas y Notificaciones: <br />
              <span className="text-[#2175eb] font-black">info@mercatracho.com</span>
            </p>
          </section>

        </div>

        <div className="mt-12 text-center space-y-2">
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
            Mercatracho &copy; 2026
          </p>
          <p className="text-gray-400 text-xs font-medium">
            Sometido a la legislación vigente.
          </p>
        </div>
        
      </div>
    </main>
  );
}