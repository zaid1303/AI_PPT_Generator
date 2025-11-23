// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
import { getAI, getGenerativeModel, getLiveGenerativeModel, GoogleAIBackend, ResponseModality } from "firebase/ai";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  //@ts-ignore
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "ai-ppt-generator-c489e.firebaseapp.com",
  projectId: "ai-ppt-generator-c489e",
  storageBucket: "ai-ppt-generator-c489e.firebasestorage.app",
  messagingSenderId: "966332361992",
  appId: "1:966332361992:web:7cf3bfd25d0a5d481cd0bd",
  measurementId: "G-Y5R3RF7VE0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseDb=getFirestore(app,'ai-ppt-generator');

// Initialize the Gemini Developer API backend service
const ai = getAI(app, { backend: new GoogleAIBackend() });

// Create a `GenerativeModel` instance with a model that supports your use case
export const GeminiModel = getGenerativeModel(ai, { model: "gemini-2.5-flash" });

export const GeminiLiveModel = getLiveGenerativeModel(ai,{
  model:"gemini-2.0-flash-live-001",
  generationConfig:{
    responseModalities:[ResponseModality.TEXT]
  }
})
