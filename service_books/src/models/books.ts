import {Schema, model} from 'mongoose'

const bookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    authors: {
        type: String,
        default: ""
    },
    favorite: {
        type: Boolean,
        default: false
    },
    fileCover: {
        type: String,
        default: ""
    },
    fileName: {
        type: String,
        default: ""
    },
    fileBook: {
        type: String,
        default: ""
    }
})

export = model('Books', bookSchema)