const express = require('express');
const { Booking, Camper } = require('../db/models');
const { Op } = require('sequelize');
const checkBookingMainPage = require('./checkBookingMainPage.router')

const checkAllBookingRouter = express.Router();


checkAllBookingRouter.use('/main', checkBookingMainPage)

// http://localhost:3000/allbooking?start=${parsDateStart}&end=${parsDateEnd}&shelter=${shelterCount}&camper=${camperCount}
checkAllBookingRouter.get('/', async (req, res) => {
  const startDate = new Date(req.query.start);
  const endDate = new Date(req.query.end);
  const shelterCount = Number(req.query.shelter);
  const camperCount = Number(req.query.camper);
  let booking = {};
  let shelterArr = [];
  let camperArr = [];
  const response = [] 
  
  try {
    const findAllCamper = await Camper.findAll({
      order: [['id', 'DESC']],
    })
    
    if (findAllCamper) {
      for (let campI = 0; campI<findAllCamper.length; campI++) {
        response.push({id: findAllCamper[campI].id, shelter: 'места есть', shelterCount: 0, camper: 'места есть', camperCount: 0, data: findAllCamper[campI]})
        
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
          response[campI].shelterCount = bookingRange[i].Camper.shelterCount;
          response[campI].camperCount = bookingRange[i].Camper.camperCount;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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

      
      if (response[campI].shelter !== 'мест нет') {
        if (shelterArr.length) {
          response[campI].shelterCount = Math.min(...shelterArr);
        }
      }
      if (response[campI].camper !== 'мест нет') {
        if (camperArr.length) {
          response[campI].camperCount = Math.min(...camperArr);
        }
      }
      shelterArr = []
      camperArr = []
    } else {
      if (shelterCount>findAllCamper[campI].shelterCount){
        response[campI].shelter = 'мест нет'
        response[campI].shelterCount = 0
      } else if (bookingRange.length === 0) {
        response[campI].shelterCount = findAllCamper[campI].shelterCount
      }


      if (camperCount>findAllCamper[campI].camperCount) {
        response[campI].camper = 'мест нет'
        response[campI].camperCount = 0
      } else {
        response[campI].camperCount = findAllCamper[campI].camperCount

      }
    }
    }
  }
  // console.log(booking); // тут конец
  
  const respon = response.filter((el)=>el.shelter !== 'мест нет' && el.camper !== 'мест нет')
  const responseCamper = respon.filter((el)=>el.shelter === 'места есть' || el.camper === 'места есть')
  
    // res.json(bookingRange);
    res.json(responseCamper) 
  } catch (error) {
    console.log(error);
    res.json({ err: error });
  }
});




// ------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------------


checkAllBookingRouter.post('/', async (req, res) => {
  const {camperArrId, parsDateStart, parsDateEnd} = req.body
  console.log(req.body);
  const startDate = new Date(parsDateStart);
  const endDate = new Date(parsDateEnd);
  const shelterCount = Number(req.body.shelterCount);
  const camperCount = Number(req.body.camperCount);
  let booking = {};
  let shelterArr = [];
  let camperArr = [];
  const response = [] 
  
  try {
    const findAllCamper = await Camper.findAll({
      order: [['id', 'DESC']],
      where: {id: camperArrId}
    })
    if (findAllCamper) {
      for (let campI = 0; campI<findAllCamper.length; campI++) {
        response.push({id: findAllCamper[campI].id, shelter: 'места есть', shelterCount: 0, camper: 'места есть', camperCount: 0, data: findAllCamper[campI]})
        
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
          response[campI].shelterCount = bookingRange[i].Camper.shelterCount;
          response[campI].camperCount = bookingRange[i].Camper.camperCount;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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
                  response[campI].shelter = 'мест нет';
                  response[campI].shelterCount = 0;
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
                  response[campI].camper = 'мест нет';
                  response[campI].camperCount = 0;
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

      
      if (response[campI].shelter !== 'мест нет') {
        if (shelterArr.length) {
          response[campI].shelterCount = Math.min(...shelterArr);
        }
      }
      if (response[campI].camper !== 'мест нет') {
        if (camperArr.length) {
          response[campI].camperCount = Math.min(...camperArr);
        }
      }
      shelterArr = []
      camperArr = []
    } else {
      if (shelterCount>findAllCamper[campI].shelterCount){
        response[campI].shelter = 'мест нет'
        response[campI].shelterCount = 0
      } else if (bookingRange.length === 0) {
        response[campI].shelterCount = findAllCamper[campI].shelterCount
      }


      if (camperCount>findAllCamper[campI].camperCount) {
        response[campI].camper = 'мест нет'
        response[campI].camperCount = 0
      } else {
        response[campI].camperCount = findAllCamper[campI].camperCount

      }
    }

   
        

      




    }
    


    
  }

  // console.log(booking); // тут конец
  
  // const responseCamper = response.filter((el)=>el.shelter === 'места есть' || el.camper === 'места есть')
  
    // res.json(bookingRange);
    res.json(response) 
  } catch (error) {
    console.log(error);
    res.json({ err: error });
  }
});

module.exports = checkAllBookingRouter;
