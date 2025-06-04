const express = require('express');
const { Camper, Place, Routes, RoutesCampers } = require('../db/models');


const routRouter = express.Router();


routRouter.get('/:id', async (req, res) => {
  const {id} = req.params;
  try {
    const findRoute = await RoutesCampers.findAll({
      where: { routId: id },
      include: [
      {
        model: Routes,
      },
      {
        model: Camper,
      },
      {
        model: Place,
      },

    ],
    });
    if (findRoute) {
      let day = {}
      let resultArr = []
      for (let i = 0; i<findRoute.length; i++) {
        if (day[findRoute[i].day] === undefined) {
          day[findRoute[i].day] = [findRoute[i]]

        } else {
          day[findRoute[i].day].push(findRoute[i])
        }
        
      }
      // console.log(routArr);
      // day.keys(obj).forEach(function(key) {
      //   console.log(key, obj[key]);
      // });
      Object.keys(day).forEach((key)=>resultArr.push(day[key]));
      res.json(resultArr)
    } else {

      res.json({msg: 'такого маршрута нет'});
    }


  } catch (error) {
    console.log(error);
    res.json({err: error})
  }
});







module.exports = routRouter;
