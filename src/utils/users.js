users=[]

const addUser = ({id,username,room})=>{

    //clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data
    if(!username || !room){
        return {
            error : 'Username and Room are required!'
        }
    }

    //check for existing user
    const existing = users.find((user)=>{
            return user.username === username && user.room === room
    })

    if(existing){
        return {
            error : 'Username already in use!'
        }
    }

    const user = {id,username,room}
    users.push(user)
    return {user} 

}

const removeUser = (id)=>{
       const index = users.findIndex((user) => user.id === id)

       if(index!==-1){
           return users.splice(index,1)[0]
       }
}

const getUser = (id)=>{
    const index = users.findIndex((user)=> user.id === id)
    if (index!== -1){
        return users[index]
    }else{
        return undefined
    }

}

const getUsersRoom = (room)=>{
        const roomUsers = users.filter((user)=>{
            return user.room === room
        })
        return roomUsers
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersRoom
}