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

// Checks if the provided dishes property is an array with a length greater than 0.
const dishesValidator = (req, res, next) => {
    // Dishes property retrieved from request.body
    const { data: { dishes } = {} } = req.body
    // Property is checked for length and being an array
    if (dishes.length > 0 && Array.isArray(dishes)) {
        next()
    } else {
        // If the validation fails, a 400 error is returned
        next({
            status: 400, 
            message: `Order must include at least one dish`
        })
    }
}

// Checks that each dish within the dishes property has a quantity property that is an integer greater than 0
const dishValidator = (req, res, next) => {
    // Dishes property retrieved from request.body
    const { data: { dishes } = {} } = req.body
    // Each dish is check for a quantity property that is an integer greater than 0
    const faultyQualityIndex = dishes.findIndex((dish) => 
        !dish.hasOwnProperty('quantity') || 
        !Number.isInteger(dish.quantity) ||
        dish.quantity <= 0)
    faultyQualityIndex === -1 ? (
        next()
    ) : (
        // If the validation fails, a 400 status is returned with a message containing the index of the faulty dish
        next({
            status: 400, 
            message: `Dish ${faultyQualityIndex} must have a quantity that is an integer greater than 0`
        })
    )

}

// Checks that the provided ID matched the ID from the route
const orderIdValidator = (req, res, next) => {
    // Route ID retrieved from the request.params
    const { orderId } = req.params
    // Given ID is recieved from the request.body
    const { data: { id } = {} } = req.body
    // If there is not a given ID, the validation is cleared
    !id ? (
        next()
    ) : (
        // If there is a given ID, it is compared to the route ID
        id === orderId ? (
            next()
        ) : (
            // If the given ID faisl the validation, a 400 status is returned with a message explaining the discrepency
            next({
                status: 400, 
                message: `Order id does not match route id. order: ${id}, Route: ${orderId}`
            })
        )
    )
}

// Checks that the status property is one of four allowed statuses
const orderStatusValidator = (req, res, next) => {
    // Status property received from the request.body
    const { data: { status } = {} } = req.body
    // Allowed statuses
    const validStatus = [
        'pending', 
        'preparing', 
        'out-for-delivery', 
        'delivered', 
    ]
    // Status is checked against the allowed statuses
    validStatus.includes(status) ? (
        next()
    ) : (
        // If the validation fails, a 400 status is returned wiht a list of the allowed statuses
        next({
            status: 400,
            message: `Order must have a status of ${validStatus.join(', ')}`
        })
    )
}

// Check that the given order has not been delivered
const orderDeliveredValidator = (req, res, next) => {
    // Status retrieved from the request.body
    const { data: { status } = {} } = req.body
    status !== 'delivered' ? (
        next()
    ) : (
        // If the order has been delivered, a 400 status is returned.
        next({
            status: 400, 
            message: `A delivered order cannot be changed`
        })
    )
}

// Checks that the given order is pending
const pendingChecker = (req, res, next) => {
    // Order retrieved from response.locals
    const order = res.locals.foundOrder
    // Order status checked for pending value
    order.status === 'pending' ? (
        next()
    ) : (
        // If the order status is not pending, a 400 status is returned.
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