import session from 'express-session'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { ioc } from './container'
import { clUsersRepository } from './classes/clUsersRepository'
//import bcrypt from 'bcrypt'
//import Users from './models/users'

const verify = async (username: string, password: string, done: any) => {

    const userrep = ioc.get(clUsersRepository)
    try {
        const success = await userrep.check_password(username,password )
        //const user = userrep.getUserByUsername(username)
        //const success = await bcrypt.compare(password, user.password)
        console.log(`psw_check_res - ${success}`)

        if (success === false) {
            console.log(`Пароль неверный`)
            return done(null, false);
        }
        else {
            const user = userrep.getUserByUsername(username)
            console.log(`Пароль верный`)
            return done(null, user);
        }

    } catch (e) {
        console.log(`Ошибка при аутентификации пользователя`)
        return done(null, false)
    } 
}
  
const options = {
    usernameField: "username",
    passwordField: "password"
}
  
passport.use('local', new LocalStrategy(options, verify))

passport.serializeUser((user: any, cb) => {
    cb(null, user.id)
})

passport.deserializeUser( async (id: string, cb) => {

    const userrep = ioc.get(clUsersRepository)
    try {
        const user = await userrep.getUserById(id)
        //const user = await Users.findById(id).select('-__v')
        cb(null, user)       
    } catch (e) {
        return cb(e, false)
    }     
})

const secret_session = session({ secret: 'SECRET'})

export { passport, secret_session }