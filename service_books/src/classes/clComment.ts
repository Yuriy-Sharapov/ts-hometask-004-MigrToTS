export class clComment{

    bookId   : string
    userId   : string
    username : string
    date     : Date
    userdate : string
    text     : string
    id       : string;

    constructor(
        bookId   : string,
        userId   : string,
        username : string = "",
        date     : Date,
        userdate : string = "",
        text     : string,
        id       : string = ""){
        
        this.bookId   = bookId
        this.userId   = userId
        this.username = username
        this.date     = date
        this.userdate = userdate
        this.text     = text
        this.id       = id
    }
}