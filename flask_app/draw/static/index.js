/*
File Name: index.js

Author: Kelemen Szimonisz, Kaiser Slocum
Organization: Math Culture (University of Oregon, CIS422, FALL 2021)

This JavaScript file is used by draw.html template and enables the page to:
    1. Display a canvas to the user, where they can draw using their mouse
    2. Upload an image of a handwritten equation
    3. Display the bounding box predictions for the inputted equation
    4. Display a step-by-step solution to the predicted equation
Last Modified: 11/20/2021
*/

/***********************************************************************************************
FUNCTION: hideMessage
PURPOSE: Hides the 'messenger' div from the user
************************************************************************************************/
function hideMessage(){
    var messenger = document.getElementById("messenger");
    messenger.style.display = "none"; 
}

/***********************************************************************************************
FUNCTION: displayMessageToUser
PURPOSE: Displays a message to the user using the HTML div with the ID 'messenger'.
************************************************************************************************/
function displayMessageToUser(message){
    var messenger = document.getElementById("messenger");
    messenger.style.display = "flex"; 
    messenger.innerText = message;
}
     
/***********************************************************************************************
FUNCTION: convertImageFileToBase64
PURPOSE: Converts an image file (jpeg) to Base64 encoding
************************************************************************************************/
function convertImageFileToBase64(file){
    return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.onloadend = function(file){
            var result = reader.result;
            // remove the base64 datatype header
            resolve(result.toString().replace(/^data:(.*,)?/, ''));
        }
        reader.readAsDataURL(file);
    });
}

/***********************************************************************************************
FUNCTION: sendImageToObjectDetector 
PURPOSE: This function takes a base64 image file and sends it to the 
         backend object detector using HTTP POST request.
         The result is a step-by-step solution to the equation.
************************************************************************************************/
async function sendImageToObjectDetector(encoded){
    // POST request to /algo URL (handled by Flask back-end)
    const flask_response = await fetch('/algo', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({'image': encoded}),
    });
    // contains the result of the POST request (the predicted equation and image)
    const data = await flask_response.json();
    return data;
} 

/***********************************************************************************************
FUNCTION: loadfile
PURPOSE: This function takes the uploaded file image and displays it in the canvas image element
************************************************************************************************/
async function loadfile(event) 
{
    // get the uploaded file
    var file = event.target.files[0]
    // display the uploaded file
    imagePreview(URL.createObjectURL(file));
    // encode the image file in base64
    var encoded = await convertImageFileToBase64(file);
    // send the image file to the object detector (HTTP POST request)
    displayMessageToUser("Loading...");
    var data = await sendImageToObjectDetector(encoded);
    // display the prediction
    displayObjectDetectorResult(data);
}

/***********************************************************************************************
FUNCTION: imagePreview
PURPOSE: Display an image in the bottom left hand corner of the template. Retain aspect ratio.
************************************************************************************************/
function imagePreview(img)
{
    var canvasimg = document.getElementById("canvasimg");   
    canvasimg.src = img;  
    // Need to retain aspect ratio to keep 640x480
    canvasimg.style.height = (Math.round(canvasimg.clientWidth * 3 / 4)).toString(10) + "px";
}

/***********************************************************************************************
VARIABLES: canvas, ctx, flag, x, y, prevX, currX, prevY, currY, equation
PURPOSE: These variables (except equation which is purely for the calculating of equations)
hold attributes needed for drawing on the canvas.
SOURCES: https://stackoverflow.com/questions/2368784/draw-on-html5-canvas-using-a-mouse
(The above source was used for most of the canvas drawing functions - although heavily modified)
************************************************************************************************/
var canvas, ctx, flag = false, x = "black", y = 2, prevX = 0, currX = 0, prevY = 0, currY = 0;    
/***********************************************************************************************
FUNCTION: init
PURPOSE: This is the main function called by the html's body element. 
It is in charge of setting up the drawFace interface and the elements inside - namely the canvas
************************************************************************************************/
function init() 
{
    canvas = document.getElementById('canvas');
    // Set the global variables
    ctx = canvas.getContext("2d",{alpha: true});
    w = canvas.width;
    h = canvas.height;

    // Display the empty canvas in the image preview area 
    imagePreview(canvas.toDataURL());
    
    // If a user starts drawing on the canvas, we need to respond
    canvas.addEventListener("mousemove", function (e) { findxy('move', e) }, false);
    canvas.addEventListener("mousedown", function (e) { findxy('down', e) }, false);
    canvas.addEventListener("mouseup", function (e) { findxy('up', e) }, false);
    canvas.addEventListener("mouseout", function (e) { findxy('out', e) }, false);
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
    ctx.clearRect(0,0,w,h);
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
FUNCTION: displayObjectDetectorResult
PURPOSE: Parse the data returned from the backend. (The step-by-step solution and bbox_image)
         Display the step-by-step solution.
         Display the bbox image to the user.
************************************************************************************************/
function displayObjectDetectorResult(data){
    predictedEquation = data['prediction']
    bboxImage = "data:image/png;base64," + data['bbox_image'];

    // Display the predicted equation / Wolfram step-by-step to the user
    // remove ugly vertical bars from Wolfram output ( e.g. 'Answer | | x = 3/4')
    document.getElementById('displayResult').innerText = predictedEquation.replaceAll('|','');

    // Display the inputted image with drawn bbox predictions to the user
    bbox_prediction = "data:image/png;base64," + data['bbox_image'];
    imagePreview(bbox_prediction);
}

/***********************************************************************************************
FUNCTION: calculatEquation
PURPOSE: Converts the canvas drawing to a JPG image. Converts the JPG image to Base64.
         Sends the Base64 image to the backend to be processed by the object detector.
************************************************************************************************/
async function calculatEquation()
{   
    // clone the canvas drawing from the main canvas to the hidden canvas
    hiddenCanvas = document.getElementById('hidden-canvas');
    canvas = document.getElementById('canvas');

    cloneCanvas(canvas,hiddenCanvas);
    // convert all transparent pixels of the hidden canvas to white pixels
    colorTransparentCanvasPixels(hiddenCanvas,"#ffffff");

    // Display the inputted image in the imagePreview area
    canvasImage = hiddenCanvas.toDataURL();
    imagePreview(canvasImage);
    
    // convert the hiddenCanvas image to a blob
    const blob = await new Promise(resolve => hiddenCanvas.toBlob(resolve));
    // conver the blob to an image file
    const file = new File([blob], "temp.jpg");
    // encode the image file in base64
    var encoded = await convertImageFileToBase64(file);
    // send the image file to the object detector (HTTP POST request)
    displayMessageToUser("Calculating...");
    var data = await sendImageToObjectDetector(encoded);
    displayObjectDetectorResult(data);
    hideMessage();
}

/***********************************************************************************************
FUNCTION: cloneCanvas
PURPOSE: Clone the context of one canvas to another.
************************************************************************************************/
function cloneCanvas(sourceCanvas,destCanvas){
    destCtx = destCanvas.getContext("2d");
    // clear the destination canvas before drawing on it
    destCtx.clearRect(0,0,w,h);
    // draw the contents of the sourceCanvas onto the destCanvas
    destCtx.drawImage(sourceCanvas, 0, 0);
}

/***********************************************************************************************
FUNCTION: colorTransparentCanvasPixels
PURPOSE: Converts all transparent pixels of an HTML <canvas> element to a desired color
************************************************************************************************/
function colorTransparentCanvasPixels(sourceCanvas, color){
    context = sourceCanvas.getContext("2d",{alpha:true});
    context.globalCompositeOperation = "destination-over";
    context.fillStyle = color;
    context.fillRect(0,0,640,480);
}

/***********************************************************************************************
FUNCTION: downloadCanvas
PURPOSE: downloads canvas to picture
************************************************************************************************/
function downloadCanvas()
{
    // clone the canvas drawing from the main canvas to the hidden canvas
    hiddenCanvas = document.getElementById('hidden-canvas');
    cloneCanvas(canvas,hiddenCanvas);

    // convert all transparent pixels of the hidden canvas to white pixels
    colorTransparentCanvasPixels(hiddenCanvas,"#ffffff");
    
    var a = document.createElement('a');
    a.href = hiddenCanvas.toDataURL("image/jpeg");
    a.download = "drawnEquation.jpg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
