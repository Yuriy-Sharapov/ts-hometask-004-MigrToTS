import { injectable } from 'inversify'
import { clComment } from './clComment'
import Comments from '../models/comments'
import { ioc } from '../container'
import { clUsersRepository } from '../classes/clUsersRepository'

@injectable()
export abstract class clCommentsRepository{
    // создание комментария
    async createComment(comment: clComment):Promise<clComment> {        
   
        const newComment = new Comments({
            bookId : comment.bookId,
            userId : comment.userId,
            date   : comment.date,
            text   : comment.text
        })
    
        try {
            await newComment.save()
            return comment
        } catch (e) {
            return null
        }        
    }
    // // получение комментария по id
    // async getComment(id: Types.ObjectId):Promise<clComment> {

    //     try {
    //         const dbBook = await Books.findById(id).select('-__v')
    //         const {title, description, authors, favorite, fileCover, fileName, fileBook} = dbBook
    //         const book = new clBook (title, description, authors, favorite, fileCover, fileName, fileBook, id)
    //         return book
    //     } catch (e) { 
    //         return null
    //     }
    // }
    // получение всех книг
    async getComments(bookId: string):Promise<clComment[]> {

        try{
            const dbComments = await Comments.find({ bookId: bookId }).select('-__v').sort( { date : -1 } )

            const userrep = ioc.get(clUsersRepository)

            // Создаем новый список комментариев, в котором будут имена пользователей
            let comments: clComment[]
            let i: number
            for (i = 0; i < dbComments.length; i++) {
                //console.log(`comment = ${comments[i]}`)
                
                const comm_user = await userrep.getUserById(dbComments[i].userId.prototype.toString())                
                const comment = new clComment(
                                      bookId,
                                      comm_user.id,
                                      comm_user.username,
                                      dbComments[i].date,
                                      dbComments[i].date.toLocaleString('ru'),
                                      dbComments[i].text)
                comments.push(comment)
            }
            return comments
        } catch (e) {
            console.log(`async getComments`)
            console.log(e)
            return null
        }  
    }
}