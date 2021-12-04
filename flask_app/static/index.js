/*
Statement: Implements index.html button clicking
Authors: Kaiser Slocum
Team: Map Culture (Team 5)
Date last edited: 12/3/2021
*/

// This Prevent users who have not logged in from using the Draw Interface
function userLoggedIn()
{
  if (getCookie() == "Account")
    alert('You must login first! Use the account menu!');
  else
    window.location.href = "/draw";
}
// Open the dropdown if the user clicks on it
function dropdownFunc() {
  document.getElementById("myDropdown").classList.toggle("show");
  let lbl = document.getElementById('buton');
  /* This should access a function in the auth, login.js */
  let name = getCookie();
  // Depending on if we are logged in or not, the drop down menu needs to reflects those states
  if (name == "Account")
  {
    document.getElementById("e1").innerText="Go Sign In";  
    document.getElementById("e1").setAttribute("href", "/login");
    document.getElementById("e2").innerText="Go Sign Up";  
    document.getElementById("e2").setAttribute("href", "/login");
  }
  else
  {
    document.getElementById("e1").innerText="View Profile";  
    document.getElementById("e1").setAttribute("href", "/login");
    document.getElementById("e2").innerText="Go Sign Out";  
    document.getElementById("e2").setAttribute("href", "/login");
  }
  lbl.innerText = name;
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) 
{
  if (!event.target.matches('.dropbtn')) 
  {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) 
    {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) 
        openDropdown.classList.remove('show');
    }
  }
}
// This is in charge of whether we display the username or "account" for the drop-down menu
window.onload = function chg()
{
  let accStat = getCookie();
  if ((accStat == "Account") || (accStat == ""))
  {
    signout();
    accStat = getCookie();
  }    
  document.getElementById('buton').innerText = accStat;
}