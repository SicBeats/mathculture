/*
File Name: index.js

Author: Kelemen Szimonisz, Kaiser Slocum
Organization: Map Culture (University of Oregon, CIS422, FALL 2021)
Team: Map Culture (Team 5)

Last Modified: 11/10/2021
*/

// source: https://stackoverflow.com/a/20285053
// and: https://stackoverflow.com/a/52311051
function encodeImageFileAsURL(element){
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = async function() {
        console.log('RESULT',reader.result);
        let encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
        
        const flask_response = await fetch('/algo', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({'image': encoded}),
        });
        const data = await flask_response.json();
        console.log('POST response:',data);
        prediction = data['prediction']
        console.log('class prediction:',prediction);
        var messageDiv = document.getElementById('message');  
        messageDiv.innerText = "PREDICTION: " + prediction;
        
    };
    reader.readAsDataURL(file);
}

//source: https://stackoverflow.com/questions/2368784/draw-on-html5-canvas-using-a-mouse
// Javascript for Canvas design
var canvas, ctx, flag = false, dot_flag = false,
    prevX = 0, currX = 0, prevY = 0, currY = 0,
    x = "black", y = 2;
const equation = ["="];

// When our window is resized, the canvas element will resize.
// Hence we need to resize our canvas to retain the correct dimensions
// NOTE: CSS styles will skew the drawing on the canvas, so we need to use JS
window.onresize = windowResized;
function windowResized() 
{
    canvas = document.getElementById('can');
    cont = document.getElementById('canvas');
    // We want the canvas to fill up most of the canvas element's width, but only about half of the height
    canvas.width = cont.clientWidth / 1.03;
    canvas.height = cont.clientHeight / 1.5;
}

// The main functin in charge of setting up the canvas
function init() 
{
    canvas = document.getElementById('can');
    windowResized();

    ctx = canvas.getContext("2d");
    w = canvas.width;
    h = canvas.height;
    
    // If a user starts drawing on the canvas, we need to respond
    canvas.addEventListener("mousemove", function (e) { findxy('move', e) }, false);
    canvas.addEventListener("mousedown", function (e) { findxy('down', e) }, false);
    canvas.addEventListener("mouseup", function (e) { findxy('up', e) }, false);
    canvas.addEventListener("mouseout", function (e) { findxy('out', e) }, false);

    // Display the current canvas in the "last character" area
    displayCanvas();
    // Display the current Equation    
    var thing = document.getElementById("displayEquation");
    thing.innerText = "Equation: " + equation.join("");
}
// Dictates the color and size of the drawing    
function color(obj) 
{
    x = obj.id;
    if (x == "white") 
        y = 14;
    else 
        y = 2;    
}
// Dictates how the drawing feature works
function draw() 
{
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currX, currY);
    ctx.strokeStyle = x;
    ctx.lineWidth = y;
    ctx.stroke();
    ctx.closePath();
}
// This will clear the canvas
// It is not in charge of the eraser feature
function erase() 
{
    var m = confirm("Are you sure you want to clear the canvas?");
    if (m) 
    {
        ctx.clearRect(0, 0, w, h);
        document.getElementById("canvasimg").style.display = "none";
    }
    displayCanvas();
}
    
// This copies the contents of the canvas to the canvas img on the side
function displayCanvas()
{
    document.getElementById("canvasimg").style.border = "2px solid";
    var dataURL = canvas.toDataURL();
    document.getElementById("canvasimg").src = dataURL;
    document.getElementById("canvasimg").style.display = "inline";
}
// This calls displayCanvas() and calls the algorithm to get the image character
function save() 
{
    displayCanvas();

    var dataURL = canvas.toDataURL();
    var thing = document.getElementById("displayEquation");
    equation.unshift(translate_to_char(dataURL));
    thing.innerText = "Equation: " + equation.join("");
}
// Honestly, I'm not exactly sure what this does lol    
function findxy(res, e) 
{
    if (res == 'down') 
    {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.offsetLeft;
        currY = e.clientY - canvas.offsetTop;
    
        flag = true;
        dot_flag = true;
        if (dot_flag) 
        {
            ctx.beginPath();
            ctx.fillStyle = x;
            ctx.fillRect(currX, currY, 2, 2);
            ctx.closePath();
            dot_flag = false;
        }
    }
    if (res == 'up' || res == "out")
        flag = false;
    if ((res == 'move') && (flag))
    {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.offsetLeft;
        currY = e.clientY - canvas.offsetTop;
        draw();
    }
}
// Place holder function until algorithm is implemented
// TODO
function translate_to_char(image)
{
    return "t";
}
// Displays answer - should call WOLFRAM API
// TODO
async function calculatEquation()
{   
    var eq1 = "2*3+3*4+6-25/23";
    var n = eval(eq1);        
    document.getElementById("displayResult").innerText = " Answer: " + n;
}
// Deletes the last character
function deleteCharacter()
{
    if (equation.length == 1)
        alert("No more characters to delete!");
    else
    {
        var thing = document.getElementById("displayEquation");
        equation.shift();
        thing.innerText = "Equation: " + equation.join("");
    }    
}