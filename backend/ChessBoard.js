const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BoardData = new Schema({
    name: String,
    
    bp0:[Number], bp1:[Number], bp2:[Number], bp3:[Number], 
    bp4:[Number], bp5:[Number], bp6:[Number], bp7:[Number],
    bk:[Number] , bq:[Number],  bb0:[Number], bb1:[Number],
    bn0:[Number], bn1:[Number], br0:[Number], br1:[Number],

    wp0:[Number], wp1:[Number], wp2:[Number], wp3:[Number], 
    wp4:[Number], wp5:[Number], wp6:[Number], wp7:[Number],
    wk:[Number] , wq:[Number],  wb0:[Number], wb1:[Number],
    wn0:[Number], wn1:[Number], wr0:[Number], wr1:[Number],

    dead_pos_b: [Number], dead_pos_w:[Number]
})

module.exports = mongoose.model('ChessBoard', BoardData);