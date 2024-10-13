import { clBook } from '../classes/clBook'
import { ioc } from '../container'
import { clBooksRepository } from '../classes/clBooksRepository'

const book_list = [
    new clBook(
        "The Twelve-Factor App (Русский перевод)", 
        "Интересная книга",
        "",
        true,
        "public//books//TFA.html",
        "TFA.html",
        "public//books//TFA.html",
        null),
    new clBook(
        "Совершенный код", 
        "Очень хорошая книга",
        "Макконнелл",
        true,
        "public//books//Макконнелл «Совершенный код».pdf",
        "Макконнелл «Совершенный код».pdf",
        "public//books//Макконнелл «Совершенный код».pdf",
        null),
    new clBook(
        "Простоквашино", 
        "Отличная книга для детей",
        "Э. Успенский",
        true,
        "err/err/Простоквашино.pdf",
        "Простоквашино.pdf",
        "err/err/Простоквашино.pdf",
        null)
]

export async function preloadBooks():Promise<void>{

    const bookrep = ioc.get(clBooksRepository)

    try {
        const books_count = await bookrep.get_count()
        console.log(`books_count = ${books_count}`)
        if(books_count !== 0) return;

        console.log(`Нужно инициализировать данные БД Books`)

        let i: number
        for (i = 0; i < book_list.length; i++)
            await bookrep.createBook(book_list[i])

    } catch (e) {
        console.log(`Ошибка при обращении к коллекции Books`)
        console.log(e)
    }
}