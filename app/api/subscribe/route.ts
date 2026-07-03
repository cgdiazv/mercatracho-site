import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { token, platform, isPremium } = await await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token es requerido' }, { status: 400 });
    }

    // Guardamos o actualizamos el token en Firestore
    const docRef = doc(db, 'subscriptions', token);
    await setDoc(docRef, {
      token: token,
      platform: platform || 'web',
      isPremium: isPremium || false,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return NextResponse.json({ success: true, message: 'Suscripción guardada exitosamente.' });
  } catch (error: any) {
    console.error('Error en API de suscripción:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}