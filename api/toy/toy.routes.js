const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getToys, getToy, deleteToy, addToy, updateToy } = require('./toy.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getToys)
router.get('/:id', log, getToy)
router.post('/', addToy)
router.put('/:id', updateToy)
router.delete('/:id', deleteToy)

module.exports = router