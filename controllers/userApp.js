const UserApp = require('../models/userApp')
const bcrypt = require('bcrypt')

function isStringInvalid (string) {
    if (string === undefined || string.length === 0) {
        return true
    } else {
        return false
    }
}

exports.postSignUp = async(req, res, next) => {
    try {
        const { name, email, password } = req.body
        if (isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(password)) {
            return res.status(400).json({ err: 'Bad Parameters, Spmething is missing.'})
        }

        bcrypt.hash(password, 10, async(err, hash) => {
            console.log(err)
            const data = await UserApp.create({ name, email, password: hash })
            res.status(201).json({ message: 'New User Successfully created!' })
        })
} catch (err) {
    res.status(500).json({error: err})
}
}

exports.postLogin = async(req, res, next) => {
    try {
          const { email, password } = req.body
          if (isStringInvalid(email) || isStringInvalid(password)) {
            return res.status(400).json({ message: 'Email or Password is missing!', success: false })
          }

        const user = await UserApp.findAll({ where: { email }})
        if (user.length > 0) {
            bcrypt.compare(password, user[0].password, (err, response) => {
                if (err) {
                    throw new Error('Something went wrong!')
                }
            if (response === true) {
                res.status(200).json({ message: 'User logged in successfully', success: true })
            } else {
                res.status(400).json({ message: 'Password is incorrect', success: false })
            }
        })
        } else {
            return res.status(404).json({ message: 'User does not exist', success: false })
        }
    } catch (err) {
        res.status(500).json({ message: err, success: false })
    }
}