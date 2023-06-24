# GrubDash
## Written by Pehr Lofgreen

### Introduction

GrubDash is an app that gives the user full CRUDL functionality for single dishes as well as orders of dishes. The front-end is in a separate repo provided by Thinkful. A forked copy can be found [here](https://github.com/EngineerPehr/grubDashFrontend).

The following directories and files were provided by Qualified and were not edited in any manner:
- `data` directory
- `test` directory
- `server.js`
- `errorHandler.js`
- `notFound.js`
- `nextId.js`

The only edits to `app.js` were the inclusions of the routers from `dishes.router.js` and `orders.routers.js`.

### dishes

The dishes directory contains two files: `dishes.router.js` and `dishes.controller.js`. These are contain the routes and controls for the dish data within the API.

#### dishes.router.js

This file imports `Router` from Express, the controller from `dishes.controller.js`, and `methodNotAllowed` from the `errors` directory. It then uses these imports to create two routes: a root route (`/`) and a dish-specific route (`/:dishId`). The root route has `GET` and `POST` methods, with all other methods being forbidden via `methodNotAllowed`. The dish-specific route has `GET` and `PUT` methods, with all other methods being forbidden via `methodNotAllowed`.

#### dishes.controller.js