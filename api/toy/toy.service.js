const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

async function query(filterBy = {}) {
    console.log('query with filter:', filterBy)
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('toy')
        var toys = await collection.find(criteria).toArray()
            // var toys = await collection.aggregate([{
            //     $match: filterBy
            // }]).toArray()


        // var toys = await collection.aggregate([{
        //         $match: filterBy
        //     },
        //     {
        //         $lookup: {
        //             from: 'user',
        //             localField: 'byUserId',
        //             foreignField: '_id',
        //             as: 'byUser'
        //         }
        //     },
        //     {
        //         $unwind: '$byUser'
        //     },
        //     {
        //         $lookup: {
        //             from: 'user',
        //             localField: 'aboutUserId',
        //             foreignField: '_id',
        //             as: 'aboutUser'
        //         }
        //     },
        //     {
        //         $unwind: '$aboutUser'
        //     }
        // ]).toArray()
        // const prettyToys = toys.map(toy => {
        //     console.log('toy', toy)
        //     toy.byUser = { _id: toy.byUser._id, fullname: toy.byUser.fullname }
        //     delete toy.byUserId
        //     return toy
        // })
        return toys
    } catch (err) {
        logger.error('cannot find toys', err)
        throw err
    }

}

async function getById(id) {
    const collection = await dbService.getCollection('toy')
    const toy = await collection.findOne({ _id: ObjectId(id) })
    return toy

}

async function remove(toyId) {
    try {
        const store = asyncLocalStorage.getStore()
        const { userId, isAdmin } = store
        const collection = await dbService.getCollection('toy')
            // remove only if user is owner/admin
        const query = { _id: ObjectId(toyId) }
        if (!isAdmin) query.byUserId = ObjectId(userId)
        await collection.deleteOne(query)
            // return await collection.deleteOne({ _id: ObjectId(toyId) })
    } catch (err) {
        logger.error(`cannot remove toy ${toyId}`, err)
        throw err
    }
}


async function add(toy) {
    console.log('adding review')
    try {
        // peek only updatable fields!
        const toyToAdd = {...toy }
        const collection = await dbService.getCollection('toy')
        const res = await collection.insertOne(toyToAdd)
        return res.ops[0];
    } catch (err) {
        logger.error('cannot insert toy', err)
        throw err
    }
}
async function update(toy) {
    try {
        delete toy._id
        const collection = await dbService.getCollection('toy')
        const res = await collection.updateOne({ "_id": ObjectId(toy._id) }, { $set: {name: 'toy.name'} })
        const {matchedCount, modifiedCount} = res
        console.log('res', matchedCount, modifiedCount);
        return res.ops[0];
    } catch (err) {
        logger.error('cannot update toy in db', err)
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