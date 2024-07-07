import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCL9VWAdDQug_HLPidmbhHHrtifoGnzVns",
  authDomain: "teayudo-53310.firebaseapp.com",
  projectId: "teayudo-53310",
  storageBucket: "teayudo-53310.appspot.com",
  messagingSenderId: "582637542555",
  appId: "1:582637542555:web:73f10d78309b85efa73a3e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;