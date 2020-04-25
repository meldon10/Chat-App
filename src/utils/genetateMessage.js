const generateMessage = (username,text)=>{
   
   return {
    'username' : username,
    'Message' : text,
    'createdAt': new Date().getTime()
   }
    
}

const generateLocaation = (username,url)=>{
    return {
        'username' : username,
        'url' : url,
        'createdAt': new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocaation
}
