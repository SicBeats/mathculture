/*
File Name: index.js

Author: Kelemen Szimonisz, Kaiser Slocum
Organization: Map Culture (University of Oregon, CIS422, FALL 2021)
Team: Map Culture (Team 5)

Last Modified: 11/09/2021
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
var canvas, ctx, flag = false,
    prevX = 0,
    currX = 0,
    prevY = 0,
    currY = 0,
    dot_flag = false;
const ary = [];
ary.push("=");

var x = "black", y = 2;

window.onresize = windowResized;

function windowResized() 
{
    canvas = document.getElementById('can');
    cont = document.getElementById('canvas');
    canvas.width = cont.clientWidth / 1.03  ;
    canvas.height = cont.clientHeight / 1.5;
}
    
function init() 
{
    canvas = document.getElementById('can');
    windowResized();

    ctx = canvas.getContext("2d");
    w = canvas.width;
    h = canvas.height;
    
    canvas.addEventListener("mousemove", function (e) { findxy('move', e) }, false);
    canvas.addEventListener("mousedown", function (e) { findxy('down', e) }, false);
    canvas.addEventListener("mouseup", function (e) { findxy('up', e) }, false);
    canvas.addEventListener("mouseout", function (e) { findxy('out', e) }, false);

    displayCanvas();
}
    
function color(obj) 
{
    x = obj.id;
    if (x == "white") 
        y = 14;
    else 
        y = 2;    
}
    
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
    
function erase() 
{
    var m = confirm("Want to clear");
    if (m) 
    {
        ctx.clearRect(0, 0, w, h);
        document.getElementById("canvasimg").style.display = "none";
    }
    displayCanvas();
}
    
function displayCanvas()
{
    document.getElementById("canvasimg").style.border = "2px solid";
    var dataURL = canvas.toDataURL();
    document.getElementById("canvasimg").src = dataURL;
    document.getElementById("canvasimg").style.display = "inline";
}
function save() 
{
    displayCanvas();

    var dataURL = canvas.toDataURL();
    var thing = document.getElementById("displayEquation");
    ary.push(translate_to_char(dataURL));
    thing.innerText = ary;
}
    
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


function translate_to_char(image)
{
    return "t";
}