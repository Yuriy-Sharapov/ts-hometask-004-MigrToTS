// IoC контейнер
import { Container } from 'inversify'
import { clBooksRepository } from './classes/clBooksRepository'
import { clUsersRepository } from './classes/clUsersRepository'
import { clCommentsRepository } from './classes/clCommentsRepository'

const ioc = new Container()
ioc.bind(clBooksRepository).toSelf()
ioc.bind(clUsersRepository).toSelf()
ioc.bind(clCommentsRepository).toSelf()

export {ioc}