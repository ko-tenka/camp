const express = require('express');
const { Routes } = require('../db/models');

const routesRouter = express.Router();

routesRouter.get('/', async (req, res) => {
  try {
    const allRoute = await Routes.findAll();
    res.json(allRoute);
  } catch (error) {
    console.log(error);
    res.json({err: error})
  }
});




module.exports = routesRouter;