// const mongoose = require('mongoose')
const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const tokenSecret = require('../utils/config').tokenSecret

router.post('/',async(req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username })
  const passwordCheck = user===null? false: await bcrypt.compare(password,user.passwordHash)
  if(!(user && passwordCheck )) return res.status(404).json({ error: 'invalid name/password ' })

  const tokenData ={
    username:user.username,
    id:user.id
  }
  const token = jwt.sign(tokenData,tokenSecret)

  res.status(200).send({ token , username:user.username,name:user.name })
})
module.exports = router