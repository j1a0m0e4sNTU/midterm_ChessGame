const express = require('express')
const mongoose = require('mongoose')

// Create server to serve index.html
const app = express()
const http = require('http').Server(app)
const port = process.env.PORT || 3001
const ChessBoard = require('./ChessBoard');

// Socket.io serverSocket
const serverSocket = require('socket.io')(http)

// Start server listening process.
http.listen(port, () => {
    console.log(`Server listening on port ${port}.`)
})

// Connect to mongo
mongoose.connect('mongodb+srv://j1a0m0e4s:%23Xup654cl4@cluster0-1ysgh.gcp.mongodb.net/test?retryWrites=true', {
    useNewUrlParser: true
})

db = mongoose.connection;
db.on('error', error => {
    console.log('Error in DB:');
    console.log(error)
})

db.once('open', () => {
    console.log('MongoDB is connected ^^');

    ChessBoard.find()
        .exec((err, res) => {
            if (res.length == 0) {
                let config = origin_chess_borad();
                config.name = 'ChessBoard';
                let chessBoard = new ChessBoard(config);
                chessBoard.save(err => {
                    if (err) console.log('Error occured when save chess board');
                    else console.log('Created chess board');
                })
            }
        })

    serverSocket.on('connection', socket => {
        setChessBoard(socket);
        
        socket.on('restart', () => {
            restartChessBoard();
        });

        socket.on('move', data => {
            const {piece, pos} = data;
            movePicece(piece, pos);
        });

        socket.on('kill', data => {
            const {piece_kill, piece_killed} = data;
            kill(piece_kill, piece_killed);
        })
    })  
})

const origin_chess_borad = () => {
    return {
        bp0:[0, 6], bp1:[1, 6], bp2:[2, 6], bp3:[3, 6], 
        bp4:[4, 6], bp5:[5, 6], bp6:[6, 6], bp7:[7, 6],
        bk:[4, 7] , bq:[3, 7],  bb0:[2, 7], bb1:[5, 7],
        bn0:[1, 7], bn1:[6, 7], br0:[0, 7], br1:[7, 7],

        wp0:[0, 1], wp1:[1, 1], wp2:[2, 1], wp3:[3, 1], 
        wp4:[4, 1], wp5:[5, 1], wp6:[6, 1], wp7:[7, 1],
        wk:[4, 0] , wq:[3, 0],  wb0:[2, 0], wb1:[5, 0],
        wn0:[1, 0], wn1:[6, 0], wr0:[0, 0], wr1:[7, 0],

        dead_pos_b: [0, 8], dead_pos_w:[0, -1]
    }
}

const setChessBoard = socket => {
    ChessBoard.find({name: 'ChessBoard'})
        .exec((err, res) => {
            if (err) console.log(err);
            else socket.emit('setChessBoard', res[0]);
        })
}

const setAllChessBoard = () => {
    ChessBoard.find({name: 'ChessBoard'})
        .exec((err, res) => {
            if(err) console.log('Error: set all chess board');
            else serverSocket.emit('setChessBoard', res[0]);
        })
}

const restartChessBoard = () => {
    ChessBoard.updateOne({name: 'ChessBoard'}, origin_chess_borad(), 
        function(err, res){
            if (err) console.log('Error: restart chess board');
            else {
                console.log('Restart Game !');
                setAllChessBoard();
            }
        })
}

const movePicece = (piece, pos) => {
    ChessBoard.findOne({name: 'ChessBoard'}, (err, board) => {
        if (err) console.log('Error: find board');
        else {
            board[piece] = pos;
            board.save(err => {
                if (err) console.log('Error: save board - ' + err);
                else {
                    console.log('Move ' + piece + ' to ' + pos);
                    serverSocket.emit('update', {piece: piece, pos: pos});
                }
            });
        }
    })
}

const kill = (piece_kill, piece_killed) => {
    const update_dead_pos = (dead_pos) =>{
        if (dead_pos[0] < 7){
            return [dead_pos[0] + 1, dead_pos[1]];
        } else if (dead_pos[1] == -1){
            return [0, -2];
        } else {
            return [0, 9];
        }
    }

    const color = piece_killed.slice(0, 1);
    const dead_pos_id = (color == 'w')? 'dead_pos_b' : 'dead_pos_w';
    ChessBoard.findOne({name: 'ChessBoard'}, (err, board) => {
        if (err) console.log('Error: find board');
        else {
            const new_pos  = board[piece_killed];
            const dead_pos = board[dead_pos_id];
            board[piece_kill] = new_pos;
            board[piece_killed] = dead_pos;
            board[dead_pos_id] = update_dead_pos(dead_pos);
            board.save(err => {
                if (err) console.log('Error: save board - ' + err);
                else {
                    console.log(piece_kill + ' Kill ' + piece_killed);
                    serverSocket.emit('update', {piece: piece_kill, pos: new_pos});
                    serverSocket.emit('update', {piece: piece_killed, pos: dead_pos});
                }
            })
        }
    })
}
