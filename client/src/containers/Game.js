import React, { Component} from "react";
import './Game.css'
import Board from '../components/Board';
import Piece from './Piece';

const server = 'http://localhost:3001';
const socket = require('socket.io-client')(server);

class Game extends Component {
    constructor(props){
        super(props);
        this.state = {
            block_length: 80,
            piece_pos: {},
            focus_piece: null,
            focus_pos: [-1, -1],
        };
    }

    componentDidMount() {
        
        socket.on('setChessBoard', data => {
            let piece_pos_next = {
                bp0:data.bp0, bp1:data.bp1, bp2:data.bp2, bp3:data.bp3, 
                bp4:data.bp4, bp5:data.bp5, bp6:data.bp6, bp7:data.bp7,
                bk:data.bk,   bq:data.bq,   bb0:data.bb0, bb1:data.bb1,
                bn0:data.bn0, bn1:data.bn1, br0:data.br0, br1:data.br1,

                wp0:data.wp0, wp1:data.wp1, wp2:data.wp2, wp3:data.wp3, 
                wp4:data.wp4, wp5:data.wp5, wp6:data.wp6, wp7:data.wp7,
                wk:data.wk,   wq:data.wq,   wb0:data.wb0, wb1:data.wb1,
                wn0:data.wn0, wn1:data.wn1, wr0:data.wr0, wr1:data.wr1 
            }

            this.setState({
                piece_pos: piece_pos_next
            })
        })

        socket.on('update', data => {
            const {piece, pos} = data;
            let piece_pos_next = this.state.piece_pos;
            piece_pos_next[piece] = pos;
            this.setState({
                piece_pos: piece_pos_next
            })
        })
        
    }

    move_piece = (piece, pos) => {
        socket.emit('move', {piece: piece, pos: pos});
        
        this.setState({
            focus_piece: null,
            focus_pos: [-1, -1]
        }) 
    }

    kill = (piece_kill, piece_killed) => {
        socket.emit('kill', {piece_kill: piece_kill, piece_killed: piece_killed});
    }

    same_color = (piece_1, piece_2) => {
        const color_1 = piece_1.slice(0, 1);
        const color_2 = piece_2.slice(0, 1);
        if (color_1 === color_2)return true;
        else return false;
    }

    is_dead= (piece) => {
        const pos = this.state.piece_pos[piece];
        if ((pos[1] < 0) || (pos[1] > 7)) return true;
        else return false;
    }

    piece_on_click = (e) => {
        let click_piece = e.target.id;
        let click_pos = this.state.piece_pos[click_piece];
        let focus_piece = this.state.focus_piece;

        if (this.is_dead(click_piece)){

        } else if ((focus_piece !== null) && (this.same_color(focus_piece, click_piece) === false)) {
            this.kill(focus_piece, click_piece);
            this.setState({
                focus_piece: null,
                focus_pos: [-1, -1]
            })
        } else {
            this.setState({
                focus_piece: click_piece,
                focus_pos: click_pos
            })
        }
    }

    block_on_click = (e) => {
        let block_id = e.target.id;
        let pos = [(block_id - block_id %8) / 8, block_id % 8]

        if (this.state.focus_piece !== null) {
              this.move_piece(this.state.focus_piece, pos);
        } 
    }

    render() {
        let piece_ids = Object.keys(this.state.piece_pos);
        let all_pieces = piece_ids.map(id => <Piece type= {id.slice(0, 2)} id= {id} size= {this.state.block_length} 
                                                pos= {this.state.piece_pos[id]} onClick= {this.piece_on_click}/>)
        
        return (
            <div className= 'Game'>
                <button className= 'restartButton' onClick= {()=> socket.emit('restart')}>Restart Game</button>
                <div className= 'BoardContainer' >
                    <Board block_length= {this.state.block_length} focus_pos= {this.state.focus_pos} onClick= {this.block_on_click}/>
                    {all_pieces}
                </div>
            </div>
        );
    }
}

export default Game;