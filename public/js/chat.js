const $Form = document.querySelector('#submit')
const $locationButton = document.querySelector('#userLocation')
const $messages = document.querySelector('#message-form')

//messageTemplates
const $messageTemplate = document.querySelector('#message-template').innerHTML
const $locationTemplate = document.querySelector('#location-template').innerHTML
const $sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

const socket = io()

var data=Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoScroll = ()=>{
        // Get New Message
        const $newMessage = $messages.lastElementChild

        //Height of message
        const newMessageStyles = getComputedStyle($newMessage)
        const $newMessageMargin = parseInt(newMessageStyles.marginBottom)
        
        const newMessageHeight = $newMessage.offsetHeight + $newMessageMargin
        
        //visible Height
        const visibleHeight = $messages.offsetHeight
        
        //Height of message container
        const containerHeight = $messages.scrollHeight
       
        //how far have i scrolled ?
        const scrollOffset = $messages.scrollTop + visibleHeight
        
        if(containerHeight - newMessageHeight <= scrollOffset){

            $messages.scrollTop = $messages.scrollHeight
        }
}

socket.on('message',(msg)=>{
    var html = Mustache.render($messageTemplate,{
        username : msg.username,
        message : msg.Message,
        createdAt : moment(msg.createdAt).format('Mo MMMM YYYY') 
    }) 
    $messages.insertAdjacentHTML('beforeend',html)
    autoScroll()

})  

socket.on('locationMessage',(locationMsg)=>{
    var html = Mustache.render($locationTemplate,{
        username : locationMsg.username,
        location : locationMsg.url,
        createdAt : moment(locationMsg.createdAt).format('Mo MMMM YYYY') 
    }) 
    $messages.insertAdjacentHTML('beforeend',html)
    
    autoScroll()

})  

socket.on('roomData',({room , users})=>{
    var html = Mustache.render($sidebarTemplate,{
        room,
        users
    })
    
    document.querySelector('#sidebar').innerHTML = html
})


$Form.addEventListener('click',(event)=>{
    event.preventDefault()
    $Form.setAttribute('disabled','disabled')
    var value = document.querySelector('#input').value
    //console.log(value)
    document.querySelector('#input').value = ''

    socket.emit('sendMessage',value,()=>{
        $Form.removeAttribute('disabled')
        console.log('Message was delivered')
    })
})

$locationButton.addEventListener('click',(event)=>{
    event.preventDefault()
    if(!navigator.geolocation){
        return alert('Your Browser Does Not Support Geolocation')
    }

    $locationButton.setAttribute('disabled','disabled')
   
    navigator.geolocation.getCurrentPosition((location)=>{
        const lat = location.coords.latitude
        const long= location.coords.longitude
        
        socket.emit('sendLocation',lat,long,()=>{
            $locationButton.removeAttribute('disabled')
            
        })
    })
})

socket.emit('join',data,(error)=>{
    if(error){
        alert(error)
        window.location.href = '/'
    }
})