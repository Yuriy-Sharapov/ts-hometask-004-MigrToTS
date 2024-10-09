const express = require('express')
const router = express.Router()
const {passport} = require('../auth')
const bcrypt = require('bcrypt')

const Users = require('../models/users')

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

  let user_prefill = { 
    username: '',
    displayName: '',
    email: ''
  }

  res.render('user/signup', {
    title: 'Регистрация пользователя',
    user: req.user,    
    user_prefill: user_prefill
  })
})

router.post('/user/signup', async (req, res) => {

  const {username, password, password_rep, displayName, email} = req.body

  // если пользователь ошибся, то даем ему возможность поправить ввод на странице регистрации
  let user_prefill = {
    username: username,
    displayName: displayName,
    email: email
  }

  // Проверка совпадения пароля и его повтора
  if (password !== password_rep) {
    console.log('Пароли не совпадают')

    res.render('user/signup', {
      title: 'Регистрация пользователя',
      user: req.user,
      user_prefill: user_prefill
    })
    return      
  }

  try {
    const users = await Users.find().select('-__v') 
    console.log(`Все пользователи`)
    console.log(users)
    const user = await Users.findOne({ "username": username}).select('-__v')
    if (user) {
      console.log(`Пользователь ${user.username} уже существует`)    
      res.render('user/signup', {
        title: 'Регистрация пользователя',
        user: req.user,
        user_prefill: user_prefill
      })
      return
    }           
  } catch (e) {
    // идем дальше
  } 

  // зашифруем пароль
  try {
    // получаем соль
    const salt = await bcrypt.genSalt(10)
    // солим и шифруем пароль
    const hash_password = await bcrypt.hash(password, salt)

    console.log(`password - ${password}`)
    console.log(`salt - ${salt}`)
    console.log(`hash - ${hash_password}`)    

    console.log({username, hash_password, displayName, email})

    const newUser = Users({
      username   : username,
      password   : hash_password,
      displayName: displayName,
      email      : email})

    try {
      await newUser.save()
      // Успешно создали пользователя, переходим на страницу входа
      res.redirect('/user/login')
    } catch (e) {
      // нашли пользователя с тем же именем, с которым регистрируются
      console.log('Ошибка при сохранении нового пользовател в БД')
      res.render('user/signup', {
        title: 'Регистрация пользователя',
        user: req.user,
        user_prefill: user_prefill
      })
    } 
  } catch (e) {
    console.log(`Ошибка при шифровании пароля`)
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
      title: 'Профиль пользователя',
      user: req.user
    })
  }    
)

module.exports = router