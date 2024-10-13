import express = require('express')
const router = express.Router()
export default router

import homeRouter from './home'
import userRouter from './user'
import booksRouter from './books'

router.use('/', homeRouter)
router.use('/', userRouter)
router.use('/', booksRouter)