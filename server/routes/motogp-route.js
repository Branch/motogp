// Import express
const express = require('express')
// Import users controller
const motogpController = require('./../controllers/motogp-controller.js')
// Create express router
const router = express.Router()

router.get('/standings/rider', motogpController.getLatest)
// Export router
module.exports = router