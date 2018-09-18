const express = require('express');

const app = express();
// add socket
const http = require('http').Server(app);
const io = require('socket.io')(http);
//
const port = 3232;

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

io.on('connection', function (socket){
	var curRoomName  = "大廳";
    socket.on('certain', function(roomName){
		curRoomName = roomName;
    });	
	socket.join(curRoomName);
	socket.on('drawing',function(data,list) {
		io.in(curRoomName).emit('drawing', data);
		console.log(io.sockets.adapter.rooms[curRoomName]);
		//console.log(list);
		console.log(curRoomName);
	});
    socket.on('pressed', function(key){
		io.in(curRoomName).emit('PlayersMoving', key);//收到訊息後把清除的資料廣播到client端
    });
	socket.on('roomlist', function(key){
		io.emit('Roomlist', roomidlist);//收到訊息後把清除的資料廣播到client端
    });
	socket.on('roomstate', function(state,roomName,username){
        //socket.emit('Room', state,roomName,username);//收到訊息後把清除的資料廣播到client端
		statelist.push(state);
		userlist.push(username);
		socket.leave(curRoomName);
		for(i=0;i<=max;i++){
			if(roomidlist[i]==roomName){
				break;
				}
			else if(i==max-1){
				roomidlist.push(roomName);
				max=max+1;
				break;
			}
		}
		socket.join(roomName);
		io.in(roomName).emit('Room2', state,roomName,username);
		curRoomName = roomName;
		console.log(io.sockets.adapter.rooms[curRoomName]);
		console.log(max-1);
		console.log(roomidlist);
		/*
		for(i=0;i<max-1;i++){
			console.log(io.sockets.adapter.rooms[roomidlist[i]]);
		}
		console.log(io.sockets.adapter.rooms["大廳"]);
		
		//console.log(statelist);
		console.log("curent is "+curRoomName);
		*/
    });
	console.log("curent is "+curRoomName);
});



http.listen(port, () => {
  console.info('listen on %d', port);
});