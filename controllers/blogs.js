const router = require('express').Router()
const Blog = require('../models/blog')

router.get('/', async(request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

router.post('/', async(request, response) => {
  let newBlog = request.body
  if(!newBlog.title || !newBlog.url) return response.status(400).end()
  newBlog = new Blog(newBlog)
  const savedBlog = await newBlog.save()
  response.status(201).json(savedBlog)
})

router.put('/:id', async(request, response) => {
  const { id }= request.params
  const { likes } = request.body
  if(!likes) return response.status(404).end()
  const blogUpdate= await Blog.findByIdAndUpdate(id,{ likes },{ new:true })
  response.json(blogUpdate)
})

router.delete('/:id',async(request, response) => {
  const { id } = request.params
  await Blog.findByIdAndRemove(id)
  response.status(200).end()
})

module.exports = router