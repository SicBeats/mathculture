
function init() 
{
	signin();	
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