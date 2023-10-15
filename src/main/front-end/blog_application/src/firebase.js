// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth} from "firebase/auth";

export {auth}
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBH6TMvHl2fg1HFiEAJKsUVUtNQsnAH5R8",
  authDomain: "blogapplication-1996b.firebaseapp.com",
  projectId: "blogapplication-1996b",
  storageBucket: "blogapplication-1996b.appspot.com",
  messagingSenderId: "31576643240",
  appId: "1:31576643240:web:7c634e6b9c7d6aa0a3149d",
  measurementId: "G-PSR8TLK1LW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

