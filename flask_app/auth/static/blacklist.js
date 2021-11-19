/*
File Name: blacklist.js

Author: Kaiser Slocum
Organization: Map Culture (University of Oregon, CIS422, FALL 2021)
Team: Map Culture (Team 5)

Last Modified: 11/18/2021
*/

/***********************************************************************************************
FUNCTION: loadfile
PURPOSE: This function takes the uploaded file image and displays it in the canvas image element
SOURCE: https://stackoverflow.com/questions/14446447/how-to-read-a-local-text-file
************************************************************************************************/
function loadfile(event) 
{
    var node = document.getElementById('uploaded_equations');
    node.innerText = "";

    var input = event.target;
    var reader = new FileReader();   
    
    reader.onload = function()
    {
        var text = reader.result;
        for (let i = 0; i < text.length; i++) 
        {
            node.innerText = node.innerText + text[i];                                     
        }     
        displayUploadedEquations();
    }
    reader.readAsText(input.files[0]);   
}
function displayUploadedEquations()
{
    // We need to check for invalid equations!
    var node = document.getElementById('uploaded_equations');
    var box = document.getElementById('equation_input');
    let me = node.innerText;
    console.log(me);
    node.innerText = "Equation 1:";
    let counter = 2;
    for (let i = 0; i < me.length; i++)
    {
        if ((me[i] == '\n') && (me[i+1] != '\n'))
        {
            node.innerText = node.innerText + me[i] + "Equation " + counter++ + ": ";
        }  
        else if ((me[i] != ' ') && (me[i] != '\n'))
        {
            node.innerText = node.innerText + me[i];
        }   
    }
}
function publish()
{
    var equat = document.getElementById("equation_input").value;
    console.log(equat);
    //add to blacklist
}
function unpublish()
{
    var equat = document.getElementById("equation_input").value;
    console.log(equat);
    //remove from blacklist
}
function init()
{
    // Get all disabled questions from database and display in "list" element
}

