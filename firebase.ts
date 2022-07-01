import { initializeApp } from "firebase/app";
import{getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZvw6F4ukmPbx10RiXz4sjxGghJsVUVto",
  authDomain: "newnest-cb811.firebaseapp.com",
  projectId: "newnest-cb811",
  storageBucket: "newnest-cb811.appspot.com",
  messagingSenderId: "698960820516",
  appId: "1:698960820516:web:3275abcbd0329f64c25bb1"
};

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app);