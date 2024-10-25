// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, getDocs } from "firebase/firestore"; 
import { getSongsAction } from "../store/actions";
import { dispatch } from "../store/store";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCP-NFklL3FTrnLlmoQRFw_ervthogrGdg",
  authDomain: "dca-song-app.firebaseapp.com",
  projectId: "dca-song-app",
  storageBucket: "dca-song-app.appspot.com",
  messagingSenderId: "209834028678",
  appId: "1:209834028678:web:4778a490cc9402b860ab07",
  measurementId: "G-XS00R1408G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const addSong = async (song: any) => {
    try {
        const where = collection(db, "songs");
        const docRef = await addDoc(where, song);
        console.log("Song written with ID: ", docRef.id);
        // actualizar appState con la nueva canción
        const action =  await getSongsAction();
        dispatch(action);
      } catch (e) {
        console.error("Error adding song: ", e);
      }
};

export const getSongs = async () => {
    const where = collection(db, "songs");
    const querySnapshot = await getDocs(where);
    const data: any= [];

    querySnapshot.forEach((doc) => {
        data.push(doc.data());
    }  );
    console.log('data', data);

    return data;
}