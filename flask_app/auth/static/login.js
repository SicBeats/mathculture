/*
Statement: Loads of js
Authors: Kaiser Slocum
Team: Map Culture (Team 5)
Date Last Edited: 11/15/2021
*/

// Called by the login.html when the page is loading
// We always want the signin form to show up first
function init() 
{
	show_signin();	
}
// Shows the signin form
function show_signin()
{
    var x = document.getElementById("sign_in")
	var y = document.getElementById("register")	
	var z = document.getElementById("profile")
    x.style.left = "50px";
    y.style.left = "450px";
    z.style.left = "850px";
}
// Shows the register form
function show_register()
{
    var x = document.getElementById("sign_in")
	var y = document.getElementById("register")
	var z = document.getElementById("profile")
    x.style.left = "-350px";
    y.style.left = "50px";
    z.style.left = "450px";
}
// Shows the profile form
function show_profile(userID, role, groupID, email, accesskey)
{
    var x = document.getElementById("sign_in")
	var y = document.getElementById("register")	
	var z = document.getElementById("profile")
    x.style.left = "-750px";
    y.style.left = "-350px";
    z.style.left = "50px";
    
    profile(userID, role, groupID, email, accesskey);
}

// Called by signin button
function signin(email)
{   
    // Check to make sure user ID and password match
    document.cookie = email;  
    console.log("After sign in cookie is: ", getCookie()); 
}
// Called by signout button
function signout()
{
    document.cookie= "Account";
    console.log("After sign out cookie is: ", getCookie());   
}
// Called by register button
function register(email)
{
    // Check to make sure user ID is unique, verify group ID corresponds with account sign-up code
    document.cookie = email;  
    console.log("After register cookie is: ", getCookie()); 
}
/* Sets up the info on the profile page */
function profile(userID, role, groupID, email, accesskey)
{    
    document.getElementById("UserID").innerHTML = "User ID: " + userID;
    document.getElementById("GroupID").innerHTML = "Group ID: " + groupID;
    document.getElementById("RoleID").innerHTML = "Role ID: " + role;
    document.getElementById("Email").innerHTML = "Email: " + email;
    document.getElementById("AccessKey").innerHTML = "Access Key: " + accesskey;
}
/* 
Called by change password button
if the new and confirm passwords match and the original passwords match then new password is set
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
    else if (oldpass != "1amLump")
        alert("Your password does not match the correct password!")
    else
    {
        alert("Your new password(1amLump) has been set!")
        // change the password
    }
}

/* This decodes the cookie to get the "signedin" or "signedout" clause */
function getCookie() 
{
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    let c = ca[ca.length-1];
    c = c.split('@');
    var dabool = c[0].indexOf("Account");

    if (dabool == -1)   
        return c[0];
    else
        return "Account";
}