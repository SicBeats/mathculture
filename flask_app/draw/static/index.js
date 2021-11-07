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
