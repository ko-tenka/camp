const express = require('express');
const { Booking, Camper, Routes } = require('../db/models');
const { Op } = require('sequelize');

const checkBookingMainPage = express.Router();

// http://localhost:3000/allbooking?start=${parsDateStart}&end=${parsDateEnd}&shelter=${shelterCount}&camper=${camperCount}
checkBookingMainPage.post('/', async (req, res) => {
    const {parsDateStart, parsDateEnd} = req.body
    const startDate = new Date(parsDateStart);
    const endDate = new Date(parsDateEnd);
    const shelterCount = Number(req.body.shelterCount);
    const camperCount = Number(req.body.camperCount);
    let booking = {};
    let shelterArr = [];
    let camperArr = [];
    const response = [] 
    let camperArrId = []
    let routArr = []
    
    try {
    
    
        const findAllRoutes = await Routes.findAll({
        include: {
            model: Camper,
            attributes: ['id'],
          },
        })
      if (findAllRoutes) {
        for (let routI = 0; routI<findAllRoutes.length; routI++){
            camperArrId = []
            routArr = []
            const routObj = {rout: findAllRoutes[routI]}
            for (let c = 0; c<findAllRoutes[routI].Campers.length; c++){
                camperArrId.push(findAllRoutes[routI].Campers[c].id)
            }
        
        routArr.push(routObj)
        
        const findAllCamper = await Camper.findAll({
        where: {id: camperArrId}
            })
      if (findAllCamper) {
        for (let campI = 0; campI<findAllCamper.length; campI++) {
          routArr.push({id: findAllCamper[campI].id, shelter: 'места есть', shelterCount: 0, camper: 'места есть', camperCount: 0})
          
          const where = {
            camperId: findAllCamper[campI].id,
            [Op.or]: [
              {
                dateCheckIn: {
                  [Op.between]: [startDate, endDate],
                },
              },
              {
                dateDeparture: {
                  [Op.between]: [startDate, endDate],
                },
              },
            ],
          };
          const bookingRange = await Booking.findAll({
            where,
            order: [['id', 'ASC']],
            include: {
              model: Camper,
              attributes: ['shelterCount', 'camperCount', 'id'],
            },
          });
      if (bookingRange.length>0) {
        for (let i = 0; i < bookingRange.length; i++) {
          if (booking[bookingRange[i].camperId] === undefined) {
            booking[bookingRange[i].camperId] = {};
            routArr[campI+1].shelterCount = bookingRange[i].Camper.shelterCount;
            routArr[campI+1].camperCount = bookingRange[i].Camper.camperCount;
            let days = 5;
            // ----------------------------------------------------------------далее поправлено
            if (
              Date.parse(bookingRange[i].dateCheckIn) <= startDate &&
              Date.parse(bookingRange[i].dateDeparture) >= endDate
            ) {
              console.log('одинодинодин111111111111111');
              days = (endDate - startDate) / 1000 / 60 / 60 / 24;
              if (days === 0) {
                days = 1;
              }
  
              for (let b = 0; b < days; b++) {
                //начало цикла for для собирания мест по датам
                const keyDay = new Date(
                  startDate.setDate(startDate.getDate() + b)
                );
                if (booking[bookingRange[i].camperId][keyDay] === undefined) {
                  booking[bookingRange[i].camperId][keyDay] = {};
                  booking[bookingRange[i].camperId][keyDay].shelter =
                    shelterCount + bookingRange[i].shelterCount;
                  if (
                    booking[bookingRange[i].camperId][keyDay].shelter >
                    bookingRange[i].Camper.shelterCount
                  ) {
                    routArr[campI+1].shelter = 'мест нет';
                    routArr[campI+1].shelterCount = 0;
                  } else {
                    shelterArr.push(
                      bookingRange[i].Camper.shelterCount -
                        booking[bookingRange[i].camperId][keyDay].shelter
                    );
                  }
                  booking[bookingRange[i].camperId][keyDay].camper =
                    camperCount + bookingRange[i].camperCount;
                  if (
                    booking[bookingRange[i].camperId][keyDay].camper >
                    bookingRange[i].Camper.camperCount
                  ) {
                    routArr[campI+1].camper = 'мест нет';
                    routArr[campI+1].camperCount = 0;
                  } else {
                    camperArr.push(
                      bookingRange[i].Camper.camperCount -
                        booking[bookingRange[i].camperId][keyDay].camper
                    );
                  }
                } else {
                  booking[bookingRange[i].camperId][keyDay].shelter +=
                    shelterCount;
                  if (
                    booking[bookingRange[i].camperId][keyDay].shelter >
                    bookingRange[i].Camper.shelterCount
                  ) {
                    routArr[campI+1].shelter = 'мест нет';
                    routArr[campI+1].shelterCount = 0;
                  } else {
                    shelterArr.push(
                      bookingRange[i].Camper.shelterCount -
                        booking[bookingRange[i].camperId][keyDay].shelter
                    );
                  }
                  booking[bookingRange[i].camperId][keyDay].camper += camperCount;
                  if (
                    booking[bookingRange[i].camperId][keyDay].camper >
                    bookingRange[i].Camper.camperCount
                  ) {
                    routArr[campI+1].camper = 'мест нет';
                    routArr[campI+1].camperCount = 0;
                  } else {
                    camperArr.push(
                      bookingRange[i].Camper.camperCount -
                        booking[bookingRange[i].camperId][keyDay].camper
                    );
                  }
                }
              } //окончание цикла for для собирания мест по датам
              // ---------------------------------------------------------------------------------------------- далее поправлено
            } else if (
              Date.parse(bookingRange[i].dateCheckIn) > startDate &&
              Date.parse(bookingRange[i].dateDeparture) < endDate
            ) {
              days =
                (Date.parse(bookingRange[i].dateDeparture) -
                  Date.parse(bookingRange[i].dateCheckIn)) /
                1000 /
                60 /
                60 /
                24;
              console.log('одинодинодин22222222222222');
              if (days === 0) {
                days = 1;
              }
              for (let b = 0; b < days; b++) {
                //начало цикла for для собирания мест по датам
                const dayt = new Date(Date.parse(bookingRange[i].dateCheckIn));
                const keyDay = new Date(dayt.setDate(dayt.getDate() + b));
                if (booking[bookingRange[i].camperId][keyDay] === undefined) {
                  booking[bookingRange[i].camperId][keyDay] = {};
                  booking[bookingRange[i].camperId][keyDay].shelter =
                    shelterCount + bookingRange[i].shelterCount;
                  if (
                    booking[bookingRange[i].camperId][keyDay].shelter >
                    bookingRange[i].Camper.shelterCount
                  ) {
                    routArr[campI+1].shelter = 'мест нет';
                    routArr[campI+1].shelterCount = 0;
                  } else {
                    shelterArr.push(
                      bookingRange[i].Camper.shelterCount -
                        booking[bookingRange[i].camperId][keyDay].shelter
                    );
                  }
                  booking[bookingRange[i].camperId][keyDay].camper =
                    camperCount + bookingRange[i].camperCount;
                  if (
                    booking[bookingRange[i].camperId][keyDay].camper >
                    bookingRange[i].Camper.camperCount
                  ) {
                    routArr[campI+1].camper = 'мест нет';
                    routArr[campI+1].camperCount = 0;
                  } else {
                    camperArr.push(
                      bookingRange[i].Camper.camperCount -
                        booking[bookingRange[i].camperId][keyDay].camper
                    );
                  }
                } else {
                  booking[bookingRange[i].camperId][keyDay].shelter +=
                    shelterCount;
                  if (
                    booking[bookingRange[i].camperId][keyDay].shelter >
                    bookingRange[i].Camper.shelterCount
                  ) {
                    routArr[campI+1].shelter = 'мест нет';
                    routArr[campI+1].shelterCount = 0;
                  } else {
                    shelterArr.push(
                      bookingRange[i].Camper.shelterCount -
                        booking[bookingRange[i].camperId][keyDay].shelter
                    );
                  }
                  booking[bookingRange[i].camperId][keyDay].camper += camperCount;
                  if (
                    booking[bookingRange[i].camperId][keyDay].camper >
                    bookingRange[i].Camper.camperCount
                  ) {
                    routArr[campI+1].camper = 'мест нет';
                    routArr[campI+1].camperCount = 0;
                  } else {
                    camperArr.push(
                      bookingRange[i].Camper.camperCount -
                        booking[bookingRange[i].camperId][keyDay].camper
                    );
                  }
                }
              } //окончание цикла for для собирания мест по датам
              // ---------------------------------------------------------------------------------------------------- далее поправлено
            } else if (
              Date.parse(bookingRange[i].dateCheckIn) > startDate &&
              Date.parse(bookingRange[i].dateDeparture) >= endDate
            ) {
              days =
                (endDate - Date.parse(bookingRange[i].dateCheckIn)) /
                1000 /
                60 /
                60 /
                24;
              console.log('одинодинодин33333333333');
              if (days === 0) {
                days = 1;
              }
  
              for (let b = 0; b < days; b++) {
                //начало цикла for для собирания мест по датам
                const dayt = new Date(Date.parse(bookingRange[i].dateCheckIn));
                const keyDay = new Date(dayt.setDate(dayt.getDate() + b));
                if (booking[bookingRange[i].camperId][keyDay] === undefined) {
                  booking[bookingRange[i].camperId][keyDay] = {};
                  booking[bookingRange[i].camperId][keyDay].shelter =
                    shelterCount + bookingRange[i].shelterCount;
  
                  if (
                    booking[bookingRange[i].camperId][keyDay].shelter >
                    bookingRange[i].Camper.shelterCount
                  ) {
                    routArr[campI+1].shelter = 'мест нет';
                    routArr[campI+1].shelterCount = 0;
                  } else {
                    shelterArr.push(
                      bookingRange[i].Camper.shelterCount -
                        booking[bookingRange[i].camperId][keyDay].shelter
                    );
                  }
                  booking[bookingRange[i].camperId][keyDay].camper =
                    camperCount + bookingRange[i].camperCount;
                  if (
                    booking[bookingRange[i].camperId][keyDay].camper >
                    bookingRange[i].Camper.camperCount
                  ) {
                    routArr[campI+1].camper = 'мест нет';
                    routArr[campI+1].camperCount = 0;
                  } else {
                    camperArr.push(
                      bookingRange[i].Camper.camperCount -
                        booking[bookingRange[i].camperId][keyDay].camper
                    );
                  }
                } else {
                  booking[bookingRange[i].camperId][keyDay].shelter +=
                    shelterCount;
                  if (
                    booking[bookingRange[i].camperId][keyDay].shelter >
                    bookingRange[i].Camper.shelterCount
                  ) {
                    routArr[campI+1].shelter = 'мест нет';
                    routArr[campI+1].shelterCount = 0;
                  } else {
                    shelterArr.push(
                      bookingRange[i].Camper.shelterCount -
                        booking[bookingRange[i].camperId][keyDay].shelter
                    );
                  }
                  booking[bookingRange[i].camperId][keyDay].camper += camperCount;
                  if (
                    booking[bookingRange[i].camperId][keyDay].camper >
                    bookingRange[i].Camper.camperCount
                  ) {
                    routArr[campI+1].camper = 'мест нет';
                    routArr[campI+1].camperCount = 0;
                  } else {
                    camperArr.push(
                      bookingRange[i].Camper.camperCount -
                        booking[bookingRange[i].camperId][keyDay].camper
                    );
                  }
                }
              } //окончание цикла for для собирания мест по датам
  
              // ------------------------------------------------------------------------------------------------
            } else if (
              Date.parse(bookingRange[i].dateCheckIn) <= startDate &&
              Date.parse(bookingRange[i].dateDeparture) < endDate
            ) {
              days =
                (Date.parse(bookingRange[i].dateDeparture) - startDate) /
                1000 /
                60 /
                60 /
                24;
              console.log('одинодинодин44444444444');
              if (days === 0) {
                days = 1;
              }
  
              for (let b = 0; b < days; b++) {
                //начало цикла for для собирания мест по датам
                const dayt = new Date(Date.parse(bookingRange[i].dateCheckIn));
                const keyDay = new Date(dayt.setDate(dayt.getDate() + b));
                if (booking[bookingRange[i].camperId][keyDay] === undefined) {
                  booking[bookingRange[i].camperId][keyDay] = {};
                  booking[bookingRange[i].camperId][keyDay].shelter =
                    shelterCount + bookingRange[i].shelterCount;
  
                  if (
                    booking[bookingRange[i].camperId][keyDay].shelter >
                    bookingRange[i].Camper.shelterCount
                  ) {
                    routArr[campI+1].shelter = 'мест нет';
                    routArr[campI+1].shelterCount = 0;
                  } else {
                    shelterArr.push(
                      bookingRange[i].Camper.shelterCount -
                        booking[bookingRange[i].camperId][keyDay].shelter
                    );
                  }
                  booking[bookingRange[i].camperId][keyDay].camper =
                    camperCount + bookingRange[i].camperCount;
                  if (
                    booking[bookingRange[i].camperId][keyDay].camper >
                    bookingRange[i].Camper.camperCount
                  ) {
                    routArr[campI+1].camper = 'мест нет';
                    routArr[campI+1].camperCount = 0;
                  } else {
                    camperArr.push(
                      bookingRange[i].Camper.camperCount -
                        booking[bookingRange[i].camperId][keyDay].camper
                    );
                  }
                } else {
                  booking[bookingRange[i].camperId][keyDay].shelter +=
                    shelterCount;
                  if (
                    booking[bookingRange[i].camperId][keyDay].shelter >
                    bookingRange[i].Camper.shelterCount
                  ) {
                    routArr[campI+1].shelter = 'мест нет';
                    routArr[campI+1].shelterCount = 0;
                  } else {
                    shelterArr.push(
                      bookingRange[i].Camper.shelterCount -
                        booking[bookingRange[i].camperId][keyDay].shelter
                    );
                  }
                  booking[bookingRange[i].camperId][keyDay].camper += camperCount;
                  if (
                    booking[bookingRange[i].camperId][keyDay].camper >
                    bookingRange[i].Camper.camperCount
                  ) {
                    routArr[campI+1].camper = 'мест нет';
                    routArr[campI+1].camperCount = 0;
                  } else {
                    camperArr.push(
                      bookingRange[i].Camper.camperCount -
                        booking[bookingRange[i].camperId][keyDay].camper
                    );
                  }
                }
              } //окончание цикла for для собирания мест по датам
            } else if (
              Date.parse(bookingRange[i].dateCheckIn) > startDate &&
              Date.parse(bookingRange[i].dateDeparture) <= endDate
            ) {
              days =
                (Date.parse(bookingRange[i].dateDeparture) -
                  Date.parse(bookingRange[i].dateCheckIn)) /
                1000 /
                60 /
                60 /
                24;
              console.log('одинодинодин55555555555');
              if (days === 0) {
                days = 1;
              }
  
              for (let b = 0; b < days; b++) {
                //начало цикла for для собирания мест по датам
                const dayt = new Date(Date.parse(bookingRange[i].dateCheckIn));
                const keyDay = new Date(dayt.setDate(dayt.getDate() + b));
                if (booking[bookingRange[i].camperId][keyDay] === undefined) {
                  booking[bookingRange[i].camperId][keyDay] = {};
                  booking[bookingRange[i].camperId][keyDay].shelter =
                    shelterCount + bookingRange[i].shelterCount;
  
                  if (
                    booking[bookingRange[i].camperId][keyDay].shelter >
                    bookingRange[i].Camper.shelterCount
                  ) {
                    routArr[campI+1].shelter = 'мест нет';
                    routArr[campI+1].shelterCount = 0;
                  } else {
                    shelterArr.push(
                      bookingRange[i].Camper.shelterCount -
                        booking[bookingRange[i].camperId][keyDay].shelter
                    );
                  }
                  booking[bookingRange[i].camperId][keyDay].camper =
                    camperCount + bookingRange[i].camperCount;
                  if (
                    booking[bookingRange[i].camperId][keyDay].camper >
                    bookingRange[i].Camper.camperCount
                  ) {
                    routArr[campI+1].camper = 'мест нет';
                    routArr[campI+1].camperCount = 0;
                  } else {
                    camperArr.push(
                      bookingRange[i].Camper.camperCount -
                        booking[bookingRange[i].camperId][keyDay].camper
                    );
                  }
                } else {
                  booking[bookingRange[i].camperId][keyDay].shelter +=
                    shelterCount;
                  if (
                    booking[bookingRange[i].camperId][keyDay].shelter >
                    bookingRange[i].Camper.shelterCount
                  ) {
                    routArr[campI+1].shelter = 'мест нет';
                    routArr[campI+1].shelterCount = 0;
                  } else {
                    shelterArr.push(
                      bookingRange[i].Camper.shelterCount -
                        booking[bookingRange[i].camperId][keyDay].shelter
                    );
                  }
                  booking[bookingRange[i].camperId][keyDay].camper += camperCount;
                  if (
                    booking[bookingRange[i].camperId][keyDay].camper >
                    bookingRange[i].Camper.camperCount
                  ) {
                    routArr[campI+1].camper = 'мест нет';
                    routArr[campI+1].camperCount = 0;
                  } else {
                    camperArr.push(
                      bookingRange[i].Camper.camperCount -
                        booking[bookingRange[i].camperId][keyDay].camper
                    );
                  }
                }
              } //окончание цикла for для собирания мест по датам
            } //закрытие условия когда дата начала аренды и дата окончания аренды больше чем параметры бранирования
          } else {
            // -----------------------------------------------------граница условия когда в объекте есть уже id кампинга
  
            let days = 5;
            // ----------------------------------------------------------------далее поправлено
            if (
              Date.parse(bookingRange[i].dateCheckIn) <= startDate &&
              Date.parse(bookingRange[i].dateDeparture) >= endDate
            ) {
              console.log('двадвадва111111111111111');
              days = (endDate - startDate) / 1000 / 60 / 60 / 24;
              if (days === 0) {
                days = 1;
              }
  
              for (let b = 0; b < days; b++) {
                //начало цикла for для собирания мест по датам
                const keyDay = new Date(
                  startDate.setDate(startDate.getDate() + b)
                );
                if (booking[bookingRange[i].camperId][keyDay] === undefined) {
                  booking[bookingRange[i].camperId][keyDay] = {};
                  booking[bookingRange[i].camperId][keyDay].shelter =
                    shelterCount + bookingRange[i].shelterCount;
                  if (
                    booking[bookingRange[i].camperId][keyDay].shelter >
                    bookingRange[i].Camper.shelterCount
                  ) {
                    routArr[campI+1].shelter = 'мест нет';
                    routArr[campI+1].shelterCount = 0;
                  } else {
                    shelterArr.push(
                      bookingRange[i].Camper.shelterCount -
                        booking[bookingRange[i].camperId][keyDay].shelter
                    );
                  }
                  booking[bookingRange[i].camperId][keyDay].camper =
                    camperCount + bookingRange[i].camperCount;
                  if (
                    booking[bookingRange[i].camperId][keyDay].camper >
                    bookingRange[i].Camper.camperCount
                  ) {
                    routArr[campI+1].camper = 'мест нет';
                    routArr[campI+1].camperCount = 0;
                  } else {
                    camperArr.push(
                      bookingRange[i].Camper.camperCount -
                        booking[bookingRange[i].camperId][keyDay].camper
                    );
                  }
                } else {
                  booking[bookingRange[i].camperId][keyDay].shelter +=
                    bookingRange[i].shelterCount;
                  if (
                    booking[bookingRange[i].camperId][keyDay].shelter >
                    bookingRange[i].Camper.shelterCount
                  ) {
                    routArr[campI+1].shelter = 'мест нет';
                    routArr[campI+1].shelterCount = 0;
                  } else {
                    shelterArr.push(
                      bookingRange[i].Camper.shelterCount -
                        booking[bookingRange[i].camperId][keyDay].shelter
                    );
                  }
                  booking[bookingRange[i].camperId][keyDay].camper +=
                    bookingRange[i].camperCount;
                  if (
                    booking[bookingRange[i].camperId][keyDay].camper >
                    bookingRange[i].Camper.camperCount
                  ) {
                    routArr[campI+1].camper = 'мест нет';
                    routArr[campI+1].camperCount = 0;
                  } else {
                    camperArr.push(
                      bookingRange[i].Camper.camperCount -
                        booking[bookingRange[i].camperId][keyDay].camper
                    );
                  }
                }
              } //окончание цикла for для собирания мест по датам
              // ---------------------------------------------------------------------------------------------- далее поправлено
            } else if (
              Date.parse(bookingRange[i].dateCheckIn) > startDate &&
              Date.parse(bookingRange[i].dateDeparture) < endDate
            ) {
              days =
                (Date.parse(bookingRange[i].dateDeparture) -
                  Date.parse(bookingRange[i].dateCheckIn)) /
                1000 /
                60 /
                60 /
                24;
              console.log('двадвадва22222222222222');
              if (days === 0) {
                days = 1;
              }
              for (let b = 0; b < days; b++) {
                //начало цикла for для собирания мест по датам
                const dayt = new Date(Date.parse(bookingRange[i].dateCheckIn));
                const keyDay = new Date(dayt.setDate(dayt.getDate() + b));
                if (booking[bookingRange[i].camperId][keyDay] === undefined) {
                  booking[bookingRange[i].camperId][keyDay] = {};
                  booking[bookingRange[i].camperId][keyDay].shelter =
                    shelterCount + bookingRange[i].shelterCount;
                  if (
                    booking[bookingRange[i].camperId][keyDay].shelter >
                    bookingRange[i].Camper.shelterCount
                  ) {
                    routArr[campI+1].shelter = 'мест нет';
                    routArr[campI+1].shelterCount = 0;
                  } else {
                    shelterArr.push(
                      bookingRange[i].Camper.shelterCount -
                        booking[bookingRange[i].camperId][keyDay].shelter
                    );
                  }
                  booking[bookingRange[i].camperId][keyDay].camper =
                    camperCount + bookingRange[i].camperCount;
                  if (
                    booking[bookingRange[i].camperId][keyDay].camper >
                    bookingRange[i].Camper.camperCount
                  ) {
                    routArr[campI+1].camper = 'мест нет';
                    routArr[campI+1].camperCount = 0;
                  } else {
                    camperArr.push(
                      bookingRange[i].Camper.camperCount -
                        booking[bookingRange[i].camperId][keyDay].camper
                    );
                  }
                } else {
                  booking[bookingRange[i].camperId][keyDay].shelter +=
                    bookingRange[i].shelterCount;
                  if (
                    booking[bookingRange[i].camperId][keyDay].shelter >
                    bookingRange[i].Camper.shelterCount
                  ) {
                    routArr[campI+1].shelter = 'мест нет';
                    routArr[campI+1].shelterCount = 0;
                  } else {
                    shelterArr.push(
                      bookingRange[i].Camper.shelterCount -
                        booking[bookingRange[i].camperId][keyDay].shelter
                    );
                  }
                  booking[bookingRange[i].camperId][keyDay].camper +=
                    bookingRange[i].camperCount;
                  if (
                    booking[bookingRange[i].camperId][keyDay].camper >
                    bookingRange[i].Camper.camperCount
                  ) {
                    routArr[campI+1].camper = 'мест нет';
                    routArr[campI+1].camperCount = 0;
                  } else {
                    camperArr.push(
                      bookingRange[i].Camper.camperCount -
                        booking[bookingRange[i].camperId][keyDay].camper
                    );
                  }
                }
              } //окончание цикла for для собирания мест по датам
              // ---------------------------------------------------------------------------------------------------- далее поправлено
            } else if (
              Date.parse(bookingRange[i].dateCheckIn) > startDate &&
              Date.parse(bookingRange[i].dateDeparture) >= endDate
            ) {
              days =
                (endDate - Date.parse(bookingRange[i].dateCheckIn)) /
                1000 /
                60 /
                60 /
                24;
              console.log('двадвадва333333333333');
              if (days === 0) {
                days = 1;
              }
  
              for (let b = 0; b < days; b++) {
                //начало цикла for для собирания мест по датам
                const dayt = new Date(Date.parse(bookingRange[i].dateCheckIn));
                const keyDay = new Date(dayt.setDate(dayt.getDate() + b));
                if (booking[bookingRange[i].camperId][keyDay] === undefined) {
                  booking[bookingRange[i].camperId][keyDay] = {};
                  booking[bookingRange[i].camperId][keyDay].shelter =
                    shelterCount + bookingRange[i].shelterCount;
  
                  if (
                    booking[bookingRange[i].camperId][keyDay].shelter >
                    bookingRange[i].Camper.shelterCount
                  ) {
                    routArr[campI+1].shelter = 'мест нет';
                    routArr[campI+1].shelterCount = 0;
                  } else {
                    shelterArr.push(
                      bookingRange[i].Camper.shelterCount -
                        booking[bookingRange[i].camperId][keyDay].shelter
                    );
                  }
                  booking[bookingRange[i].camperId][keyDay].camper =
                    camperCount + bookingRange[i].camperCount;
                  if (
                    booking[bookingRange[i].camperId][keyDay].camper >
                    bookingRange[i].Camper.camperCount
                  ) {
                    routArr[campI+1].camper = 'мест нет';
                    routArr[campI+1].camperCount = 0;
                  } else {
                    camperArr.push(
                      bookingRange[i].Camper.camperCount -
                        booking[bookingRange[i].camperId][keyDay].camper
                    );
                  }
                } else {
                  booking[bookingRange[i].camperId][keyDay].shelter +=
                    bookingRange[i].shelterCount;
                  if (
                    booking[bookingRange[i].camperId][keyDay].shelter >
                    bookingRange[i].Camper.shelterCount
                  ) {
                    routArr[campI+1].shelter = 'мест нет';
                    routArr[campI+1].shelterCount = 0;
                  } else {
                    shelterArr.push(
                      bookingRange[i].Camper.shelterCount -
                        booking[bookingRange[i].camperId][keyDay].shelter
                    );
                  }
                  booking[bookingRange[i].camperId][keyDay].camper +=
                    bookingRange[i].camperCount;
                  if (
                    booking[bookingRange[i].camperId][keyDay].camper >
                    bookingRange[i].Camper.camperCount
                  ) {
                    routArr[campI+1].camper = 'мест нет';
                    routArr[campI+1].camperCount = 0;
                  } else {
                    camperArr.push(
                      bookingRange[i].Camper.camperCount -
                        booking[bookingRange[i].camperId][keyDay].camper
                    );
                  }
                }
              } //окончание цикла for для собирания мест по датам
  
              // ------------------------------------------------------------------------------------------------
            } else if (
              Date.parse(bookingRange[i].dateCheckIn) <= startDate &&
              Date.parse(bookingRange[i].dateDeparture) < endDate
            ) {
              days =
                (Date.parse(bookingRange[i].dateDeparture) - startDate) /
                1000 /
                60 /
                60 /
                24;
              console.log('двадвадва444444444444');
              if (days === 0) {
                days = 1;
              }
  
              for (let b = 0; b < days; b++) {
                //начало цикла for для собирания мест по датам
                const dayt = new Date(Date.parse(bookingRange[i].dateCheckIn));
                const keyDay = new Date(dayt.setDate(dayt.getDate() + b));
                if (booking[bookingRange[i].camperId][keyDay] === undefined) {
                  booking[bookingRange[i].camperId][keyDay] = {};
                  booking[bookingRange[i].camperId][keyDay].shelter =
                    shelterCount + bookingRange[i].shelterCount;
  
                  if (
                    booking[bookingRange[i].camperId][keyDay].shelter >
                    bookingRange[i].Camper.shelterCount
                  ) {
                    routArr[campI+1].shelter = 'мест нет';
                    routArr[campI+1].shelterCount = 0;
                  } else {
                    shelterArr.push(
                      bookingRange[i].Camper.shelterCount -
                        booking[bookingRange[i].camperId][keyDay].shelter
                    );
                  }
                  booking[bookingRange[i].camperId][keyDay].camper =
                    camperCount + bookingRange[i].camperCount;
                  if (
                    booking[bookingRange[i].camperId][keyDay].camper >
                    bookingRange[i].Camper.camperCount
                  ) {
                    routArr[campI+1].camper = 'мест нет';
                    routArr[campI+1].camperCount = 0;
                  } else {
                    camperArr.push(
                      bookingRange[i].Camper.camperCount -
                        booking[bookingRange[i].camperId][keyDay].camper
                    );
                  }
                } else {
                  booking[bookingRange[i].camperId][keyDay].shelter +=
                    bookingRange[i].shelterCount;
                  if (
                    booking[bookingRange[i].camperId][keyDay].shelter >
                    bookingRange[i].Camper.shelterCount
                  ) {
                    routArr[campI+1].shelter = 'мест нет';
                    routArr[campI+1].shelterCount = 0;
                  } else {
                    shelterArr.push(
                      bookingRange[i].Camper.shelterCount -
                        booking[bookingRange[i].camperId][keyDay].shelter
                    );
                  }
                  booking[bookingRange[i].camperId][keyDay].camper +=
                    bookingRange[i].camperCount;
                  if (
                    booking[bookingRange[i].camperId][keyDay].camper >
                    bookingRange[i].Camper.camperCount
                  ) {
                    routArr[campI+1].camper = 'мест нет';
                    routArr[campI+1].camperCount = 0;
                  } else {
                    camperArr.push(
                      bookingRange[i].Camper.camperCount -
                        booking[bookingRange[i].camperId][keyDay].camper
                    );
                  }
                }
              } //окончание цикла for для собирания мест по датам
  
              // ----------------------проверено
            } else if (
              Date.parse(bookingRange[i].dateCheckIn) > startDate &&
              Date.parse(bookingRange[i].dateDeparture) <= endDate
            ) {
              console.log('двадвадва55555555555');
              days =
                (Date.parse(bookingRange[i].dateDeparture) -
                  Date.parse(bookingRange[i].dateCheckIn)) /
                1000 /
                60 /
                60 /
                24;
              if (days === 0) {
                days = 1;
              }
  
              for (let b = 0; b < days; b++) {
                //начало цикла for для собирания мест по датам
                const dayt = new Date(Date.parse(bookingRange[i].dateCheckIn));
                const keyDay = new Date(dayt.setDate(dayt.getDate() + b));
                if (booking[bookingRange[i].camperId][keyDay] === undefined) {
                  booking[bookingRange[i].camperId][keyDay] = {};
                  booking[bookingRange[i].camperId][keyDay].shelter =
                    shelterCount + bookingRange[i].shelterCount;
  
                  if (
                    booking[bookingRange[i].camperId][keyDay].shelter >
                    bookingRange[i].Camper.shelterCount
                  ) {
                    routArr[campI+1].shelter = 'мест нет';
                    routArr[campI+1].shelterCount = 0;
                  } else {
                    shelterArr.push(
                      bookingRange[i].Camper.shelterCount -
                        booking[bookingRange[i].camperId][keyDay].shelter
                    );
                  }
                  booking[bookingRange[i].camperId][keyDay].camper =
                    camperCount + bookingRange[i].camperCount;
                  if (
                    booking[bookingRange[i].camperId][keyDay].camper >
                    bookingRange[i].Camper.camperCount
                  ) {
                    routArr[campI+1].camper = 'мест нет';
                    routArr[campI+1].camperCount = 0;
                  } else {
                    camperArr.push(
                      bookingRange[i].Camper.camperCount -
                        booking[bookingRange[i].camperId][keyDay].camper
                    );
                  }
                } else {
                  booking[bookingRange[i].camperId][keyDay].shelter +=
                    bookingRange[i].shelterCount;
                  if (
                    booking[bookingRange[i].camperId][keyDay].shelter >
                    bookingRange[i].Camper.shelterCount
                  ) {
                    routArr[campI+1].shelter = 'мест нет';
                    routArr[campI+1].shelterCount = 0;
                  } else {
                    shelterArr.push(
                      bookingRange[i].Camper.shelterCount -
                        booking[bookingRange[i].camperId][keyDay].shelter
                    );
                  }
                  booking[bookingRange[i].camperId][keyDay].camper +=
                    bookingRange[i].camperCount;
                  if (
                    booking[bookingRange[i].camperId][keyDay].camper >
                    bookingRange[i].Camper.camperCount
                  ) {
                    routArr[campI+1].camper = 'мест нет';
                    routArr[campI+1].camperCount = 0;
                  } else {
                    camperArr.push(
                      bookingRange[i].Camper.camperCount -
                        booking[bookingRange[i].camperId][keyDay].camper
                    );
                  }
                }
              } //окончание цикла for для собирания мест по датам
            } //закрытие условия когда дата начала аренды и дата окончания аренды больше чем параметры бранирования
          }
        }
  
        
        if (routArr[campI+1].shelter !== 'мест нет') {
          if (shelterArr.length) {
            routArr[campI+1].shelterCount = Math.min(...shelterArr);
          }
        }
        if (routArr[campI+1].camper !== 'мест нет') {
          if (camperArr.length) {
            routArr[campI+1].camperCount = Math.min(...camperArr);
          }
        }
        shelterArr = []
        camperArr = []
      } else {
        if (shelterCount>findAllCamper[campI].shelterCount){
          routArr[campI+1].shelter = 'мест нет'
          routArr[campI+1].shelterCount = 0
        } else if (bookingRange.length === 0) {
          routArr[campI+1].shelterCount = findAllCamper[campI].shelterCount
        }
  
  
        if (camperCount>findAllCamper[campI].camperCount) {
          routArr[campI+1].camper = 'мест нет'
          routArr[campI+1].camperCount = 0
        } else {
          routArr[campI+1].camperCount = findAllCamper[campI].camperCount
  
        }
        shelterArr = []
        camperArr = []
      }
  
     
          
  
        
  
  
  
  
      }
    //   const filterArr = routArr.filter((el)=>el.shelter === 'места есть' || el.camper === 'места есть')
      response.push(routArr)
  
  
      
    }
}
} 
    // console.log(booking); // тут конец
    
    
    // res.json(bookingRange);
      res.json(response) 
    } catch (error) {
      console.log(error);
      res.json({ err: error });
    }
  });

module.exports = checkBookingMainPage;
