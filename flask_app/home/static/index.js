/*
Statement: Implements index.html button clicking
Authors: Kaiser Slocum
Team: Map Culture (Team 5)
Date last edited: 11/7/2021
*/

function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
  let lbl = document.getElementById('buton');
  /* This should access a function in the auth js file */
  let name = getAccountStatus();
  if (name == "")
  {
    name = "Account"
    link1 = document.getElementById("e1"); 
    link1.innerText="Sign In";  
    /* Go to Sign In webpage */
    link1.setAttribute("href", "http://www.google.com");
    link2 = document.getElementById("e2"); 
    link2.innerText="Sign Up";  
    /* Go to Sign Up webpage */
    link2.setAttribute("href", "http://www.google.com");
  }
  else
  {
    link1 = document.getElementById("e1"); 
    link1.innerText="Profile";  
    link1.setAttribute("href", "http://www.google.com");
    link2 = document.getElementById("e2"); 
    link2.innerText="Sign Out";  
    link2.setAttribute("href", "http://www.google.com");
  }
  lbl.innerText = name;
}

/* This will get removed later */
function getAccountStatus()
{
  return "";
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
