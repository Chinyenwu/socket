
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname ));
var roomno = 0;
function onConnection(socket){
  roomno=roomno+1;
  socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
    socket.on('pressed', function(key){
        if(key === 38){
            socket.emit('PlayersMoving', key);
            socket.broadcast.emit('PlayersMoving', key);
        } 
    });
	console.log(roomno);
}
io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));
