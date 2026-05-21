import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAXGSC8X-XRfcNkVHkzyDMv1sX7YKKhrFA",
  authDomain: "amtaf-tcg.firebaseapp.com",
  projectId: "amtaf-tcg",
  storageBucket: "amtaf-tcg.firebasestorage.app",
  messagingSenderId: "322625400267",
  appId: "1:322625400267:web:3eda28e63c950fc477da4e",
  measurementId: "G-C3155NPNFT"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)