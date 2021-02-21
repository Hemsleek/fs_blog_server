const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const tokenSecret = require('../utils/config').tokenSecret


router.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

router.post('/', async (request, response) => {
  const decodedToken = jwt.verify(request.token, tokenSecret)
  console.log({decodedToken})
  if (!request.token || !decodedToken.id) return response.status(401).json({ error: 'token missing or invalid' })
  const user = await User.findById(decodedToken.id)
  console.log({ user })
  const { title, author, url, likes } = request.body
  if (!title || !url) return response.status(400).end()
  const newBlog = new Blog({
    title, author, url, likes, user: user.id
  })
  const savedBlog = await newBlog.save()
  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()
  response.status(201).json(savedBlog)
})

router.put('/:id', async (request, response) => {
  const { id } = request.params
  const { likes } = request.body
  if (!likes) return response.status(404).end()
  const blogUpdate = await Blog.findByIdAndUpdate(id, { likes }, { new: true })
  response.json(blogUpdate)
})

router.delete('/:id', async (request, response) => {
  const { id } = request.params
  await Blog.findByIdAndRemove(id)
  response.status(200).end()
})

module.exports = router