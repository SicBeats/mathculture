function test()
{
    document.getElementById("displayResult").innerText = " Answer: runuts";
  
    const response = await fetch("https://api.wolframalpha.com/v2/query?appid=TJEJTU-Q6X8E5T86E&input=6^2&includepodid=Result&format=plaintext&output=xml");
    
    var data = await response.xml();

}
    