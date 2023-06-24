// Imports
const router = require('express').Router({ mergeParams: true })
const controller = require('./dishes.controller')
const methodNotAllowed = require('../errors/methodNotAllowed')

// Dish-specific route with GET and PUT methods allowed. All other methods forbidden.
router
    .route('/:dishId')
    .get(controller.read)
    .put(controller.update)
    .all(methodNotAllowed)

// Root route with GET and POST methods. All other methods forbidden.
router
    .route('/')
    .get(controller.list)
    .post(controller.create)
    .all(methodNotAllowed)

// Exported for use in app.js
module.exports = router
