import React, {Component} from "react";
import bp from '../images/pawn-black.png';
import wp from '../images/pawn-white.png';
import bk from '../images/king-black.png';
import wk from '../images/king-white.png';
import bq from '../images/queen-black.png';
import wq from '../images/queen-white.png';
import bb from '../images/bishop-black.png';
import wb from '../images/bishop-white.png';
import bn from '../images/knight-black.png';
import wn from '../images/knight-white.png';
import br from '../images/rook-black.png';
import wr from '../images/rook-white.png';

let img_dict = {
    'bp': bp, 'wp': wp,
    'bk': bk, 'wk': wk,
    'bq': bq, 'wq': wq,
    'bb': bb, 'wb': wb,
    'bn': bn, 'wn': wn,
    'br': br, 'wr': wr
};

class Piece extends Component {
    
    render() {
        let img = img_dict[this.props.type]

        let img_style= {
            width: this.props.size + 'px',
            height: this.props.size + 'px',
            left: this.props.pos[0] * this.props.size + 'px',
            top: this.props.pos[1] * this.props.size + 'px',
        }

        return (
            <img className= 'Piece' id= {this.props.id} alt= {this.props.id}
                src= {img}  style= {img_style} onClick= {this.props.onClick} ></img>
        )
    } 
}

export default Piece;