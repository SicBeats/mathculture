/*
Authors: Kaiser Slocum
Team: Map Culture (Team 5)
Date Last Edited: 12/3/2021
Purpose: Implements login_firebase.html "swoosh" motion and displaying database info on other web pages
*/

// Called by the login.html when the page is loading
// We always want the signin form to show up first
function init() 
{
	show_signin();	
    document.getElementById("student").checked = true;
}
// Shows the signin form
function show_signin()
{
    var x = document.getElementById("sign_inForm")
	var y = document.getElementById("registerForm")	
	var z = document.getElementById("profileForm")
    x.style.left = "50px";
    y.style.left = "450px";
    z.style.left = "850px";
}
// Shows the register form
function show_register()
{
    var x = document.getElementById("sign_inForm")
	var y = document.getElementById("registerForm")
	var z = document.getElementById("profileForm")
    x.style.left = "-350px";
    y.style.left = "50px";
    z.style.left = "450px";
}
// Shows the profile form
// When this form loads, we need to automatically check for a logged-in user
function show_profile(userID, role, groupID, email, accesskey)
{
    var x = document.getElementById("sign_inForm")
	var y = document.getElementById("registerForm")	
	var z = document.getElementById("profileForm")
    x.style.left = "-750px";
    y.style.left = "-350px";
    z.style.left = "50px";
    
    profile(userID, role, groupID, email, accesskey);
}

// Called by signin button, simply creates a cookie that will display the User ID on other web pages
function signin(userID)
{   
    console.log("UserID is: ", userID);
    document.cookie = userID;  
    console.log("After sign in cookie is: ", getCookie()); 
}
// Called by signout button, simple sets User ID to "Account" on other web pages (because now they aren't logged in)
function signout()
{
    document.cookie= "Account";
    console.log("After sign out cookie is: ", getCookie());   
}
// Called by register button, simply creates a cookie that will display the User ID on other web pages
function register(userID)
{
    // Check to make sure user ID is unique, verify group ID corresponds with account sign-up code
    document.cookie = userID;  
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

/* This decodes the cookie to get the User ID for display on the main web pages */
function getCookie() 
{
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    let c = ca[ca.length-1];

    // If the user is logged in (i.e. Account is equal to -1 (not in "c"))
    if (c.indexOf("Account") == -1)   
        return c;
    else
        return "Account";   
}