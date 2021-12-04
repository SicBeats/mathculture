/*
Statement: Loads of js
Authors: Kaiser Slocum, Kelemen Szimonez
Team: Map Culture (Team 5)
Date Last Edited: 12/3/2021
*/

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js"; 
import { getDatabase, ref, set, child, get } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updatePassword} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";

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

/************************************************************************************************
FUNCTION: function register
PURPOSE: Once the register button is clicked this function is in charge of gathering all the user
input and sending it to the createNewAccount()
*************************************************************************************************/
document.getElementById("register").addEventListener("click", function(event)
{
  event.preventDefault()
  // Get all our input fields
  var userID    = document.getElementById('user').value;
  var email     = document.getElementById('email').value;
  var groupID   = document.getElementById('group').value;
  var accesskey = document.getElementById('access').value;
  var password  = document.getElementById('pass').value;
  
  var role = " ";
  var s = document.getElementById("student");
  var i = document.getElementById("instructor");
  if (s.checked == true)
  {
    console.log(s.value);
    role = s.value;

  }	  
  else if (i.checked == true)
  {
    console.log(i.value);
    role = i.value;
  }    
  else
  {
    alert("Neither Instructor nor Student was specified!");
    return;
  }
  var t = document.getElementById("checkbox");
  if (t.checked == false)
  {
    alert("You must agree to the terms and conditions!");
    return;
  }    

  createNewAccount(userID, email, groupID, accesskey, password, role);
});

/************************************************************************************************
FUNCTION: createNewAccount
PURPOSE: Takes email and password input and stores them in Firebase securely using Authentication.
         Adds an entry to the users/ table with the uid as a key, and the email as an attribute.
         The password is encrypted and is not accessible to the owner of the database. 
         This function will return an error if a user already exists with a given email. 
*************************************************************************************************/
async function createNewAccount(userID, email, groupID, accesskey, password, role) 
{
  const auth = getAuth(app);

  try 
  {
    // First create the account using the email and password
    const userCredentials = await createUserWithEmailAndPassword(auth,email,password);
    const uid = userCredentials.user.uid;
    console.log('User Created!!');
    //make sure to set all the attributes using the input arguments
    set(ref(database, 'users/' + uid), {
        email: email,
        role: role,
        userID: userID,
        groupID: groupID, 
        accesskey: accesskey,
    });

    // This gets the user ID for display on each main page
    var userID = " ";
    const dbRef = ref(getDatabase(app));
    await get(child(dbRef, `users/${uid}`)).then((snapshot) => {
    if (snapshot.exists()) 
    {
      userID = snapshot.child("userID").val();
      console.log(userID);
    } else 
    {
      console.log("No data available");
    }
    }).catch((error) => {
      console.error(error);
    });
    register(userID);
    alert("Account created!");
  } 
  catch(error) 
  {
    // Firebase will use this to alert of its errors
    var error_code = error.code;
    var error_message = error.message;
    alert(error_message);
  }
}

/************************************************************************************************
FUNCTION: signinAccount
PURPOSE: Takes email and password input and authenticates them using the Firebase Authentication.         
*************************************************************************************************/
async function signinAccount(email,password) 
{
  const auth = getAuth(app);
  try 
  {
    const userCredentials = await signInWithEmailAndPassword(auth,email,password);
    const uid = userCredentials.user.uid;
    console.log('User Signed in!!');

    // This gets the user ID for display on each main page
    var userID = " ";
    const dbRef = ref(getDatabase(app));
    await get(child(dbRef, `users/${uid}`)).then((snapshot) => {
    if (snapshot.exists()) 
    {
      userID = snapshot.child("userID").val();
      console.log(userID);
    } else 
    {
      console.log("No data available");
    }
    }).catch((error) => {
      console.error(error);
    });
    
    signin(userID);    
    alert("You have been signed in!");
  } 
  catch(error) 
  {
    // Firebase will use this to alert of its errors
    var error_code = error.code;
    var error_message = error.message;
    alert(error_message);
  }  
}
/************************************************************************************************
FUNCTION: function signin
PURPOSE: Once the login button is clicked this function is in charge of gathering the user's
input and sending it to the signinAccount()
*************************************************************************************************/
document.getElementById("signin").addEventListener("click", function(event){
  event.preventDefault()  
  // Get all our input fields
  var email = document.getElementById('email2').value
  var password = document.getElementById('pass2').value
  signinAccount(email, password);
});

/************************************************************************************************
FUNCTION: signoutAccount
PURPOSE: Signs the user out
*************************************************************************************************/
async function signoutAccount() 
{
  const auth = getAuth(app);  
  
  try 
  {
    await signOut(auth);
    console.log('User Signed Out!!');
    signout();
    alert("You signed out!");
  } 
  catch(error) 
  {
    // Firebase will use this to alert of its errors
    var error_code = error.code;
    var error_message = error.message;
    alert(error_message);
  }
}
/************************************************************************************************
FUNCTION: function signout
PURPOSE: Once the signout button is clicked this function is in charge of signing the user out
*************************************************************************************************/
document.getElementById("signout").addEventListener("click", function(event){
  event.preventDefault()  
  signoutAccount();
});

/************************************************************************************************
FUNCTION: changepass
PURPOSE: Changes the user's password - since the user is already logged in, there is no need to
validate his current password.
*************************************************************************************************/
async function changepass(password)
{
  const auth = getAuth();
  const user = auth.currentUser;
  const newPassword = password;

  try 
  {
    await updatePassword(user, newPassword);
    console.log('Password Changed!!');
    alert("Your password changed!");
  } 
  catch(error) 
  {
    // Firebase will use this to alert of its errors
    var error_code = error.code;
    var error_message = error.message;
    alert(error_message);
  }
}
/************************************************************************************************
FUNCTION: function changepass
PURPOSE: Once the change password button is clicked this function is in charge of gathering the user's
new password and changing the password (if the new and confirm passwords match!)
*************************************************************************************************/
document.getElementById("changepass").addEventListener("click", function(event){
  event.preventDefault()
  // Attempt to signout
  const auth = getAuth(app);
  const user = auth.currentUser;
  var password1 = document.getElementById('newpass').value;
  var password2 = document.getElementById('repass').value;
  if (password1 != password2)
    alert("The passwords do not match!");
  else 
    changepass(password1); 
});

/************************************************************************************************
FUNCTION: function showprofile
PURPOSE: Once the profile file is clicked, this is in charge of populating the profile form
*************************************************************************************************/
document.getElementById("showprofile").addEventListener("click", async function(event)
{
  event.preventDefault()
  var userID = "";
  var email = "";
  var groupID = "";
  var accesskey = "";
  var role = "";
  const auth = getAuth(app);
  const user = auth.currentUser;

  if (user !== null)
  {    
    const uid = user.uid;
    const dbRef = ref(getDatabase(app));
    await get(child(dbRef, `users/${uid}`)).then((snapshot) => {
    if (snapshot.exists()) 
    {
      userID = snapshot.child("userID").val();
      email = snapshot.child("email").val();
      groupID = snapshot.child("groupID").val();
      accesskey = snapshot.child("accesskey").val();
      role = snapshot.child("role").val();
      console.log(userID);
    } else 
    {
      console.log("No data available");
    }
    }).catch((error) => {
      console.error(error);
    });    
  }
  console.log("role:", role);
  if (role == "student")
  {
    document.getElementById("blckbtn").disabled = true;
  }
  show_profile(userID, role, groupID, email, accesskey);
});
