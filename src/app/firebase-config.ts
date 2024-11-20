import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
apiKey: "AIzaSyBHYTF-1-duMfgCI92l1s-LVX0WpON-Euw",
  authDomain: "login-fa6e0.firebaseapp.com",
  projectId: "login-fa6e0",
  storageBucket: "login-fa6e0.appspot.com",
  messagingSenderId: "715942525063",
  appId: "1:715942525063:web:d7953f278bb9d9fcc6a022",
};

// Inicializa Firebase si aún no se ha inicializado
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };