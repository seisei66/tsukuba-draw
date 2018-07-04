var socketio = require('socket.io');

function io(server) {
    var io = socketio.listen(server);

    io.on('connection', socket => {
      socket.on('chat message', msg => {
        io.emit('chat message', msg);
      });
    });
}

module.exports = io;
