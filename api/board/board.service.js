const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

async function query(userId) {
    console.log('board query with filter:', userId)
    try {
        const collection = await dbService.getCollection('board')
            // var boards = await collection.find({ members: { _id: ObjectId(userId) } }).toArray()
            var boards = await collection.find().toArray()
        return boards
    } catch (err) {
        logger.error('cannot find boards', err)
        throw err
    }

}

async function getById(id) {
    const store = asyncLocalStorage.getStore()
    const { userId, isAdmin } = store
    try {
        const collection = await dbService.getCollection('board')
        const board = await collection.findOne({ _id: ObjectId(id) })
            // if (board.members.some(member => member._id === userId) || isAdmin) return board
        return board
        // throw new Error('UnAuthorise')
    } catch (err) {
        console.log(err);
        throw err
    }

}

async function remove(boardId) {
    try {
        const store = asyncLocalStorage.getStore()
        const { userId, isAdmin } = store
        const collection = await dbService.getCollection('board')
            // remove only if user is owner/admin
        const query = { _id: ObjectId(board) }
        if (!isAdmin) query.createdBy = ObjectId(userId)
        return await collection.deleteOne(query)
    } catch (err) {
        logger.error(`cannot remove toy ${toyId}`, err)
        throw err
    }
}


async function add(board) {
    console.log('adding board')
    try {

        const boardToAdd = {...board }
        const collection = await dbService.getCollection('board')
        const res = await collection.insertOne(boardToAdd)
        return res.ops[0];
    } catch (err) {
        logger.error('cannot insert board', err)
        throw err
    }
}
async function update(board) {
    try {
        board._id = ObjectId(board._id);
        const collection = await dbService.getCollection('board')
        await collection.updateOne({ "_id": ObjectId(board._id) }, { $set: board })
            // console.log(boardToSave);
            // const {matchedCount, modifiedCount} = res
            // console.log('res', matchedCount, modifiedCount);
        return board
    } catch (err) {
        logger.error('cannot update board in db', err)
        throw err
    }
}


function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.name) criteria.name = { $regex: filterBy.name, $options: 'i' }
    if (filterBy.type) criteria.type = { $regex: filterBy.type, $options: 'i' }
    return criteria
}

module.exports = {
    query,
    getById,
    remove,
    add,
    update
}