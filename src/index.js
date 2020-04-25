const express = require('express')
const sokectio = require('socket.io')
const path=require('path')
const userFunctions = require('./utils/users')
const Port = process.env.PORT || 3000

const app = express()
const http = require('http')
const Server = http.createServer(app)
const io = sokectio(Server)

const publicPath = path.join(__dirname,'../public')

const utils = require('./utils/genetateMessage')

app.use(express.json())
app.use(express.static(publicPath))


io.on('connection',(socket)=>{

    socket.on('join',(data,callback)=>{
        //socket.emit ,io.emit ,socket.broadcast.emit
        //io.to.emit - <- all of them receives but to specific chat room
        //socket.broadcast.to.emit - <-all of them receives except the user and only to specific chatroom

        const {error , user} = userFunctions.addUser({id:socket.id,username:data.Username,room:data.room})
        
        if(error){
           return callback(error)
        }

        
        socket.join(user.room)
        socket.emit('message',utils.generateMessage('Admin','Welcome'))
        socket.broadcast.to(user.room).emit('message',utils.generateMessage('Admin',`${user.username} has joined!!`))
        io.to(user.room).emit('roomData',{
            'room' : user.room,
            'users': userFunctions.getUsersRoom(user.room)
        })
        callback()
        
    })
    
    socket.on('sendMessage',(msg,callback)=>{
        const user = userFunctions.getUser(socket.id)
        if(user){
            io.to(user.room).emit('message',utils.generateMessage(user.username,msg))
            callback()
        }
        
    })

    socket.on('sendLocation',(lat,long,callback)=>{
        const user = userFunctions.getUser(socket.id)
        if(user){
            io.to(user.room).emit('locationMessage',utils.generateLocaation(user.username,`https://google.com/maps?q=${lat},${long}`))
            callback()
        }
    })

    socket.on('disconnect',()=>{
        const user = userFunctions.removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message',utils.generateMessage('Admin',`${user.username} has left!`))
            io.to(user.room).emit('roomData',{
                'room' : user.room,
                'users': userFunctions.getUsersRoom(user.room)
            })
        }
       
    })
})

app.get('/',(req,res)=>{
    res.render('index')
})

Server.listen(Port,()=>{
    console.log('Srever is up and running on port '+Port)
})