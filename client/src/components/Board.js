import React, {Component} from "react";
import Block from './Block';

class Board extends Component {

    render() {
        let size = 8;
        let length = this.props.block_length
        let [color_1, color_2] = ['khaki', 'darkgoldenrod'];
        let focus_pos = this.props.focus_pos;
        let focus_id;
        if ((focus_pos[0] < 0) || (focus_pos[1] < 0) || (focus_pos[0] > 7) || (focus_pos[1] > 7)){
            focus_id = -1;
        } else {
            focus_id = focus_pos[0] * size + focus_pos[1];
        }
        let blocks = [] 
        for(let x= 0; x < size; x++){
            [color_1, color_2] = [color_2, color_1];
            for(let y= 0; y < size; y++){
                let id= x * size + y;
                let color = (id === focus_id)? 'yellow': (y%2 === 0)? color_1:color_2;
                blocks.push(<Block id= {id} length= {length} color= {color} 
                            pos= {[x ,y]} onClick= {this.props.onClick}/>)
            }
        }

        return (
            <div className= 'Board'>
                {blocks}
            </div>
        )
    }
}

export default Board;