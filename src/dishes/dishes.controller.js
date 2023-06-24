const dishes = require('../data/dishes-data')
const dataHas = require('../utils/dataHas')
const nextId = require('../utils/nextId')

function dishExists (req, res, next) {
    const { dishId } = req.params
    const foundDish = dishes.find((dish) => dish.id === dishId)
    const dishIndex = dishes.findIndex((dish) => dish.id === dishId)
    foundDish ? (
        res.locals.dish = foundDish, 
        res.locals.index = dishIndex, 
        next()
    ) : (
        next({
            status: 404,
            message: `Dish id not found: ${dishId}`
        })
    )
}

function priceValidatior (req, res, next) {
    const { data: { price } = {} } = req.body
        if (price > 0 && Number.isInteger(price)) {
            next()
        } else {
            next({
                status: 400, 
                message: `Dish must have a price that is an integer greater than 0`
            })
        }
 
}

function dishIdValidator (req, res, next) {
    const { dishId } = req.params
    const { data: { id } = {} } = req.body
    !id ? (
        next()
    ) : (
        id === dishId ? (
            next()
        ) : (
            next({
                status: 400, 
                message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`
            })
        )
    )
}

function create (req, res, next) {
    const { data: { name, description, price, image_url } = {} } = req.body
    const id = nextId()
    const newDish = {
        id, 
        name, 
        description, 
        price, 
        image_url, 
    }
    dishes.push(newDish)
    res.status(201).json({ data: newDish})
}

function read (req, res, next) {
    const dish = res.locals.dish
    res.json({ data: dish })
}

function update (req, res, next) {
    const dish = res.locals.dish
    const { data: { name, description, price, image_url } = {} } = req.body
    dish.name = name
    dish.description = description
    dish.price = price
    dish.image_url = image_url

    res.json({ data: dish })
}

function list (req, res, next) {
    res.json({ data: dishes})
}

module.exports = {
    create: [
        dataHas('name', 'Dish'), 
        dataHas('description', 'Dish'), 
        dataHas('price', 'Dish'), 
        dataHas('image_url', 'Dish'),
        priceValidatior, 
        create, 
    ],
    read: [
        dishExists, 
        read, 
    ],
    update: [
        dishExists,
        dishIdValidator, 
        dataHas('name', 'Dish'), 
        dataHas('description', 'Dish'), 
        dataHas('price', 'Dish'), 
        dataHas('image_url', 'Dish'),
        priceValidatior, 
        update,
    ],
    list,
}