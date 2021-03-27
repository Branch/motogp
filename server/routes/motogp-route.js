// Import express
const express = require('express')
// Import users controller
const motogpController = require('./../controllers/motogp-controller.js')
// Create express router
const router = express.Router()

router.get('/standings', motogpController.getLatest)
router.get('/races', motogpController.getRaces)
router.get('/categories', motogpController.getCategories)
router.get('/sessions', motogpController.getSessions)
router.get('/session', motogpController.getSession)

// Export router
module.exports = router