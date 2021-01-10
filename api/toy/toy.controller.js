const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const toyService = require('./toy.service')

async function getToys(req, res) {
    try {
        const toys = await toyService.query(req.query)
        res.send(toys)
    } catch (err) {
        logger.error('Cannot get toys', err)
        res.status(500).send({ err: 'Failed to get toys' })
    }
}
async function getToy(req, res) {
    try {
        const toy = await toyService.getById(req.params.id)
        res.send(toy)
    } catch (err) {
        logger.error('Cannot get toy', err)
        res.status(500).send({ err: 'Failed to get toy' })
    }
}

async function deleteToy(req, res) {
    try {
        await toyService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete toy', err)
        res.status(500).send({ err: 'Failed to delete toy' })
    }
}


async function addToy(req, res) {
    try {
        var toy = req.body
            // toy.byUserId = req.session.user?._id
        toy = await toyService.add(toy)
        toy.byUser = req.session.user
        res.send(toy)

    } catch (err) {
        logger.error('Failed to add toy', err)
        res.status(500).send({ err: 'Failed to add toy' })
    }
}

async function updateToy(req, res) {
    try {
        var toy = req.body
        console.log('updating with', toy)
        toy = await toyService.update(toy)
        console.log('after', toy)
        res.send(toy)

    } catch (err) {
        logger.error('Failed to update toy', err)
        res.status(500).send({ err: 'Failed update add toy' })
    }
}

module.exports = {
    getToys,
    getToy,
    deleteToy,
    addToy,
    updateToy
}