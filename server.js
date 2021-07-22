const express = require('express');
const http = require('http');
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);


app.use(express.static(__dirname + "/"));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
io.on("connection", function(socket) {
    console.log("A new user connected");
    // emit welcome message to single user when connected
    socket.emit("botMessage", "Welcome to Chatbud! You are now connected to the group chat :D");
    // emit to everyone except the client thats connected
    socket.broadcast.emit("botMessage", "A new user connected. Say Hi!");
    // emitting to all the clients
    // io.emit("welcomeMessage", "nise")
    // catching a received message from client
    socket.on("sentMessage", function(message){
        console.log("Message: " + message);
        // sending message to other clients as their received message
        socket.broadcast.emit("receivedMessage", message);
    })
    // catching the nickname from client
    socket.on("nick", function(message){
        console.log("From: " + message);
        // sending nick to other clients
        socket.broadcast.emit("nick", message);
    })
    socket.on("disconnect", function(){
        console.log("A user disconnected");
        socket.broadcast.emit("botMessage", "A user disconnected from the chat");
    })
})
server.listen(process.env.PORT || 3000, () => {
    console.log('listening to port...');
});