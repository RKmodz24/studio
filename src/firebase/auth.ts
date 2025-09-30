
'use client';

import { Auth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

/**
 * Initiates Google sign-in process.
 * Takes the credential from the Google Sign-In button and uses it to
 * sign in with Firebase.
 */
export async function signInWithGoogle(authInstance: Auth, idToken: string): Promise<void> {
  const credential = GoogleAuthProvider.credential(idToken);
  await signInWithCredential(authInstance, credential);
}
