import express from 'express'
const router = express.Router()
export default router

router.get('/', (req: any, res) => {

    res.render('home', {
        title: 'Главная',
        user: req.user
    })
})