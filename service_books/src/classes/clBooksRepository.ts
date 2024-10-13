import { injectable } from 'inversify'
import { ifBook } from './ifBook'
import { clBook } from './clBook'
import Books from '../models/books'
import fs from 'fs'

@injectable()
export abstract class clBooksRepository{
    // количество книг в коллекции
    async get_count():Promise<number>{
        return await Books.countDocuments()       
    }
    // создание книги
    async createBook(book: ifBook, files: any = null):Promise<ifBook> {        

        let fileCover = book.fileCover
        let fileName  = book.fileName
        let fileBook  = book.fileBook

        if (files) {            
            if (files.cover !== undefined)
                fileCover = files.cover[0].path       

            if (files.book !== undefined) {
                fileName = files.book[0].filename
                fileBook = files.book[0].path
            }
        }
    
        const newBook = new Books({
            title      : book.title,
            description: book.description,
            authors    : book.authors,
            favorite   : book.favorite,
            fileCover,
            fileName,
            fileBook})
    
        try {
            await newBook.save()
            return book
        } catch (e) {
            console.log(e)
            return null
        }        
    }
    // получение книги по id
    async getBook(id: string):Promise<ifBook> {

        try {
            const dbBook = await Books.findById(id).select('-__v')
            const {title, description, authors, favorite, fileCover, fileName, fileBook, id: dbId } = dbBook
            const book = new clBook (title, description, authors, favorite, fileCover, fileName, fileBook, dbId)
            return book
        } catch (e) { 
            return null
        }
    }
    // получение всех книг
    async getBooks():Promise<ifBook[]> {
        try {
            const dbBooks = await Books.find().select('-__v')
            
            let books: clBook[]
            let i: number
            for (i = 1; i < dbBooks.length; i++ ){
                const {title, description, authors, favorite, fileCover, fileName, fileBook, id} = dbBooks[i]
                const book = new clBook (title, description, authors, favorite, fileCover, fileName, fileBook, id)   
                books.push(book)          
            }
            return books;

        } catch (e) {

            return null
        }  
    }
    // обновление книги
    async updateBook(
        id          : string,
        title       : string,
        description : string,
        authors     : string,
        favorite    : boolean,
        files       : any):Promise<ifBook> {
       
        try {
            const dbBook = await Books.findById(id).select('-__v')
            
            let fileCover = dbBook.fileCover;
            if (files.cover !== undefined) {
                // Пришел новый файл обложки, надо удалить старый файл
                console.log(`Нужно удалить файл обложки - ${fileCover}`)
                try{
                    fs.unlinkSync(fileCover)
                } catch (e) {
                    console.log(`Файл ${fileCover} не удален`)
                    console.log(e)
                }
                fileCover = files.cover[0].path
            }
    
            let fileName = dbBook.fileName
            let fileBook = dbBook.fileBook
            if (files)
                if (files.book !== undefined) {
                    // Пришел новый файл книги, надо удалить старый файл
                    console.log(`Нужно удалить файл книги - ${fileBook}`)
                    try{
                        fs.unlinkSync(fileBook)
                    } catch (e) {
                        console.log(`Файл ${fileBook} не удален`)
                        console.log(e)
                    }        
                    fileName = files.book[0].filename
                    fileBook = files.book[0].path
                }
    
            const book = new clBook (title, description, authors, favorite, fileCover, fileName, fileBook, id)
            try {
                await Books.findByIdAndUpdate(id, {
                    title,
                    description,
                    authors,
                    favorite,  
                    fileCover,
                    fileName,
                    fileBook})

                return book
            } catch (e) {
                return null
            } 
        } catch (e) {
            console.log(`Ошибка при обращении к книге`)
            console.log(e)
            return null
        }  
    }
    //  удаление книги
    async deleteBook(id: string):Promise<ifBook> {

        try {
            const dbBook = await Books.findById(id).select('-__v')
            try{
                fs.unlinkSync(dbBook.fileCover)
            } catch (e) {
                console.log(`Файл обложки ${dbBook.fileCover} не удален`)
                console.log(e)
            }
            try{
                fs.unlinkSync(dbBook.fileBook)
            } catch (e) {
                console.log(`Файл книги ${dbBook.fileBook} не удален`)
                console.log(e)
            }

            const {title, description, authors, favorite, fileCover, fileName, fileBook, id: dbId} = dbBook
            const book = new clBook (title, description, authors, favorite, fileCover, fileName, fileBook, dbId)

            await Books.deleteOne({_id: id})

            return book
        } catch (e) {
            return null
        }   
    }
}