**1. Установите inversify к разрабатываемому приложению «библиотека» из модуля NDSE «Настройка окружения и Express.js» и создайте IoC-контейнер в файле container.js.**

**2. Добавьте сервис BooksRepository из предыдущего задания в IoC-контейнер.**
Как должно выглядеть добавление:
```javascript
container.bind(BooksRepository).toSelf()
```
Сервис должен подключиться .toSelf() без использования дополнительного контракта.

**3. Воспользуйтесь IoC-контейнером в обработчиках запросов express.js, чтобы получить BooksRepository.**
```javascript
router.get(':id', async (req, res, next) => {
  const repo = container.get(BooksRepository);
  const book = await repo.getBook(req.params.id);
  res.json(book);
})
```