const express = require('express');

const app = express();
// add socket
const http = require('http').Server(app);
const io = require('socket.io')(http);
//
const port = 3000;

// Set public folder as root
app.use(express.static('public'));

// Provide access to node_modules folder from the client-side
app.use('/scripts', express.static(`${__dirname}/node_modules/`));

//
// Redirect all traffic to index.html
app.use((req, res) => res.sendFile(`${__dirname}/public/index.html`));

// add socket

var roomidlist =[];
var roomidlistrue =[];
var statelist =[];
var userlist =[];
var max=1;
var roomno = 1;
var i;
function onConnection(socket){
	//if(io.nsps['/'].adapter.rooms["room-"+roomno] && io.nsps['/'].adapter.rooms["room-"+roomno].length > 1) roomno++;
	//socket.join("room-"+roomno);
	var room ;
	socket.on('roomstate', function(state,roomName,username){

        socket.emit('Room', state,roomName,username);//收到訊息後把清除的資料廣播到client端
		room = roomName;
		//roomidlist.push(roomName);
		statelist.push(state);
		userlist.push(username);
		//socket.emit('Room2', state,roomName,username);
		//console.log(username+' '+state+' room '+roomName);
		//io.sockets.in("room-"+roomno).emit('Room2', state,roomName,username);
		console.log(roomidlist);
		console.log(statelist);
		console.log(userlist);
		for(i=0;i<=max;i++){
			if(roomidlist[i]==roomName){
				socket.join(roomidlist[i]);
				console.log(io.sockets.adapter.rooms[roomidlist[i]]);
				io.sockets.in(roomName).emit('Room2', state,roomName,username);
				break;
				}
			else if(i==max-1){
				roomidlist.push(roomName);
				socket.join(roomName);
				//socket.broadcast.in(roomidlist[i]).emit('Room2', state,roomName,username);
				//console.log(userlist[i]+" is in "+roomidlist[i]);
				console.log(io.sockets.adapter.rooms[roomidlist[i]]);
				io.sockets.in(roomName).emit('Room2', state,roomName,username);
				max=max+1;
				break;
			}
		}
		for(i=0;i<max-1;i++){
			console.log(roomidlist[i]);
		}
		console.log(max-1);
    });

	socket.on('drawing',function(data) {
			io.sockets.in(room).emit('drawing', data);
			console.log(room);
	});
    socket.on('pressed', function(key){
		io.sockets.in(room).emit('PlayersMoving', key);//收到訊息後把清除的資料廣播到client端
    });
}

io.on('connection', onConnection);

http.listen(port, () => {
  console.info('listen on %d', port);
});