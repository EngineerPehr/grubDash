// Imports
const router = require('express').Router({ mergeParams: true })
const controller = require('./orders.controller')
const methodNotAllowed = require('../errors/methodNotAllowed')

// Order-specific route with GET, PUT, and DELETE methods. All other methods are forbidden
router
    .route('/:orderId')
    .get(controller.read)
    .put(controller.update)
    .delete(controller.delete)
    .all(methodNotAllowed)

// Root route with GET and POST methods. All other methods are forbidden.
router
    .route('/')
    .get(controller.list)
    .post(controller.create)
    .all(methodNotAllowed)

// Exported for use in app.js
module.exports = router
