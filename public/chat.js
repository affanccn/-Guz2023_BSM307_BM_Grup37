const socket = io.connect('/')
const sender = document.getElementById('sender')           
const message = document.getElementById('message')
const submitBtn = document.getElementById('submitBtn')
const output = document.getElementById('output')
const feedback = document.getElementById('feedback')

submitBtn.addEventListener('click', () => {           
   
    socket.emit('chat', {                             
        message: message.value,                      
        sender: sender.value
    })
})
function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

function getRandomColorIndex(str, arrayLength) {
    const hash = hashCode(str);
    return Math.abs(hash % arrayLength);
}


const colorsArray = ["#FF5733", "#33FF57", "#5733FF", "#FF33AE", "#33AEFF"];





socket.on('chat', data => {
    const randomColorIndex = getRandomColorIndex(data.sender, colorsArray.length);
    const selectedColor = colorsArray[randomColorIndex];
    feedback.innerHTML = '';                          
    output.innerHTML += '<p><strong style="color:' + selectedColor + '">' + data.sender + ' : </strong>' + data.message + '</p>'
    message.value = '';
})
message.addEventListener('keypress', () => {        
    socket.emit('typing', sender.value)             
})

socket.on('typing', data => {                              
    feedback.innerHTML = '<p>' + data + ' yazıyor... </p>'
})
