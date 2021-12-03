// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js"; 
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
import { signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
import { updatePassword } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
import { getAnalytics, setUserProperties } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";



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
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.getElementById("submitRegister").addEventListener("click", function(event){
  event.preventDefault()
  // Get all our input fields
  //user = document.getElementById('user').value;
  var email = document.getElementById('email').value;
  var password = document.getElementById('pass').value;

  // TODO
  // Validate input fields
  /*
  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Email or Password is Outta Line!!');
    return;
    // Don't continue running the code
  }
  */
  createNewAccount(email,password);
});

/************************************************************************************************
FUNCTION: createNewAccount
PURPOSE: Takes email and password input and stores them in Firebase securely using Authentication.
         Adds an entry to the users/ table with the uid as a key, and the email as an attribute.
         The password is encrypted and is not accessible to the owner of the database. 
         This function will return an error if a user already exists with a given email. 
*************************************************************************************************/
async function createNewAccount(email,password) {

  const auth = getAuth(app);

  try {
    const userCredentials = await createUserWithEmailAndPassword(auth,email,password);
    const uid = userCredentials.user.uid;
    console.log('User Created!!');
    console.log(uid);
    signin(email);
    window.location.href="/";
    set(ref(database, 'users/' + uid), {
        email: email,
    });

  } 
  catch(error) {
    // Firebase will use this to alert of its errors
    var error_code = error.code;
    var error_message = error.message;
    alert(error_message);
  }
}
async function signinAccount(email,password) {
  const auth = getAuth(app);
  try {
    const userCredentials = await signInWithEmailAndPassword(auth,email,password);
    const uid = userCredentials.user.uid;
    console.log('User Signed in!!');
    console.log(uid);
    signin(email);    
    //window.location.href="/";
  const user = auth.currentUser;
  console.log(user.email);
  } 
  catch(error) {
    // Firebase will use this to alert of its errors
    var error_code = error.code;
    var error_message = error.message;
    alert(error_message);
  }
}

async function signoutAccount() {
  const auth = getAuth(app);  
  
  try {
    await signOut(auth);
    console.log('User Signed Out!!');
    signout();
  } 
  catch(error) {
    // Firebase will use this to alert of its errors
    var error_code = error.code;
    var error_message = error.message;
    alert(error_message);
  }
}



async function changepass(password)
{
  const auth = getAuth();

  const user = auth.currentUser;
  const newPassword = password;
  try {
    await updatePassword(user, newPassword);
    console.log('Password Changed!!');
    //window.location.href="/";
  } 
  catch(error) {
    // Firebase will use this to alert of its errors
    var error_code = error.code;
    var error_message = error.message;
    alert(error_message);
  }
}

async function getemail()
{
  const auth = getAuth(app);
  const user = auth.currentUser.email;
  console.log("email:", user);

  if (user) 
  {
  // User is signed in, see docs for a list of available properties
  // https://firebase.google.com/docs/reference/js/firebase.User
  // ...
  console.log("user", user);
  } 
  else 
  {
  // No user is signed in.
  console.log("failure");
  }
}


// Set up our login function
document.getElementById("signin").addEventListener("click", function(event){
  event.preventDefault()  
  // Get all our input fields
  var email = document.getElementById('email2').value
  var password = document.getElementById('pass2').value
  // Attempt to signin
  signinAccount(email, password);
  //getID();
});

// Set up our log out function
document.getElementById("showprofile").addEventListener("click", function(event){
  event.preventDefault()
  // Attempt to signout
  const auth = getAuth(app);
  const user = auth.currentUser;
  console.log(user.user);

  if (user !== null)
  {    
    show_profile(user.email);
  }
  else
  {
    show_profile(" ");
  }
});
// Set up our log out function
document.getElementById("changepass").addEventListener("click", function(event){
  event.preventDefault()
  // Attempt to signout
  const auth = getAuth(app);
  const user = auth.currentUser;
  var password1 = document.getElementById('newpass').value;
  var password2 = document.getElementById('repass').value;
  if (password1 != password2)
  {
    alert("The passwords do not match!");
  }
  else
  {
    changepass(password1);
  }  
});
// Set up our log out function
document.getElementById("signout").addEventListener("click", function(event){
  event.preventDefault()
  // Attempt to signout
  
  signoutAccount();
});

  /*auth.signInWithEmailAndPassword(user_id, password)
  .then(function() {
    // Declare user variable
    var user = auth.currentUser

    // Add this user to Firebase Database
    var database_ref = database.ref()

    // Create User data
    var user_data = {
      last_login : Date.now()
    }

    // Push to Firebase Database
    database_ref.child('users/' + user.uid).update(user_data)

    // Done
    console.log('User Logged In!!')

  })
  .catch(function(error) {
    // Firebase will use this to alert of its errors
    var error_code = error.code
    var error_message = error.message

    alert(error_message)
  })*/

