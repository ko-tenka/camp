const express = require('express');
const adminRouter = express.Router();
const { Place, Routes, Camper, Blank } = require('../db/models');


adminRouter.post('/place', async (req, res) => {
	
	try {
		const place = await Place.create(req.body);
    res.json( place)
    

	} catch (error) {
    res.status(400).json({ error: error.message });
  }
});

adminRouter.post('/route', async (req, res) => {
	
	console.log('route:', req.body); //!

 
  try {
    const route = await Routes.create(req.body);
    res.json(route);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

adminRouter.post('/camper', async (req, res) => {
  const {userId} = req.session;
  try {
    const findBlank = await Blank.findOne({
      where: { camperId: userId },
    })
    console.log(findBlank);
    const camperData = {
      ...req.body,
      img: findBlank.img,
      img2: findBlank.img2,
      camperId: userId,
    };
    const camper = await Camper.create(camperData); 
    const res = await Blank.destroy({ where: { camperId: userId } });
    res.json(camper);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error);
  }
});


module.exports = adminRouter;