import http from 'http'
import socketIO from 'socket.io'
//import Comments from './models/comments'
import { ioc } from './container'
import { clCommentsRepository } from './classes/clCommentsRepository'
import { clComment } from './classes/clComment'

function onlyForHandshake(middleware: any) {
    return (req: any, res: any, next: any) => {
      const isHandshake = req._query.sid === undefined;
      if (isHandshake) {
        middleware(req, res, next);
      } else {
        next();
      }
    };
  }

export function initSocketServer(app: any, session: any, passport: any) {

    const server = new http.Server(app)
    const io = new socketIO.Server(server)

    io.engine.use(onlyForHandshake(session));
    io.engine.use(onlyForHandshake(passport.session()));
    io.engine.use(
      onlyForHandshake((req: any, res: any, next: any) => {
        if (req.user) {
          next();
        } else {
          res.writeHead(401);
          res.end();
        }
      }),
    );   

    // Определим входящее соединение
    io.on('connection', (socket: any) => {
        const {id} = socket
        console.log(`connection ${id}`)

        const user = socket.request.user;
        console.log('io.on(connection - socket.request.user')
        console.log(user)
        socket.join(`user:${user.id}`);

        // Отправим сообщение всем обсуждающим книгу
        console.log(`socket.handshake.query`)
        console.log(socket.handshake.query)
        const {bookId} = socket.handshake.query
        console.log(`Socket bookId: ${bookId}`)
        socket.join(bookId)
        socket.on('message-to-book-discussants', async (msg: any) => {

            console.log('socket.on(message-to-book-discussants - socket.request.user')
            console.log(socket.request.user) 
            console.log('socket.on(message-to-book-discussants - bookId')
            console.log(bookId)                        
 
            let date = new Date()
            const comrep = ioc.get(clCommentsRepository)
            const comment = new clComment(
                                  bookId,
                                  socket.request.user.id,
                                  socket.request.user.username,
                                  date,
                                  date.toLocaleString('ru'),
                                  msg.text)
            

            // const newComment = new Comments({
            //   bookId: bookId,
            //   userId: socket.request.user.id,
            //   date  : date,
            //   text  : 
            // })
            // console.log(`newComment = ${newComment}`)

            try {
                await comrep.createComment(comment)  
                //await newComment.save()
                const msg_server = {
                  username : comment.username,
                  date     : comment.userdate,
                  text     : comment.text,
                }  
                console.log(`msg_server`)
                console.log(msg_server)
                socket.broadcast.emit('message-to-book-discussants', msg_server)
                // отдельно отправим сообщение себе,
                // т.к. метод broadcast не отправляет сообщение отправителю
                socket.emit('message-to-book-discussants', msg_server)                
            } catch (e) {
              console.log(`Не удалось сохранить сообщение в БД ${msg.text}`)
            }
        })     

        socket.on('disconnect', (socket: any) => {
            console.log(`disconnect ${id}`)
        })
    })

    return { server, io }
}