const dummy = (blogs) => {
  return 1
}
const totalLikes = (blogs) => {
  const reducer = (acc,blog) => acc + blog.likes
  return blogs.reduce(reducer,0)
}

const favouriteBlog = (blogs) => {
  const maxLikes = Math.max(...blogs.map(blog => blog.likes))
  return blogs.filter(blog => blog.likes===maxLikes)
    .map(( { title,author,likes } ) => ( { title,author,likes } ))[0]
}

const mostBlogs = (blogs) => {
  const authors = {}
  blogs.forEach(blog => {
    if(authors[blog.author]) return authors[blog.author]+=1
    else return authors[blog.author]=1
  })
  const maxBlog = Math.max(...Object.keys(authors).map(author => authors[author] ))
  return Object.keys(authors).filter(author => authors[author]===maxBlog)
    .map(author => ({ author,blogs:authors[author] }))[0]
}

const mostLikes = (blogs) => {
  const authors = {}
  blogs.forEach(blog => {
    if(authors[blog.author]) return authors[blog.author]+=blog.likes
    else return authors[blog.author]=blog.likes
  })
  const maxBlog = Math.max(...Object.keys(authors).map(author => authors[author] ))
  return Object.keys(authors).filter(author => authors[author]===maxBlog)
    .map(author => ({ author,likes:authors[author] }))[0]
}

module.exports = {
  dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes
}