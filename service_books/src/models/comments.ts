import {Schema, Types, model} from 'mongoose'

const commentSchema = new Schema({
    bookId: {
        type: Types.ObjectId,   
        required: true
    },
    userId: {
        type: Types.ObjectId,
        required: true
    },    
    date: {
        type: Date,
        required: true
    },
    text: {
        type: String,
        default: ""
    }
})

export = model('Comments', commentSchema)