const {filter, orderBy, values} = require('lodash')

const Pizza = require('../models/pizza')
const ImageStore = require('../lib/imageStore')
const PizzaStore = require('./pizzaStore')


async function create(name, toppings, img, username) {
    const imgUrl = await ImageStore.save(name.replace(/ /g, '-'), img)
    const pizza = new Pizza(name, toppings, imgUrl, username)
    return PizzaStore.create(prepPizza(pizza))
}

// for mocks that don't need pizza images saved
function batchImport(name, toppings, imgUrl, username) {
    const pizza = new Pizza(name, toppings, imgUrl, username)
    PizzaStore.create(prepPizza(pizza))
}

async function getForUser(username) {
    return PizzaStore.findAll({
        where: {
            username: username
        },
        raw: true
    }).then(debriefPizzas)
}

async function getRecent() {
    return PizzaStore.findAll({
        order: [['created', 'DESC']],
        limit: 4,
        raw: true
    }).then(debriefPizzas)
}

async function get(pizzaId) {
    return PizzaStore.findOne({
        where: {
            id: pizzaId
        },
        raw: true
    }).then(debriefPizza)
}

function prepPizza(pizza) {
    return {
        ...pizza,
        toppings: JSON.stringify(pizza.toppings)
    }
}

function debriefPizza(pizza) {
    return {
        ...pizza,
        toppings: JSON.parse(pizza.toppings)
    }
}

function debriefPizzas(pizzas) {
    return pizzas.map(debriefPizza)
}

module.exports = {
    batchImport,
    create,
    get,
    getForUser,
    getRecent
}
