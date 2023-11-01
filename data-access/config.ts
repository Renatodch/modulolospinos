import {initializeApp} from "firebase/app";
import {getFirestore,collection,addDoc, getDocs} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDBJUDJvFT8QZu-GWaKI7sJl2rLp13Yai0",
    authDomain: "moduloslospinos.firebaseapp.com",
    projectId: "moduloslospinos",
    storageBucket: "moduloslospinos.appspot.com",
    messagingSenderId: "656544076977",
    appId: "1:656544076977:web:2480bb851f8e0db64f7e90"
};
// Initialize Firebase
const firestoreApp =  initializeApp(firebaseConfig);
const db = getFirestore(firestoreApp);


export {
  db,
};