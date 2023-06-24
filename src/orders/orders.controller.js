// Imports
const orders = require('../data/orders-data')
const dataHas = require('../utils/dataHas')
const nextId = require('../utils/nextId')

// Checks if the desired order id exists and sets the corresponding data to the response.locals
// Sends a 404 error if the order id does not exist
const orderExists = (req, res, next) => {
    // Order ID retrieved from the request.params
    const { orderId } = req.params
    // Both the order object and its index are found
    const foundOrder = orders.find((order) => order.id === orderId)
    const orderIndex = orders.findIndex((order) => order.id === orderId)
    foundOrder ? (
        // If found, the object and index are added to the response.locals
        res.locals.foundOrder = foundOrder,
        res.locals.orderIndex = orderIndex,
        next()
    ) : (
        // If not found, a 404 error is sent
        next({
            status: 404,
            message: `Order id not found: ${orderId}`
        })
    )
}

const dishesValidator = (req, res, next) => {
    const { data: { dishes } = {} } = req.body
    if (dishes.length > 0 && Array.isArray(dishes)) {
        next()
    } else {
        next({
            status: 400, 
            message: `Order must include at least one dish`
        })
    }
}

const dishValidator = (req, res, next) => {
    const { data: { dishes } = {} } = req.body
    const faultyQualityIndex = dishes.findIndex((dish) => 
        !dish.hasOwnProperty('quantity') || 
        !Number.isInteger(dish.quantity) ||
        dish.quantity <= 0)
    faultyQualityIndex === -1 ? (
        next()
    ) : (
        next({
            status: 400, 
            message: `Dish ${faultyQualityIndex} must have a quantity that is an integer greater than 0`
        })
    )

}

const orderIdValidator = (req, res, next) => {
    const { orderId } = req.params
    const { data: { id } = {} } = req.body
    !id ? (
        next()
    ) : (
        id === orderId ? (
            next()
        ) : (
            next({
                status: 400, 
                message: `Order id does not match route id. order: ${id}, Route: ${orderId}`
            })
        )
    )
}

const orderStatusValidator = (req, res, next) => {
    const { data: { status } = {} } = req.body
    const validStatus = [
        'pending', 
        'preparing', 
        'out-for-delivery', 
        'delivered', 
    ]
    validStatus.includes(status) ? (
        next()
    ) : (
        next({
            status: 400,
            message: `Order must have a status of ${validStatus.join(', ')}`
        })
    )
}

const orderDeliveredValidator = (req, res, next) => {
    const { data: { status } = {} } = req.body
    status !== 'delivered' ? (
        next()
    ) : (
        next({
            status: 400, 
            message: `A delivered order cannot be changed`
        })
    )
}

const pendingChecker = (req, res, next) => {
    const order = res.locals.foundOrder
    order.status === 'pending' ? (
        next()
    ) : (
        next({
            status: 400,
            message: `An order cannot be deleted unless it is pending`
        })
    )
}

function create (req, res, next) {
    const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body
    const newOrder = {
        id: nextId(),
        deliverTo, 
        mobileNumber, 
        status, 
        dishes, 
    }
    orders.push(newOrder)
    res.status(201).json({ data: newOrder })
}

function read (req, res, next) {
    const order = res.locals.foundOrder
    res.json({ data: order })
}

function update (req, res, next) {
    const order = res.locals.foundOrder
    const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body

    order.deliverTo = deliverTo
    order.mobileNumber = mobileNumber
    order.status = status
    order.dishes = dishes

    res.json({ data: order })
}

function destroy (req, res, next) {
    const index = res.locals.orderIndex
    orders.splice(index, 1)
    res.sendStatus(204)
    
}

function list (req, res, next) {
    res.json({ data: orders })
}

module.exports = {
    create: [
        dataHas('deliverTo', 'Order'), 
        dataHas('mobileNumber', 'Order'), 
        dataHas('dishes', 'Order'), 
        dishesValidator, 
        dishValidator, 
        create, 
    ],
    read: [
        orderExists, 
        read, 
    ],
    update: [
        orderExists, 
        orderIdValidator, 
        dataHas('deliverTo', 'Order'), 
        dataHas('mobileNumber', 'Order'), 
        dataHas('status', 'Order'), 
        dataHas('dishes', 'Order'), 
        dishesValidator, 
        dishValidator, 
        orderStatusValidator, 
        orderDeliveredValidator, 
        update,
    ],
    delete: [
        orderExists,
        pendingChecker,  
        destroy, 
    ],
    list
}