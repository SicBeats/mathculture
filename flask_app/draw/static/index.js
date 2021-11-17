/*
File Name: index.js

Author: Kelemen Szimonisz, Kaiser Slocum
Organization: Map Culture (University of Oregon, CIS422, FALL 2021)
Team: Map Culture (Team 5)

Last Modified: 11/14/2021
*/

/*****************************************************************
FUNCTION:encodeImageFileAsURL
PURPOSE: This function takes an image file and coverts it to a url
SOURCES: 
https://stackoverflow.com/a/20285053
https://stackoverflow.com/a/52311051
******************************************************************/
//function encodeImageFileAsURL(element){
function encodeImageFileAsURL(file){
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
        var messageDiv = document.getElementById('displayEquation');  
        messageDiv.innerText = "PREDICTION: " + prediction;
        
    };
    reader.readAsDataURL(file);
}
/***********************************************************************************************
FUNCTION: loadfile
PURPOSE: This function takes the uploaded file image and displays it in the canvas image element
************************************************************************************************/
function loadfile(event) 
{
    var file = event.target.files[0]
    encodeImageFileAsURL(file);
    //imagePreview(URL.createObjectURL(event.target.files[0]));
    imagePreview(URL.createObjectURL(file));
}

function imagePreview(img)
{
    var canvasimg = document.getElementById("canvasimg");   
    canvasimg.src = img;  
    // Need to retain aspect ratio to keep 640x480
    canvasimg.style.height = (Math.round(canvasimg.clientWidth * 3 / 4)).toString(10) + "px";
    console.log("Canvas image element height is now: ", canvasimg.clientHeight);
}

/***********************************************************************************************
VARIABLES: canvas, ctx, flag, x, y, prevX, currX, prevY, currY, equation
PURPOSE: These variables (except equation which is purely for the calculating of equations)
hold attributes needed for drawing on the canvas.
SOURCES: https://stackoverflow.com/questions/2368784/draw-on-html5-canvas-using-a-mouse
(The above source was used for most of the canvas drawing functions - although heavily modified)
************************************************************************************************/
var canvas, ctx, flag = false, x = "black", y = 2, prevX = 0, currX = 0, prevY = 0, currY = 0;    
const equation = ["="];

/***********************************************************************************************
FUNCTION: windowResized
PURPOSE: When our window is resized, this function will cause the canvas element to resize as well.
NOTE: CSS styles will skew the drawing on the canvas, so we need to use JS to do this
************************************************************************************************/
window.onresize = windowResized;
function windowResized() 
{
    // Get our various elements
    canvas = document.getElementById('canvas');
    drawInterface = document.getElementById('drawInterface');
    // Set how wide our canvas is according to the size of its parent container
    canvas.width = drawInterface.clientWidth / 1.3;
    // Now set the height of the canvas to match the 640x480 size
    canvas.height = Math.round(canvas.clientWidth * 3 / 4);
    // We also will resize the canvas view
    canvasimg.style.height = (Math.round(canvasimg.clientWidth * 3 / 4)).toString(10) + "px";
}

/***********************************************************************************************
FUNCTION: init
PURPOSE: This is the main function called by the html's body element. 
It is in charge of setting up the drawFace interface and the elements inside - namely the canvas
************************************************************************************************/
function init() 
{
    // Call window resize to make sure the sizing of the canvas/canvas view is correct    
    windowResized();
    canvas = document.getElementById('canvas');
    // Set the global variables
    ctx = canvas.getContext("2d");
    w = canvas.width;
    h = canvas.height;
    
    // If a user starts drawing on the canvas, we need to respond
    canvas.addEventListener("mousemove", function (e) { findxy('move', e) }, false);
    canvas.addEventListener("mousedown", function (e) { findxy('down', e) }, false);
    canvas.addEventListener("mouseup", function (e) { findxy('up', e) }, false);
    canvas.addEventListener("mouseout", function (e) { findxy('out', e) }, false);

    // Display the empty canvas in the "last character" area
    imagePreview(canvas.toDataURL());
    // Display the current Equation   
    document.getElementById("displayEquation").innerText = "Equation: " + equation.join("");
}
/***********************************************************************************************
FUNCTION: color
PURPOSE: To change the color of the drawing depending on the color that the user selects
************************************************************************************************/  
function color(obj) 
{
    x = obj.id;
    if (x == "white") 
    {
        y = 14;
    }
    else 
        y = 2;    
}
/***********************************************************************************************
FUNCTION: clearCanvas
PURPOSE: Clears the main canvas, but not the canvas viewer
************************************************************************************************/
function clearCanvas() 
{
    if (confirm("Are you sure you want to clear the canvas?")) 
    {
        ctx.clearRect(0, 0, w, h);
        document.getElementById("canvasimg").style.display = "inline";
    }
}    
/***********************************************************************************************
FUNCTION: save()
PURPOSE: This function:
Calls imagePreview() to display the character
Calls translate_to_char() to get the corresponding character for the image
Adds the mathematical operator or digit to the equation
************************************************************************************************/
function save() 
{
    imagePreview(canvas.toDataURL());
    equation.unshift(translate_to_char(canvas.toDataURL()));
    document.getElementById("displayEquation").innerText = "Equation: " + equation.join("");
}
/***********************************************************************************************
FUNCTION: findxy
PURPOSE: Pretty much handles all of the drawing  
************************************************************************************************/
function findxy(res, e) 
{    
    if (res == 'up' || res == "out")
        flag = false;
    else
    {
        prevX = currX;
        prevY = currY;
        currX = e.clientX - canvas.getBoundingClientRect().left;
        currY = e.clientY - canvas.getBoundingClientRect().top;
        if (res == 'down') 
        {    
            flag = true;
            ctx.beginPath();
            ctx.fillStyle = x;
            ctx.fillRect(currX, currY, 3, 3);            
            ctx.closePath();
        }
        else if ((res == 'move') && (flag))
        {
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(currX, currY);
            ctx.strokeStyle = x;
            ctx.lineWidth = y;
            ctx.stroke();
            ctx.closePath();
        }            
    }    
}
/***********************************************************************************************
FUNCTION: translate_to_char()
PURPOSE: Calls deep-learning algorithm to translate image into math character
************************************************************************************************/
function translate_to_char(image)
{
    return "t";
}
/***********************************************************************************************
FUNCTION: calculatEquation
PURPOSE: Displays answer - should call WOLFRAM API
************************************************************************************************/
async function calculatEquation()
{   
    var eq1 = "2*3+3*4+6-25/23";
    var n = eval(eq1);        
    document.getElementById("displayResult").innerText = " Answer: " + n;
}
/***********************************************************************************************
FUNCTION: deleteCharacter
PURPOSE: Deletes the last character in the equation
************************************************************************************************/
function deleteCharacter()
{
    if (equation.length == 1)
        alert("No more characters to delete!");
    else
    {
        equation.shift();
        document.getElementById("displayEquation").innerText = "Equation: " + equation.join("");
    }   
}
