
'use client';

import { Auth, GoogleAuthProvider, FacebookAuthProvider, signInWithCredential, signInWithPopup } from 'firebase/auth';

/**
 * Initiates Google sign-in process.
 * Takes the credential from the Google Sign-In button and uses it to
 * sign in with Firebase.
 */
export async function signInWithGoogle(authInstance: Auth, idToken: string): Promise<void> {
  const credential = GoogleAuthProvider.credential(idToken);
  await signInWithCredential(authInstance, credential);
}

/**
 * Initiates Facebook sign-in process using a popup.
 */
export async function signInWithFacebook(authInstance: Auth): Promise<void> {
  const provider = new FacebookAuthProvider();
  await signInWithPopup(authInstance, provider);
}
