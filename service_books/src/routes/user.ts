import express from 'express'
const router = express.Router()
export default router

import { passport } from '../auth'
import { ioc } from '../container'
import { clUsersRepository } from '../classes/clUsersRepository'
//const bcrypt = require('bcrypt')
//const Users = require('../models/users')

router.get('/user/login', (req, res) => {

    res.render('user/login', {
      title: 'Авторизация',
      user: req.user
    })
})

router.post('/user/login',
    passport.authenticate('local', { failureRedirect: '/user/login' }),
    (req, res) => {

      if (!req.user){
        res.redirect('/user/login')
        return
      }

      console.log("req.user: ", req.user)
      res.redirect('/')
    }
)

router.get('/user/signup', (req, res) => {

  const userrep = ioc.get(clUsersRepository)
  const user_prefill = userrep.getEmptyUser()

  res.render('user/signup', {
    title: 'Регистрация пользователя',
    user: req.user,    
    user_prefill: user_prefill
  })
})

router.post('/user/signup', async (req, res) => {

  const {username, password, password_rep, displayName, email} = req.body

  const userrep = ioc.get(clUsersRepository)
  const user_prefill = userrep.getUserByBodyNoPassword(req.body)

  // Проверка совпадения пароля и его повтора
  if (password !== password_rep) {
    console.log('Пароли не совпадают')

    res.render('user/signup', {
      title        : 'Регистрация пользователя',
      user         : req.user,
      user_prefill : user_prefill
    })
    return      
  }

  try {
    
    // const users = await Users.find().select('-__v') 
    // console.log(`Все пользователи`)
    // console.log(users)
    const user = await userrep.getUserByUsername(username)
    if (user) {
      console.log(`Пользователь ${user.username} уже существует`)    
      res.render('user/signup', {
        title        : 'Регистрация пользователя',
        user         : req.user,
        user_prefill : user_prefill
      })
      return
    }           
  } catch (e) {
    // идем дальше
  } 

  // Создаем пользователя
  try {

    const user = userrep.getUserByBody(req.body)
    const userDb = await userrep.createUser(user)
    
    if(userDb)
      res.redirect('/user/login')
    else
      res.render('user/signup', {
        title        : 'Регистрация пользователя',
        user         : req.user,
        user_prefill : user_prefill
      })

  } catch (e) {
    console.log(`Ошибка при созданиие пользователя ${username}`)
    console.log(e)
    return;
  }   
})

router.get('/user/logout',  (req, res) => {
  req.logout(function(err) {
    res.redirect('/')
  })
})

router.get('/user/profile',
  (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.redirect('/user/login')
    }
    next()
  },
  (req, res) => {
    res.render('user/profile', {
      title : 'Профиль пользователя',
      user  : req.user
    })
  }    
)

