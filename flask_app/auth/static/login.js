/*
Statement: Loads of js
Authors: Kaiser Slocum
Team: Map Culture (Team 5)
Date Last Edited: 11/11/2021
*/


/* Called by the login.html when the page is loading */
function init() 
{
	signin();
    profileMethod();	
}
function signin()
{
    var x = document.getElementById("sign_in")
	var y = document.getElementById("register")	
	var z = document.getElementById("profile")
    x.style.left = "50px";
    y.style.left = "450px";
    z.style.left = "850px";
}
function register()
{
    var x = document.getElementById("sign_in")
	var y = document.getElementById("register")
	var z = document.getElementById("profile")
    x.style.left = "-350px";
    y.style.left = "50px";
    z.style.left = "450px";
}
function profile()
{
    var x = document.getElementById("sign_in")
	var y = document.getElementById("register")	
	var z = document.getElementById("profile")
    x.style.left = "-750px";
    y.style.left = "-350px";
    z.style.left = "50px";
}

/* This is called by the main js from every page to get the name of the user */
function getAccountStatus()
{
  return getUser();
}

/* signa  user in or up or out */
function signinMethod()
{   
    do_sign_in();
    //alert("signedin");
}
function signoutMethod()
{
    do_sign_out();
    //alert("signedout");    
}
function registerMethod()
{
    //alert("registered");
}
/* Sets up the info on the profile page */
function profileMethod()
{
    document.getElementById("UserID").innerHTML = "User ID: " + getUser();
    document.getElementById("GroupID").innerHTML = "Group ID: " + getGroup();
    document.getElementById("RoleID").innerHTML = "Role ID: " + getRole();
    document.getElementById("Email").innerHTML = "Email: " + getEmail();
}
/* 
Called by change password button
if the new and confirm passwords match
and the original passwords match
then new password is set
this is not hooked up to database so it's broken
*/
function changePassword()
{
    var oldpass = document.getElementById("oldpass").value;
    var newpass = document.getElementById("newpass").value;
    var confirmpass = document.getElementById("confirmpass").value;
    console.log(oldpass);
    if (newpass != confirmpass)
        alert("The new password and confirmation password do not match!");
    else if (oldpass != getPassword())
        alert("Your password does not match the correct password!")
    else
    {
        setPassword(newpass);
        alert("Your new password(1amLump) has been set!")
    }
}


/* This decodes the cookie to get the "signedin" or "signedout" clause */
var stat = "";
function getCookie() 
{
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    let c = ca[2];
    return c;
  }

  /* These functions are called for signing in and signint out */
function do_sign_in()
{    
    document.cookie = "signedin";  
    profileMethod();
    console.log("After sign in cookie is: ", getCookie());  
}
function do_sign_out()
{
    document.cookie= " signedout";
    profileMethod();
    console.log("After sign out cookie is: ", getCookie());
}

/* the following functions are mainly just for displaying info on the profile page */
function getUser()
{
    console.log(getCookie());

    if (getCookie() == " signedin")
        return "Lumpy";
    else
        return "";        
}
function getPassword()
{
    if (getCookie() == " signedin")
        return "1amLump";
    else
        return "";
}
function setPassword(newPass)
{
    var pass = newPass;
}
function getGroup()
{
    if (getCookie() == " signedin")
        return "TiggerGang";
    else
        return "";
}
function getRole()
{
    if (getCookie() == " signedin")
        return "Instructor";
    else
        return "";
}
function getEmail()
{
    if (getCookie() == " signedin")
        return "lumpyh@hundredacre.woods";
    else
        return "";
}