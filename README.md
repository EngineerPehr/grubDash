# GrubDash
### Written by Pehr Lofgreen

## Introduction

GrubDash is an app that gives the user full CRUDL functionality for single dishes as well as orders of dishes. The front-end is in a separate repo provided by Thinkful. A forked copy can be found [here](https://github.com/EngineerPehr/grubDashFrontend).

The following directories and files were provided by Qualified and were not edited in any manner:
- `data` directory
- `test` directory
- `server.js`
- `errorHandler.js`
- `notFound.js`
- `nextId.js`

The only edits to `app.js` were the inclusions of the routers from `dishes.router.js` and `orders.routers.js`.

## dishes

The dishes directory contains two files: `dishes.router.js` and `dishes.controller.js`. These are contain the routes and controls for the dish data within the API.

### dishes.router.js

This file imports `Router` from Express, the controller from `dishes.controller.js`, and `methodNotAllowed` from the `errors` directory. It then uses these imports to create two routes: a root route (`/`) and a dish-specific route (`/:dishId`). The root route has `GET` and `POST` methods, with all other methods being forbidden via `methodNotAllowed`. The dish-specific route has `GET` and `PUT` methods, with all other methods being forbidden via `methodNotAllowed`.

### dishes.controller.js

This file contains three validation functions and four of the CRUDL functions, namely `create`, `read`, `update` and `list`. Dishes cannot be deleted once added, so there is no delete function. The data is imported from `dishes-data.js`, as well as two helper functions from the `utils` directory: `dataHas` and `nextId`.

#### dishExists

This is a validation function that checks if a specified dish id exists. The id is received from the `request.params`. That id is then compared to the id's within the dish data array via the `.find()` and `.findIndex()` methods. If found, the dish object and index are set to the `response.locals`. This allows the object to be accessed by other functions down the path. If the id does not match an existing id, a `404` status is returned along with a message identifying the id that could not be found.

#### priceValidator

This is a validation function that checks if the price given for either creating or updating a dish object is valid. It receives the price property from the `request.body`. If the price is an integer greater than 0, the price property clears the validation. If it is not an integer or is less than or equal to 0, it fails the validation. At that point, a `400` status is returned with a message explaining a valid price property.

#### dishIdValidator

This is a validation function that checks if the ID property provided by the `request.body` matches the route ID provided by the `request.params`. If the two IDs match, then the validator is cleared. If not, then a `400` status is returned with a message explaining the discrepency. Note: The ID property is not required for the `update` method, so this validator is automatically cleared if there is no ID property in the `request.body`.

#### create

This function creates and adds a dish object to the API. The data in the `request.body` is used to create the new dish. `nextId` is used to create a unique id for the dish. Once the dish is added to the API, the user is given a confirmation response. All validation is done outside of the function.

#### read

This function retrieves a specific dish from the API. It does this by using the `response.locals` that `dishExists` set up. `dishExists` handles the validation, so this function just responds with the dish object.

#### update

This function updates the data within a specific dish object. It recieves the dish from `response.locals` and gets the updated data from the `request.body`. It updates the object and then returns the updated object as confirmation. All validation is done outside of the function.

#### delete

Deleting existing dishes is not allowed, so there is no delete function for the dishes data.

#### list

Retrieves all the dish data from the API. No validation is required.

#### module.exports

The CRUDL functions are exported as an object with all of the required validation.

## Orders

The orders directory contains two files: `orders.router.js` and `orders.controller.js`. These are contain the routes and controls for the order data within the API.

### orders.router.js

This file imports `Router` from Express, the controller from `orders.controller.js`, and `methodNotAllowed` from the `errors` directory. It then uses these imports to create two routes: a root route (`/`) and a order-specific route (`/:orderId`). The root route has `GET` and `POST` methods, with all other methods being forbidden via `methodNotAllowed`. The order-specific route has `GET`,`PUT`, and `DELETE` methods, with all other methods being forbidden via `methodNotAllowed`.

### orders.controller.js

This file contains seven validation functions and all five of the CRUDL functions.The data is imported from `orders-data.js`, as well as two helper functions from the `utils` directory: `dataHas` and `nextId`.

#### orderExists

This is a validation function that checks if a specified order id exists. The id is received from the `request.params`. That id is then compared to the id's within the order data array via the `.find()` and `.findIndex()` methods. If found, the order object and index are set to the `response.locals`. This allows the object to be accessed by other functions down the path. If the id does not match an existing id, a `404` status is returned along with a message identifying the id that could not be found.

#### dishesValidator

This is a validation function that checks if the dishes property is an array with at least one dish in it. The dishes property is retrieved from the `request.body`. It is then checked for a length greater than 0, and that it is an array (via the `Array.isArray()` method). If the provided dishes property fails, a 400 status is returned.

#### dishValidator

This is a validation function that checks if each dish within the dishes property has a quantity property that is an integer greater than 0. The dishes property is an array of complete dish objects, rather than references to the dishes in `dishes-data.js`. As such, once the dishes property is retrieved from the `request.body`, it is validated via the `.findIndex()` method. This is done so that a dish that fails the validation has its index returned with the `400` status.

#### orderIdValidator

This is a validation function that checks if the ID property provided by the `request.body` matches the route ID provided by the `request.params`. If the two IDs match, then the validator is cleared. If not, then a `400` status is returned with a message explaining the discrepency. Note: The ID property is not required for the `update` function, so this validator is automatically cleared if there is no ID property in the `request.body`.

#### orderStatusValidator

This is a validation function that checks if the given status is one of four allowed statuses: `pending`, `preparing`, `out-for-delivery`, or `delivered`. If the given status is not one of the allowed statuses, a `400` status is returned with message listing the approved statuses.

#### orderDeliveredValidator

This is a validation function that checks if the given order has been delivered. If it has, a `400` status is returned with an explanation that delivered orders cannot be modified.

#### pendingChecker

This is a validation function that checks if the given order is pending. This is specifically for the `DELETE` method. If it is not pending, the order cannot be deleted. As such, a `400` status is returned with an explanation that only pending orders can be deleted.

#### create

This function creates and adds an order object to the API. The data in the `request.body` is used to create the new order. `nextId` is used to create a unique id for the order. Once the order is added to the API, the user is given a confirmation response. All validation is done outside of the function.

#### read

This function retrieves a specific order from the API. It does this by using the `response.locals` that `orderExists` set up. `orderExists` handles the validation, so this function just responds with the order object.

#### update

This function updates the data within a specific order object. It recieves the order from `response.locals` and gets the updated data from the `request.body`. It updates the object and then returns the updated object as confirmation. All validation is done outside of the function.

#### destroy

This function removes a given order object from the API. It returns a `204` status as confirmation. All validation is done outside of the function.

#### list

Retrieves all the order data from the API. No validation is required.

#### module.exports

The CRUDL functions are exported as an object with all of the required validation.

## Other Functions

#### dataHas

This is a validation function that checks if a given property is within the `request.body`. If the property is not found, it returns a `400` status and a message specifying the missing property. This is used by both `dishes.controller.js` and `orders.controllers.js`, so it imported from the `utils` directory.

#### methodNotAllowed

This is an error handler function that returns a 405 status and a message that the attempted HTTP method is not allowed. It is used by both `dishes.router.js` and `orders.router.js`, so it is imported from the `errors` directory.
