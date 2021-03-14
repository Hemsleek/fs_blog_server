const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('../utils/test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog.js')


beforeEach(async() => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)

})
describe('get all blogs,', () => {
  test('blogs are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type',/application\/json/)
  })

  test('all blogs are returned', async() => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

})

test('returned blogs should contain id',async() => {
  const response = await api.get('/api/blogs')

  expect(response.body[3].id).toBeDefined()
})
test('blog without likes defaults to zero',async() => {
  const userData = { username:'hemsleek',password:'rastogi' }
  const user = await api
    .post('/api/login')
    .send(userData)
    .expect(200)

  const noLikesBlog = { title: 'arigato masarimasem', author: 'ichimaru gin',url:'http://welcome.com' }
  if(!noLikesBlog.likes) noLikesBlog.likes=0
  await api
    .post('/api/blogs')
    .send(noLikesBlog)
    .expect(201)
})

test('a valid blog can be added',async() => {
  const newBlog = { title: 'arigato masarimasem', author: 'ichimaru gin', url: 'https://reactpatterns.com/', likes: 7 }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const blogTitle = response.body.map(blog => blog.title)

  expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
  expect(blogTitle).toContain(newBlog.title)

} )

test('blog without title and url is not added', async() => {
  const noTitleBlog = { author: 'ichimaru gin', url: 'https://reactpatterns.com/', likes: 7 }
  const noUrlBlog = { title: 'arigato masarimasem', author: 'ichimaru gin', likes: 7 }

  await api
    .post('/api/blogs')
    .send(noTitleBlog)
    .expect(400)

  await api
    .post('/api/blogs')
    .send(noUrlBlog)
    .expect(400)

  const blogAtEnd = await helper.blogsInDB()
  expect(blogAtEnd).toHaveLength(helper.initialBlogs.length)

})

describe('update a blog',() => {
  test('without blog likes added',async() => {
    const blogsAtStart = await helper.blogsInDB()
    const blogToUpdate = blogsAtStart[0]
    const noBlogLikes = { title: 'arigato masarimasem', author: 'ichimaru gin' }
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(noBlogLikes)
      .expect(404)
    const likesUpdate = { likes: 30 }

    const blogsAtEnd = await helper.blogsInDB()
    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).not.toContain(noBlogLikes.title)

    const response= await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(likesUpdate)
      .expect(200)
      .expect('Content-Type',/application\/json/)
    const latestBlogs = await helper.blogsInDB()
    expect(response.body.likes).toBe(latestBlogs[0].likes)
  })
})
test('delete a blog',async () => {
  const blogAtStart= await helper.blogsInDB()
  const blogToDelete = blogAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(200)

  const blogAtEnd = await helper.blogsInDB()
  expect(blogAtEnd).toHaveLength(helper.initialBlogs.length - 1)

  const titles = blogAtEnd.map(blog => blog.title)
  expect(titles).not.toContain(blogToDelete.title)

})

afterAll(() => { mongoose.connection.close() })