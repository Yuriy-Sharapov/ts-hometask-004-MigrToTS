export = ((req: any, res: any) => {
    res.render('errors/404', {
        title: 404,
        user: req.user
    })
})