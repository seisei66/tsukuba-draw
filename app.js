var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//var io = require('./routes/io.js');

var http = require('http');
var debug = require('debug')('tkb-draw:server');
var app = express();

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

let io = require('socket.io').listen(server);
let people = [];
let layerlst = new Array(10);

//ユーザー入室時
io.sockets.on('connect', socket => {
  socket.on('username', username => {
    io.to(socket.id).emit('socketid notice', socket.id);
    people[socket.id] = username;
    let userlist = [];
    let i;
    for(key in people){
      userlist.push(people[key]);
      console.log(people);
      console.log(userlist);
    }
    for(i=0; i<10; i++){
      if(!layerlst[i]) {
        layerlst[i] = socket.id;
        break;
      }
    }
    io.to(socket.id).emit('layer notice', i)
    io.emit('layer changed', layerlst);
    console.log(layerlst);
    io.emit('username', username);
    io.emit('userlist', userlist);//empty考える
  });

  // チャット内容にユーザ名を追加し全接続先へ送信
  socket.on('chat message', message => {
    console.log(people[socket.id] + ' : ' + message);
    io.emit('chat message', people[socket.id] + ' : ' + message);
  });

  //ユーザー退室時
  socket.on('disconnect', function(){
    console.log(socket.id) ;
    io.emit('exit user', people[socket.id]);
    delete people[socket.id];
    layerlst[layerlst.indexOf(socket.id)] = void 0;
    io.emit('layer changed', layerlst);
  });


//  socket.on('pixel data', pixel_data => {
//    io.emit('pixel data', JSON.stringify({layer:layerlst.indexOf(socket.id), data:pixel_data}));
//  });

  //描画レイヤー変更時
  socket.on('layer changed', layernum => {
    layerlst[layerlst.indexOf(socket.id)] = void 0;
    layerlst[layernum] = socket.id;
    io.emit('layer changed', layerlst);
    console.log(layerlst);
  });

  //描画データ受信　
  socket.on('pixel data', pixeldata => {
    console.log(pixeldata);
    let pixelset = JSON.stringify({pixel_data:pixeldata, num:layerlst.indexOf(socket.id)+1})//layerとjsonにする
    socket.broadcast.emit('pixel data', pixelset);
  })
});
/*
function io(server) {
    var io = socketio.listen(server);

    io.on('connection', socket => {
      socket.on('chat message', msg => {
        io.emit('chat message', msg);
      });
    });
}

io(server);
*/
//module.exports = app;
