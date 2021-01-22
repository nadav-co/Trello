const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')


async function login(username, password) {
    logger.debug(`auth.service - login with username: ${username}`)

    const user = await userService.getByUsername(username)
    if (!user) return Promise.reject('Invalid username')
        if (!user.password) return user
        const match = await bcrypt.compare(password, user.password)
    if (!match) return Promise.reject('Invalid username or password')

    delete user.password
    return user
}

async function signup({firstname, lastname, username, email , password}) {
    const saltRounds = 10
    logger.debug(`auth.service - signup with username: ${username}, fullname: ${firstname +' '+ lastname}`)
    if (!username ) return Promise.reject('username is required!')

    const hash = password && await bcrypt.hash(password, saltRounds)
    return userService.add({ firstname, lastname, username, email, password: hash})
}

module.exports = {
    signup,
    login,
}