import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, path.join(__dirname, '..', 'public', 'books'))
    },
    filename(req, file, cb){
        // в колбек отправляем ошибку (null) и маску с названием файла в нашей папке
        switch (file.fieldname) {
            case 'cover':
                cb(null, `${Date.now()}-cover-${Buffer.from(file.originalname, 'latin1').toString()}`)
                break;
            case 'book':
                cb(null, `${Date.now()}-book-${Buffer.from(file.originalname, 'latin1').toString()}`)
                break;
        }          
    }
})

// Массив с доступными MIME типами
const allowedTypes = [      
    'application/pdf',
    'application/rtf',
    'application/vnd.oasis.opendocument.text',
    'text/plain',
    'text/html',
    'image/jpeg'
]        

const fileFilter = (req: any, file: any, cb: any) => {     // Фильтр типов файлов
    req = req
    if (allowedTypes.includes(file.mimetype))
        cb(null, true)
    else
        cb(null, false)
}

exports = multer({storage, fileFilter})