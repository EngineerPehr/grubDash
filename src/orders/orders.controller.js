const path = require('path')
const orders = require(path.resolve('src/data/orders-data'))
const nextId = require('../utils/nextId')

const orderExists = (req, res, next) => {
    const { orderId } = req.params
    const foundOrder = orders.find((order) => order.id === Number(orderId))
    const orderIndex = orders.findIndex((order) => order.id === Number(orderId))
    orderId ? (
        res.locals.order = foundOrder,
        res.locals.index = orderIndex,
        next()
    ) : (
        next({
            status: 404,
            message: `Order id not found: ${orderId}`
        })
    )
}

function create (req, res, next) {

}

function read (req, res, next) {

}

function update (req, res, next) {

}

function destroy (req, res, next) {

}

function list (req, res, next) {
    res.json({ data: orders })
}

module.exports = {
    create: [

    ],
    read: [
        orderExists
    ],
    update: [
        orderExists
    ],
    delete: [
        orderExists
    ],
    list
}