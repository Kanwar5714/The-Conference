import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDcZQczhpeuulcku3PiLe4fldOVF3Fdco0",
  authDomain: "collegechat-37201.firebaseapp.com",
  projectId: "collegechat-37201",
  storageBucket: "collegechat-37201.firebasestorage.app",
  messagingSenderId: "705963784273",
  appId: "1:705963784273:web:9253ae3fbcf325ff30e070",
  measurementId: "G-RJ8RP6JEDF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Setup Google Provider & force account selection
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account"   // This forces the account selection popup
});

export { auth, provider, signInWithPopup, signOut };
