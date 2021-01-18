const asyncLocalStorage = require('./als.service');
const logger = require('./logger.service');

var gIo = null
var gSocketBySessionIdMap = {}

function emit({ type, data }) {
    gIo.emit(type, data);
}


function connectSockets(http, session) {
    gIo = require('socket.io')(http, {
        cors: {
            origin: '*'
        }
    })

    const sharedSession = require('express-socket.io-session');

    gIo.use(sharedSession(session, {
        autoSave: true
    }))

    gIo.on('connection', socket => {
        // console.log('socket.handshake', socket.handshake)
        gSocketBySessionIdMap[socket.handshake.sessionID] = socket
        socket.on('disconnect', socket => {
            console.log('Someone disconnected')
            if (socket.handshake) {
                gSocketBySessionIdMap[socket.handshake.sessionID] = null
            }
        })
        socket.on('join board', boardId => {
                if (socket.currBoard) {
                    socket.leave(socket.currBoard)
                }
                socket.join(boardId)
                    // logger.debug('Session ID is', socket.handshake.sessionID)
                socket.currBoard = boardId
            })
            // socket.on('chat newMsg', msg => {
            //     // emits to all sockets:
            //     // gIo.emit('chat addMsg', msg)
            //     // emits only to sockets in the same room
            //     gIo.to(socket.myTopic).emit('chat addMsg', msg)
            // })

    })
}

// Send to all sockets BUT not the current socket 
function broadcast({ type, data }, subscribersOnly = false) {
    const store = asyncLocalStorage.getStore()
    const { sessionId } = store
    if (!sessionId) return logger.debug('Shoudnt happen, no sessionId in asyncLocalStorage store')
    const excludedSocket = gSocketBySessionIdMap[sessionId]
    if (!excludedSocket) return logger.debug('Shouldnt happen, No socket in map', gSocketBySessionIdMap)

    if (subscribersOnly) excludedSocket.broadcast.to(excludedSocket.currBoard).emit(type, data)
    else excludedSocket.broadcast.emit(type, data)
}

module.exports = {
    connectSockets,
    emit,
    broadcast
}