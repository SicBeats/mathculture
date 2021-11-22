// Import the functions you need from the SDKs you need
import * as firebase from "firebase/app";
import 'firebase/functions'
// import 'firebase/app';
// import { getAnalytics } from "firebase/analytics";
import 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQ9a_t_JqB4_uSCr03jG_68MbICca0Cfg",
  authDomain: "arithmetic-math-calculator.firebaseapp.com",
  projectId: "arithmetic-math-calculator",
  storageBucket: "arithmetic-math-calculator.appspot.com",
  messagingSenderId: "915244473465",
  appId: "1:915244473465:web:9931e1dde113b72c2208a8",
  measurementId: "G-404YZECCP9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// export default { 
//     auth: firebase.auth(),
//     login() {
//       const provider = new firebase.auth.GoogleAuthProvider();
//       firebase.auth().signInWithRedirect(provider);
//     },
//     logout() {
//       firebase.auth().signOut()
//       .then(function() {})
//       .catch(function(error) {
//         console.log(error)});
//     },
//     createMenu() {
//       return firebase.functions().httpsCallable('c').call();
//     }
// }

// Detect auth
signInWithCustomToken(auth, token)
.then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    // ...
})
.catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
}),

signOut(auth).then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
    console.log(error)
  });
  