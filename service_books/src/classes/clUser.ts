export class clUser{

    username    : string
    password    : string
    displayName : string
    email       : string
    id          : string

    constructor(
        username    : string = "",
        password    : string = "",
        displayName : string = "",
        email       : string = "",
        id          : string = ""){
        
        this.username    = username
        this.password    = password
        this.displayName = displayName
        this.email       = email
        this.id          = id
    }
}