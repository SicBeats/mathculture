/*
File Name: blocklist.js

Author: Kaiser Slocum
Organization: Map Culture (University of Oregon, CIS422, FALL 2021)
Team: Map Culture (Team 5)

Last Modified: 11/18/2021
*/

/***********************************************************************************************
FUNCTION: loadfile
PURPOSE: This function takes the uploaded text file and calls displayUploadedEquations()
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
/***********************************************************************************************
FUNCTION: displayUploadedEquations
PURPOSE: This function organizes all the uploaded equations into an array of equations to be sent to the db
************************************************************************************************/
function displayUploadedEquations()
{    
    var charArr = new Array();
    var equatArr = new Array();

    // We need to check for invalid equations!
    var node = document.getElementById('uploaded_equations');
    //var box = document.getElementById('equation_input');
    let arr = node.innerText;
    charArr = arr.split("");
    node.innerText = "";
    let equat_num = 1;    
    
    // Remove \n if at beginning!
    for (let i = 0; i < charArr.length; i++)
    {
        if (((charArr[i] == '\n') && ((charArr[i+1] == '\n') || (charArr[i-1] == '\n'))) ||
        ((charArr[i] != ' ') && (charArr[i] != '\n') && (is_valid_char(charArr[i]) == false)))
        {
            charArr.splice(i,1);
            i--
        }   
    }

    var ic = 0;
    equatArr[ic] = "";
    for (let i = 0; i < charArr.length; i++)
    {
        if (charArr[i] ==  '\n')
        {
            ic++;
            equatArr[ic] = "";
        } 
        else
        {
            equatArr[ic] += charArr[i];
        } 
    }

    for (var i = 0; i < equatArr.length; i++)
    {
        node.innerText += "\nEquation " + equat_num++ + ": " + equatArr[i];
    }
}
/***********************************************************************************************
FUNCTION: is_valid_char
PURPOSE: Checks if the argument is one of the recognized characters
************************************************************************************************/
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
/***********************************************************************************************
FUNCTION: publish
PURPOSE: Moves the inputted equation to the db
************************************************************************************************/
function publish()
{
    // Check to see all the characters are valid
    var equat = document.getElementById("equation_input").value;
    console.log(equat);
    //publish to blacklist
}
/***********************************************************************************************
FUNCTION: unpublish
PURPOSE: Removes the inputted equation to the db
************************************************************************************************/
function unpublish()
{
    // Check to see all the characters are valid
    var equat = document.getElementById("equation_input").value;
    console.log(equat);
    //unpublish from blacklist
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

