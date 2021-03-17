/* eslint-disable eqeqeq */
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
  if (!request.token || !decodedToken.id) return response.status(401).json({ error: 'token missing or invalid' })
  const user = await User.findById(decodedToken.id)
  const { title, author, url } = request.body
  let likes = request.body.likes
  if(!likes) likes=0
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
  try {
    if (!request.token) return response.status(401).json({ error: 'token missing' })
    const decodedToken = jwt.verify(request.token, tokenSecret)
    console.log(decodedToken)
    if (!decodedToken.id) return response.status(401).json({ error: 'token invalid' })

    const { id } = request.params
    const blogToDelete = await Blog.findById(id)
    console.log({ blogAuthorId: blogToDelete.user, same: blogToDelete.user == decodedToken.id })
    if(decodedToken.id !== blogToDelete.user) return response.status(401).send('unauthorized to delete')
    await blogToDelete.remove()
    response.status(200).end()

  } catch (error) {
    response.status(500).send('internal server error').end() }

})

module.exports = router