import { injectable } from 'inversify'
import { clUser } from './clUser'
import Users from '../models/users'
import bcrypt from 'bcrypt'

@injectable()
export abstract class clUsersRepository{
    // количество пользователей в коллекции
    async get_count():Promise<number>{
        return await Users.countDocuments()       
    }    
    // создание пользователя
    async createUser(user: clUser):Promise<clUser> {        
   
        const {username, password, displayName, email} = user
          
        // получаем соль
        const salt = await bcrypt.genSalt(10)
        // солим и шифруем пароль
        const hash_password = await bcrypt.hash(password, salt)
  
        console.log({username, hash_password, displayName, email})
  
        const newUser = new Users({
                              username   : username,
                              password   : hash_password,
                              displayName: displayName,
                              email      : email})
    
        try {
            await newUser.save()
            return user
        } catch (e) {
            console.log(`async createUser`)
            console.log(e)
            return null
        }        
    }
    // получение пользователя по id
    async getUserById(id: string):Promise<clUser> {

        try {
            const dbUser = await Users.findById(id).select('-__v')
            const {username, password, displayName, email, id: dbId} = dbUser
            const user = new clUser (username, password, displayName, email, dbId)
            return user
        } catch (e) { 
            console.log(`async getUserById`)
            console.log(e)            
            return null
        }
    }
    // получение пользователя по имени
    async getUserByUsername(username: string): Promise<clUser> {
        try {
            const dbUser = await Users.findOne({ "username": username }).select('-__v')
            const {password, displayName, email, id: dbId} = dbUser
            const user = new clUser (username, password, displayName, email, dbId)
            return user
        } catch (e) { 
            console.log(`async getUserByUsername`)
            console.log(e)
            return null
        }
    }

    getEmptyUser(): clUser {
        return new clUser()
    }
    getUserByBody(body: any): clUser {

        const {username, password, displayName, email} = body
        return new clUser(username, password, displayName, email)

    }    
    getUserByBodyNoPassword(body: any): clUser {

        const { username, displayName, email } = body
        return new clUser(username, "", displayName, email)

    }
    async check_password(username: string, input_password: string):Promise<boolean> {
        try {
            
            const user    = await this.getUserByUsername(username)
            const success = await bcrypt.compare(input_password, user.password)
            console.log(`psw_check_res - ${success}`)
            return success

        } catch (e) {
            console.log(`Ошибка при аутентификации пользователя`)
            console.log(e)
        } 
    }
}