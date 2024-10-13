import express from 'express'
import mongoose from 'mongoose'
import { passport, secret_session } from './auth'
import { initSocketServer } from './socket'
import router from './routes'
import errorMiddleware from './middleware/error'
import { preloadBooks } from './storage/books'
import { preloadUsers } from './storage/users'

const app = express()
app.use(express.json())   
app.use(express.urlencoded())
app.set("views","src/views")
app.set('view engine', 'ejs')
app.use(secret_session)
app.use(passport.initialize())
app.use(passport.session())
app.use(router)
app.use(errorMiddleware)

const { server, io } = initSocketServer(app, secret_session, passport)

// Объявляем асинхронную функциню для соединения с БД и запуском сервера
async function start(PORT: number, MONGODB_URL: string) {
    try {
        console.log(`MONGODB_URL - ${MONGODB_URL}`)
        await mongoose.connect(MONGODB_URL);
        await preloadBooks();
        await preloadUsers();
        server.listen(PORT, () => {
            console.log(`Server is listening port ${PORT}...`)
        })
    } catch (e) {
        console.log(`Has no connection to MongoDB`)
    }
}

const MONGODB_URL = process.env.MONGODB_URL
// Настраиваем порт, который будет прослушивать сервер
const PORT = <number><unknown>process.env.PORT || 3000
start(PORT, MONGODB_URL)