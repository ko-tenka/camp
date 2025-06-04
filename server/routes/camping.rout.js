const express = require('express');
const { Camper, Blank } = require('../db/models');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { v4: uuidv4 } = require('uuid'); 

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
         const uniqueSuffix = uuidv4() + path.extname(file.originalname);
        cb(null, uniqueSuffix);
    }
});

const upload = multer({ storage: storageConfig });


router.get('/campings', async (req, res) => {
  console.log(req.query);

  const limit = 3
  const offset = (Number(req.query.page)-1)*limit
  try {
    if (req.query.page>=1) {
      const allCamper = await Camper.findAll({
        limit,
        offset
      });
      res.json(allCamper);
    } else {
      res.json({err: 'error'})
    }

  } catch (error) {
    console.log(error);
    res.json({err: error})
  }
});

router.get('/', async (req, res) => {
  try {
    const allCamper = await Camper.findAll({
      order: [['id', 'DESC']],
    });
    res.json(allCamper);
  } catch (error) {
    console.log(error);
    res.json({err: error})
  }
});

router.get('/:id', async (req, res) => {
  console.log('Зашли в ручку');
  try {
    const id = req.params.id;
    const camper = await Camper.findByPk(id);
    res.json(camper);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ---------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------

router.get('/parthner/campers', async (req, res) => {
  const {userId} = req.session;
  console.log(userId);
  try {
    const allCamper = await Camper.findAll({
      where: {camperId: userId},
      order: [['id', 'DESC']],
    });
    res.json(allCamper);
  } catch (error) {
    console.log(error);
    res.json({err: error})
  }
});

router.post('/parthner/img', upload.single('img'), async (req, res) => {
  try {
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded!' });
    }
    const {userId} = req.session
    const findBlank = await Blank.findOne({
      where: { camperId: userId },
    }) 
    if (findBlank){
       findBlank.img = req.file.filename;
      findBlank.save();
    } else {
      const newBlank = await Blank.create({
        camperId: userId,
        img: req.file.filename
      })
    }
    res.json(req.file.filename)
  } catch (err) {
    console.error('Ошибка загрузки фотографии:', err);
    res.status(500).json({ error: 'Ошибка загрузки фотографии' });
  }
});

router.post('/parthner/del/img', async (req, res) => {
  try {
    if (req.body.length) {
      const {userId} = req.session
      const findBlank = await Blank.findOne({
        where: { camperId: userId },
      })
      findBlank.img = null;
      findBlank.save();
      for(let i = 0; i<req.body.length;i++){
        const imagePath = path.join(__dirname, '../images', req.body[i].name);		
			  if (fs.existsSync(imagePath)) {
				fs.unlinkSync(imagePath);
			}
      }
    }

		res.json({ success: 'Изображение пользователя удалено' });
  
  } catch (err) {
    console.error('Ошибка загрузки фотографии:', err);
    res.status(500).json({ error: 'Ошибка загрузки фотографии' });
  }
});


router.post('/parthner/imgall', upload.single('img'), async (req, res) => {
  try {
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded!' });
    }
    const {userId} = req.session
    const findBlank = await Blank.findOne({
      where: { camperId: userId },
    }) 
    if (findBlank){

      if (findBlank.img2 === null) {
        findBlank.img2 = req.file.filename;
        findBlank.save();
      } else {

         if (findBlank.img2.includes(',')) {
          let arr = findBlank.img2.split(',')
          arr.push(req.file.filename)
          findBlank.img2 = arr.join(',')
          findBlank.save();
        } else {
          let arr = findBlank.img2.split()
          arr.push(req.file.filename)
          findBlank.img2 = arr.join(',')
          findBlank.save();
        }

      }

    } else {
      const newBlank = await Blank.create({
        camperId: userId,
        img2: req.file.filename
      })
    }
    res.json(req.file.filename)
  } catch (err) {
    console.error('Ошибка загрузки фотографии:', err);
    res.status(500).json({ error: 'Ошибка загрузки фотографии' });
  }
});

router.post('/parthner/del/imgall', async (req, res) => {
  try {
    if (req.body.length) {
      const {userId} = req.session
      const findBlank = await Blank.findOne({
        where: { camperId: userId },
      })
 
      for(let i = 0; i<req.body.length;i++){
        if (findBlank.img2.includes(',')) {
          const arr = findBlank.img2.split(',')
          const fillterArr = arr.filter((el)=>el !== req.body[i].name)
          findBlank.img2 = fillterArr.join(',')
          findBlank.save();
        } else {
          findBlank.img2 = null
          findBlank.save();
        }
        const imagePath = path.join(__dirname, '../images', req.body[i].name);		
			  if (fs.existsSync(imagePath)) {
				fs.unlinkSync(imagePath);
			}
      }
    }

		res.json({ success: 'Изображение пользователя удалено' });
  
  } catch (err) {
    console.error('Ошибка загрузки фотографии:', err);
    res.status(500).json({ error: 'Ошибка загрузки фотографии' });
  }
});

router.get('/parthner/clearblank', async (req, res)=>{
  try {
    const {userId} = req.session
    const findBlank = await Blank.findOne({
      where: { camperId: userId },
    })
    if (findBlank){
      const res = await Blank.destroy({ where: { camperId: userId } });
    }
    res.end()
  } catch (error) {
    console.log(error);
  }
})



module.exports = router;
