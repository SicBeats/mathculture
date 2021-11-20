/*
File Name: blacklist.js

Author: Kaiser Slocum
Organization: Map Culture (University of Oregon, CIS422, FALL 2021)
Team: Map Culture (Team 5)

Last Modified: 11/18/2021
*/
var arrGlob = new Array();
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
    let arr = node.innerText;
    node.innerText = "";
    let equat_num = 1;
    var bl = false;

    for (let i = 0; i < arr.length; i++)
    {
        if ((arr[i] == '\n') && (arr[i+1] != '\n'))
        {
            bl = false;
        }  
        else if ((arr[i] != ' ') && (arr[i] != '\n') && (is_valid_char(arr[i]) == true))
        {
            if (bl == false)
            {
                node.innerText = node.innerText + "\nEquation " + equat_num++ + ": ";
                bl = true;
            }
            node.innerText = node.innerText + arr[i];
        }  
    }
    arrGlob = arr.split("");
}
function is_valid_char(char)
{
    const arr = ["0","1","2","3","4","5","6","7","8","9","x","y","z","+","-","*","/","=","(",")"];
    for (var i = 0; i < arr.length; i++)
    {
        if (char == arr[i])
            return true;
    }
    return false;
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
function publishAll()
{
    for (let i = 0; i < arrGlob.length; i++)
    {
        if ((arrGlob[i] != ' ') && (arrGlob[i] != '\n') && (is_valid_char(arrGlob[i]) == false))
        {
            arrGlob.splice(i,1);
            i--
        }   
    }
    console.log(arrGlob);
    //console.log(arrGlob);
}
function unpublishAll()
{
    console.log(arrGlob);
}
function init()
{
    // Get all disabled questions from database and display in "list" element
}

