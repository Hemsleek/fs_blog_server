const Joi = require('joi')

const signUpPolicy = async(req, res , next) => {
  const schema = Joi.object({
    username:Joi.string().required(),
    name:Joi.string(),
    password:Joi.when('name',{
      is:Joi.exist(),
      then:Joi.string().required(),
      otherwise:Joi.string()
    })
  })

  const { error } = schema.validate(req.body)
  if(error) return res.status(400).json({ error: error.message })

  return next()
}
module.exports = {
  signUpPolicy
}