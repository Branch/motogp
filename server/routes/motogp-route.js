// Import express
const express = require('express')
// Import users controller
const motogpController = require('./../controllers/motogp-controller.js')
// Create express router
const router = express.Router()

router.get('/standings', motogpController.getLatest)
router.get('/races', motogpController.getRaces)
router.get('/categories', motogpController.getCategories)

// Export router
module.exports = router