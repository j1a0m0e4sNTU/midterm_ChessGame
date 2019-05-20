import React, {Component} from "react";

class Block extends Component {
    render() {
        let length = this.props.length;
        let style = {
            position: 'absolute',
            left: this.props.pos[0] * length + 'px',
            top: this.props.pos[1] * length + 'px',
            width: length + 'px',
            height: length + 'px',
            backgroundColor: this.props.color
        }

        return (
            <div id= {this.props.id} style= {style} onClick= {this.props.onClick}></div>
        )
    }
}

export default Block;