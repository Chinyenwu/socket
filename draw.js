var socket = io();//建立socket
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
//上傳圖片的程式
var ls = window.localStorage,
	photo = document.getElementById('uploadImage'),
	fileReader = new FileReader(),
	img = new Image(), lastImgData = ls.getItem('image');
	fileReader.onload = function (e) {
	console.log(typeof e.target.result, e.target.result instanceof Blob);
	img.src = e.target.result;
	};
	img.onload = function() {
    var rw = img.width / c.width; 
    var rh = img.height / c.height;
    
    if (rw > rh)
    {
        newh = Math.round(img.height / rw);
        neww = c.width;
    }
    else
    {
        neww = Math.round(img.width / rh);
        newh = c.height;
    }  
    var x = (c.width - neww) / 2;
    var y = (c.height - newh) / 2;  
    drawImage(img, x, y, neww, newh);
	};

	photo.addEventListener('change', function() {
    var file = this.files[0];  
    return file && fileReader.readAsDataURL(file); 
	});	
//小畫家的設計及控制
ctx.beginPath();
ctx.lineWidth = "2";
ctx.strokeStyle = "black";
ctx.rect(10,10,40,320);  
ctx.stroke();
for(i=0;i<8;i=i+1)
{
	ctx.beginPath();
	ctx.lineWidth = "1";
	ctx.strokeStyle = "black";
	ctx.rect(50,10,40,(i+1)*40);  
	ctx.stroke();
}
var color=["red","orange","yellow","#00ff00","#3366ff","#ff00ff","black","white"]
var square = new Array;
var circle = new Array;
var drawmode = false;
var x = 10, y = 10;
var cx = 70, cy = 30,size = 12;
var current = {};
for(i=0;i<8;i=i+1)
{
	square[i] = new component(40, 40, color[i], 10, x);
	x=x+40;
}
x=25;
size = 7;
for(i=0;i<4;i=i+1)
{
	circle[i] = new drawcircle(cx, cy, size ,"black");
	cy = cy+40;
	size = size - 2;
}
drawword();
document.addEventListener("click", getcolor, false);//選顏色
document.addEventListener("click", getsize, false);//選大小
document.addEventListener("mousedown", mouseDown);//畫畫結束
document.addEventListener("mousemove", throttle(drawsqare, 10), false);//正在畫
document.addEventListener("mouseup", mouseUp);//畫畫開始
document.addEventListener("click", clear, false);//全清
document.addEventListener("click", reload, false);//留圖片
socket.on('drawing', senddata);//把畫畫用的資料傳進用drawing把senddata包再一起

  window.addEventListener('resize', onResize, false);
  onResize();
function component(width, height, color, x, y) //畫矩形
{
    var width2 = width;
    var height2 = height;
    var x2 = x;
    var y2 = y;    
    ctx.fillStyle = color;
    ctx.fillRect(x2, y2, width2, height2);
}
function drawcircle(x, y, radius , color) {//畫圓形
	ctx.beginPath();
    var x2 = x;
    var y2 = y;    
	var radius2 = radius;  
	ctx.fillStyle = color;
    ctx.arc(x2, y2 , radius2, 0 , 2*Math.PI);
    ctx.fill();
	ctx.closePath();
}
function drawword() {//文字
    ctx.font = "12px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("eraser", 11, 310);
	ctx.fillText("clear", 55, 310);
	ctx.fillText("reload", 55, 270);
}
function reload(e) {
    var xPosition = event.pageX;
    var yPosition = event.pageY;
	if(xPosition > 60 && xPosition < 100 && yPosition > 260 && yPosition < 300)
	{
		var rw = img.width / c.width; 
		var rh = img.height / c.height;
		if (rw > rh)
		{
			newh = Math.round(img.height / rw);
			neww = c.width;
		}
		else
		{
			neww = Math.round(img.width / rh);
			newh = c.height;
		}  
		var x = (c.width - neww) / 2;
		var y = (c.height - newh) / 2;  
		drawImage(img, x, y, neww, newh);
	}
}
function getcolor(e) {
	var color=["red","red","orange","yellow","#00ff00","#3366ff","#ff00ff","black","white"];
    var xPosition = event.pageX;
    var yPosition = event.pageY;
	if(xPosition > 20 && xPosition < 60 && yPosition > 20 && yPosition < 340)
	{
		for(i=1;i<9;i++)
		{
			if(xPosition > 20 && xPosition < 60 && yPosition > (i-1)*40+20 && yPosition < (i)*40+20)
			{
				color1 = color[i];
			}
		}
	}
	return color1;
}
function getsize(e) {
	var size=[9,7,5,3,1];
    var xPosition = event.pageX;
    var yPosition = event.pageY;
	var color1 = getcolor(e)
	if(xPosition > 60 && xPosition < 100 && yPosition > 20 && yPosition < 180)
	{
		for(i=1;i<5;i++)
		{
			if(xPosition > 60 && xPosition < 100 && yPosition > (i-1)*40+20 && yPosition < (i)*40+20)
			{
				size1 = size[i];
			}
		}
		if(	color1="white")
		{
			for(i=1;i<5;i++)
			{
				if(xPosition > 60 && xPosition < 100 && yPosition > (i-1)*40+20 && yPosition < (i)*40+20)
				{
					size1 = 2*size[i];
				}
			}
		}
	}
	return size1;
}
function mouseDown(e) {
	current.x = event.pageX;
    current.y = event.pageY;
	drawmode = true;
}
function mouseUp(e) {
	var color1 = getcolor(e);
	var size = getsize(e);
    drawLine(current.x, current.y, event.pageX, event.pageY, color1, size, true);
	ctx.closePath();
	drawmode = false;
}
function drawsqare(e) {
	if(event.pageX > 100 && drawmode== true)
	{
    drawLine(current.x, current.y, event.pageX, event.pageY, color1, size, true);
	current.x = event.pageX;
    current.y = event.pageY;
	}
}
function clear(e) {
    var xPosition = event.pageX;
    var yPosition = event.pageY;
	if(xPosition > 60 && xPosition < 100 && yPosition > 300 && yPosition < 340)
	{
		ctx.clearRect(110, 0, c.width, c.height);
		socket.emit('pressed', 38);//向server端的pressed送出一個開始清除的動作
	}
		socket.on('PlayersMoving', function(key){//所有畫面一起清除
		ctx.clearRect(110, 0, c.width, c.height);	
		});
}

 function senddata(data){
	drawLine(data.x0 , data.y0 , data.x1 , data.y1 , data.color ,data.size);
 }
  function drawLine(x0, y0, x1, y1, color, size,emit){
    ctx.beginPath();
    ctx.moveTo(x0-size, y0-size);
    ctx.lineTo(x1-size, y1-size);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.stroke();
	if (!emit) { return; }
    socket.emit('drawing', {//把畫畫用的資料傳進server端的drawing裡
      x0: x0 ,
      y0: y0 ,
      x1: x1 ,
      y1: y1 ,
      color: color,
	  size:size
    });
  }
function drawImage(img, x, y, neww, newh) {//圖片顯示
   var dataUrl;  
   var width = c.width;  
   ctx.drawImage(img, x, y, neww, newh);   
   dataUrl = canvas.toDataURL();
   document.getElementById('imageData').href = dataUrl;
   ls.setItem('image', img.src);
}
  function throttle(callback, delay) {
    var previousCall = new Date().getTime();
    return function() {
      var time = new Date().getTime();

      if ((time - previousCall) >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  }
  function onResize() {
    canvas.width = 1200;
    canvas.height = 600;
  }
