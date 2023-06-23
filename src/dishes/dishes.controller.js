const path = require('path')
const dishes = require(path.resolve('src/data/dishes-data'))
const nextId = require('../utils/nextId')

const dishExists = (req, res, next) => {
    const { dishId } = req.params
    const foundDish = dishes?.find((dish) => dish.id === Number(dishId))
    const dishIndex = dishes?.findIndex((dish) => dish.id === Number(dishId))
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

const dataHas = (propertyName) => {
    return (req, res, next) => {
        const { data = {} } = req.body
        data[propertyName] ? (
            next()
        ) : (
            next({
                status: 400, 
                message: `Dish must include a ${propertyName}`
            })
        )
    }
}

const priceValidatior = (req, res, next) => {
    const { data: { price } = {} } = req.body
    (price > 0 && Number.isInteger(price)) ? (
        next()
    ) : (
        next({
            status: 400, 
            message: `Dish must have a price that is an integer greater than 0`
        })
    )
}

const idValidator = (req, res, next) => {
    const { dishId } = req.params
    const { data: { id } = {} } = req.body
    id === Number(dishId) ? (
        next()
    ) : (
        next({
            status: 400, 
            message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`
        })
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
        dataHas('name'), 
        dataHas('description'), 
        dataHas('price'), 
        dataHas('image_url'),
        priceValidatior, 
        create, 
    ],
    read: [
        dishExists, 
        read, 
    ],
    update: [
        dishExists,
        idValidator, 
        dataHas('name'), 
        dataHas('description'), 
        dataHas('price'), 
        dataHas('image_url'),
        priceValidatior, 
        update,
    ],
    list,
}