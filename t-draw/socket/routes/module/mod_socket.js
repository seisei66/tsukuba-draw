var http = require('http');
//サーバインスタンス作成
var server = http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.end('server connected');
});
var io = require('socket.io').listen(server);
var port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(connected.);
  });

  //接続確立時の処理
  io.sockets.on('connection', function (socket) {
    // この中でデータのやり取りを行う
    // 「message」という名前で受信したデータはこの中を通る
    socket.on('message', function(msgData){
      // そのまま全接続先へ送信
      io.emit('receiveMessage', msgData);
    });
    socket.on('draw', function(drawData){
      io.emit('draw', drawData);
    });
  });
