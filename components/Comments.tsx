'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { db } from '@/lib/firebase'; // Asegúrate de que la ruta coincida con tu estructura
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';

export default function Comments({ articleId }: { articleId: string }) {
  const { data: session } = useSession();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Escuchar comentarios en tiempo real
  useEffect(() => {
    if (!articleId) return;

    const q = query(
      collection(db, 'comments'),
      where('articleId', '==', articleId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
  (snapshot) => {
    console.log("Datos recibidos de Firestore:", snapshot.size);
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setComments(docs);
  },
  (error) => {
    // ESTO MOSTRARÁ EL ERROR EN LA CONSOLA SÍ O SÍ
    console.error("ERROR CRÍTICO DE FIRESTORE:", error.code, error.message);
    if (error.message.includes('index')) {
      console.log("BUSCA EL LINK AQUÍ ABAJO PARA EL ÍNDICE");
    }
  }
);

    return () => unsubscribe();
  }, [articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones iniciales
    if (!comment.trim() || !session?.user) return;

    setLoading(true);

    try {
      // Intento de publicación en Firestore
      await addDoc(collection(db, 'comments'), {
        articleId,
        text: comment.trim(),
        userName: session.user.name,
        userImage: session.user.image,
        userEmail: session.user.email,
        createdAt: serverTimestamp(),
      });

      // ÉXITO: Limpiamos el campo de texto
      setComment('');
      
    } catch (error) {
      console.error("Error al publicar comentario:", error);
      alert("No se pudo publicar el comentario. Por favor, intenta de nuevo.");
    } finally {
      // SIEMPRE: Quitamos el estado "Enviando..." sin importar si hubo éxito o error
      setLoading(false);
    }
  };

  return (
    <section className="mt-12 pt-12 border-t border-gray-100">
      <h3 className="text-xl font-black text-[#222222] mb-8 uppercase tracking-tighter">
        Comentarios ({comments.length})
      </h3>

      {session ? (
        <form onSubmit={handleSubmit} className="mb-10">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Escribe lo que piensas..."
            className="w-full bg-[#f9fafb] border border-[#ebf0f6] rounded-2xl p-5 text-gray-800 focus:outline-none focus:border-[#2175eb] transition-all font-medium resize-none"
            rows={3}
          />
          <div className="flex justify-end mt-3">
            <button
              type="submit"
              disabled={loading || !comment.trim()}
              className="bg-[#2175eb] text-white px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-[#222222] hover:cursor-pointer transition-all disabled:opacity-50 shadow-lg shadow-blue-100"
            >
              {loading ? 'Enviando...' : 'Publicar Comentario'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mb-10 text-center">
          <p className="text-sm text-blue-800 font-medium">
            Inicia sesión para participar en la conversación.
          </p>
        </div>
      )}

      <div className="space-y-8">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-4">
            {c.userImage && (
              <img 
                src={c.userImage} 
                alt={c.userName} 
                className="w-10 h-10 rounded-full shadow-sm" 
              />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[12px] font-black text-[#222222] uppercase">
                  {c.userName}
                </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                  • {c.createdAt?.toDate() ? c.createdAt.toDate().toLocaleDateString('es-HN') : 'Reciente'}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed text-[15px]">
                {c.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}