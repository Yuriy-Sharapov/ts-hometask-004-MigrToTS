import { clUser } from '../classes/clUser'
import { ioc } from '../container'
import { clUsersRepository } from '../classes/clUsersRepository'

const user_list = [
  new clUser(
    'user',
    '123456',
    'demo user',
    'user@mail.ru' ),
  new clUser(    
    'jill',
    'birthday',
    'Jill',
    'jill@example.com' )
]
  
export async function preloadUsers():Promise<void>{

  const userrep = ioc.get(clUsersRepository)

  try {
      const users_count = await userrep.get_count()
      console.log(`users_count = ${users_count}`)
      if(users_count !== 0) return;

      console.log(`Нужно инициализировать данные БД Users`)
      let i: number
      for (i = 0; i < user_list.length; i++)
        await userrep.createUser(user_list[i])

  } catch (e) {
      console.log(`Ошибка при обращении к коллекции Users`)
      console.log(e)
  }
}