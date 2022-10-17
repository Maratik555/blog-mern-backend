import express from 'express'
import multer from 'multer'
import cors from 'cors'
import fs from 'fs'
import mongoose from 'mongoose'


import {loginValidation, registerValidation, postCreateValidation} from './validations.js'
import checkAuth from './utils/checkAuth.js'
import handleValidationErrors from './utils/handleValidationErrors.js'
import {getMe, login, register} from './controllers/UserController.js'
import {create, getAll, getOne, update, remove, getLastTags} from './controllers/PostController.js'


const app = express()

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		if (!fs.existsSync('uploads')) {
			fs.mkdirSync('uploads')
		}
		cb(null, 'uploads')
	},
	filename : (_, file, cb) => {
		cb(null,file.originalname)
	}
})

mongoose
	.connect('mongodb+srv://admin555:amr40416@cluster0.vyxbhqu.mongodb.net/blog?retryWrites=true&w=majority')
	.then(() => console.log('Db ok'))
	.catch(err => console.log('Error connecting to Mongoose', err))

const upload = multer({storage})

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

app.post('/auth/login', loginValidation, handleValidationErrors, login)
app.post('/auth/register', registerValidation, handleValidationErrors, register)
app.get('/auth/me', checkAuth, getMe)
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`
	})
})

app.get('/tags', getLastTags)
app.get('/posts', getAll)
app.get('/posts/tags', getLastTags)
app.get('/posts/:id', getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, create)
app.delete('/posts/:id', checkAuth, remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, update)


app.listen(4000, (err) => {
	if(err) console.log(err)
	console.log('Starting port: 4000')
})