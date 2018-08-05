
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname ));
var roomno = 0;
function onConnection(socket){
  roomno=roomno+1;
  socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));//收到訊息後把畫畫的資料廣播到client端
    socket.on('pressed', function(key){
            socket.broadcast.emit('PlayersMoving', key);//收到訊息後把清除的資料廣播到client端
    });
	console.log(roomno);
	/*
    socket.on('presseded', function(key1){
        if(key === 40){
			var players = key1;
			console.log(players );
            socket.emit('PlayersMovinging', key1);
			console.log('No');
            socket.broadcast.emit('PlayersMovinging', key1);
			console.log('Yes');
        } 
    });	
	*/
}
io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));
