const router = require('express').Router({ mergeParams: true })
const controller = require('./orders.controller')
const dishesRouter = require('../dishes/dishes.router')
const methodNotAllowed = require('../errors/methodNotAllowed')

router
    .route('/:orderId')
    .get(controller.read)
    .put(controller.update)
    .delete(controller.delete)
    .all(methodNotAllowed)

router
    .route('/')
    .get(controller.list)
    .post(controller.create)
    .all(methodNotAllowed)

module.exports = router
