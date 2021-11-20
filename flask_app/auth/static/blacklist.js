/*
File Name: blacklist.js

Author: Kaiser Slocum
Organization: Map Culture (University of Oregon, CIS422, FALL 2021)
Team: Map Culture (Team 5)

Last Modified: 11/18/2021
*/
var arrGlob = new Array();
var newArr = new Array();
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
    //var box = document.getElementById('equation_input');
    let arr = node.innerText;
    arrGlob = arr.split("");
    node.innerText = "";
    let equat_num = 1;    
    
    // Remove \n if at beginning!
    for (let i = 0; i < arrGlob.length; i++)
    {
        if (((arrGlob[i] == '\n') && ((arrGlob[i+1] == '\n') || (arrGlob[i-1] == '\n'))) ||
        ((arrGlob[i] != ' ') && (arrGlob[i] != '\n') && (is_valid_char(arrGlob[i]) == false)))
        {
            arrGlob.splice(i,1);
            i--
        }   
    }

    var ic = 0;
    newArr[ic] = "";
    for (let i = 0; i < arrGlob.length; i++)
    {
        if (arrGlob[i] ==  '\n')
        {
            ic++;
            newArr[ic] = "";
        } 
        else
        {
            newArr[ic] += arrGlob[i];
        } 
    }

    for (var i = 0; i < newArr.length; i++)
    {
        node.innerText += "\nEquation " + equat_num++ + ": " + newArr[i];
    }
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
    //Go through newArr and publish them all
}
function unpublishAll()
{
    //Go through newArr and unpublish them all
}
function init()
{
    // Get all disabled questions from database and display in "list" element
}

