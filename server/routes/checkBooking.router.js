const express = require('express');
const { Booking, Camper } = require('../db/models');
const { Op } = require('sequelize');

const checkBookingRouter = express.Router();
// http://localhost:3000/booking/${1}?start=${parsDateStart}&end=${parsDateEnd}&shelter=${shelterCount}&camper=${camperCount}
checkBookingRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  const startDate = new Date(req.query.start);
  const endDate = new Date(req.query.end);
  const shelterCount = Number(req.query.shelter);
  const camperCount = Number(req.query.camper);
  let booking = {};
  let shelterArr = [];
  let camperArr = [];
  const response = {
    shelter: 'места есть',
    shelterCount: 0,
    camper: 'места есть',
    camperCount: 0,
  };
  const where = {
    camperId: id,
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

  try {
    const findCamper = await Camper.findByPk(id)
    const bookingRange = await Booking.findAll({
      where,
      order: [['id', 'ASC']],
      include: {
        model: Camper,
        attributes: ['shelterCount', 'camperCount'],
      },
    });

    if (bookingRange.length>0) {
      for (let i = 0; i < bookingRange.length; i++) {
        response.shelterCount = bookingRange[0].Camper.shelterCount;
        response.camperCount = bookingRange[0].Camper.camperCount;
        if (booking[bookingRange[i].camperId] === undefined) {
          booking[bookingRange[i].camperId] = {};

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
                  response.shelter = 'мест нет';
                  response.shelterCount = 0;
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
                  response.camper = 'мест нет';
                  response.camperCount = 0;
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
                  response.shelter = 'мест нет';
                  response.shelterCount = 0;
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
                  response.camper = 'мест нет';
                  response.camperCount = 0;
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
                  response.shelter = 'мест нет';
                  response.shelterCount = 0;
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
                  response.camper = 'мест нет';
                  response.camperCount = 0;
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
                  response.shelter = 'мест нет';
                  response.shelterCount = 0;
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
                  response.camper = 'мест нет';
                  response.camperCount = 0;
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
                  response.shelter = 'мест нет';
                  response.shelterCount = 0;
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
                  response.camper = 'мест нет';
                  response.camperCount = 0;
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
                  response.shelter = 'мест нет';
                  response.shelterCount = 0;
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
                  response.camper = 'мест нет';
                  response.camperCount = 0;
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
                  response.shelter = 'мест нет';
                  response.shelterCount = 0;
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
                  response.camper = 'мест нет';
                  response.camperCount = 0;
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
                  response.shelter = 'мест нет';
                  response.shelterCount = 0;
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
                  response.camper = 'мест нет';
                  response.camperCount = 0;
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
                  response.shelter = 'мест нет';
                  response.shelterCount = 0;
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
                  response.camper = 'мест нет';
                  response.camperCount = 0;
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
                  response.shelter = 'мест нет';
                  response.shelterCount = 0;
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
                  response.camper = 'мест нет';
                  response.camperCount = 0;
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
                  response.shelter = 'мест нет';
                  response.shelterCount = 0;
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
                  response.camper = 'мест нет';
                  response.camperCount = 0;
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
                  response.shelter = 'мест нет';
                  response.shelterCount = 0;
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
                  response.camper = 'мест нет';
                  response.camperCount = 0;
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
                  response.shelter = 'мест нет';
                  response.shelterCount = 0;
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
                  response.camper = 'мест нет';
                  response.camperCount = 0;
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
                  response.shelter = 'мест нет';
                  response.shelterCount = 0;
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
                  response.camper = 'мест нет';
                  response.camperCount = 0;
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
                  response.shelter = 'мест нет';
                  response.shelterCount = 0;
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
                  response.camper = 'мест нет';
                  response.camperCount = 0;
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
                  response.shelter = 'мест нет';
                  response.shelterCount = 0;
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
                  response.camper = 'мест нет';
                  response.camperCount = 0;
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
                  response.shelter = 'мест нет';
                  response.shelterCount = 0;
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
                  response.camper = 'мест нет';
                  response.camperCount = 0;
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
                  response.shelter = 'мест нет';
                  response.shelterCount = 0;
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
                  response.camper = 'мест нет';
                  response.camperCount = 0;
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
                  response.shelter = 'мест нет';
                  response.shelterCount = 0;
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
                  response.camper = 'мест нет';
                  response.camperCount = 0;
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
                  response.shelter = 'мест нет';
                  response.shelterCount = 0;
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
                  response.camper = 'мест нет';
                  response.camperCount = 0;
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
      if (response.shelter !== 'мест нет') {
        if (shelterArr.length) {
          response.shelterCount = Math.min(...shelterArr);
        } else {
          response.shelterCount = findCamper.shelterCount
        }
      }
      if (response.camper !== 'мест нет') {
        if (camperArr.length>0) {
          response.camperCount = Math.min(...camperArr);
        } else {
          response.camperCount = findCamper.camperCount
        }
      } 
    } else {
      if (shelterCount>findCamper.shelterCount){
        response.shelter = 'мест нет'
        response.shelterCount = 0
      } else if (bookingRange.length === 0) {
        response.shelterCount = findCamper.shelterCount
      }


      if (camperCount>findCamper.camperCount) {
        response.camper = 'мест нет'
        response.camperCount = 0
      } else {
        response.camperCount = findCamper.camperCount

      }


    }
    // console.log(booking); // тут конец
    // res.json(bookingRange);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.json({ err: error });
  }
});

module.exports = checkBookingRouter;
