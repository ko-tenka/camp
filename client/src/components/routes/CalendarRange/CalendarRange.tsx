import { Button, ConfigProvider, DatePicker, Space, Typography } from 'antd';
import type { DatePickerProps } from 'antd';
import locale from 'antd/locale/ru_RU';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useContext, useState } from 'react';
import { UserContext } from '../../../context/userContext';





export default function CalendarRange(){

    dayjs.extend(customParseFormat);
    dayjs.locale('ru');



  const {bookingDate, setBookingDate} = useContext(UserContext)
  const {daysCount, setDaysCount} = useContext(UserContext);
  

  const handleDateChange = (dates: [moment.Moment, moment.Moment] | null) => {
    setBookingDate(dates);
    const parsDateStart = `${dates[0].$y}-${dates[0].$M+1}-${dates[0].$D}`
    const parsDateEnd = `${dates[1].$y}-${dates[1].$M+1}-${dates[1].$D}`
    const currentDay = new Date(parsDateStart)
    const endDate = new Date(parsDateEnd)
    const dayAr = (endDate-currentDay)/1000/60/60/24
    setDaysCount(Number(dayAr))
    
  };
  const dateFormat = 'DD/MM/YYYY';
    const { RangePicker } = DatePicker;
    const disabled7DaysDate: DatePickerProps['disabledDate'] = (current, { from }) => {
        if (from) {
          return Math.abs(current.diff(from, 'days')) >= 7;
        }
      
        return false;
      };

    return (
        <>  
          <Space direction="vertical">
          <ConfigProvider locale={locale}>
        <RangePicker
          size='large'
          format={dateFormat}
          value={bookingDate}
          onChange={handleDateChange}
        />
            </ConfigProvider>
        </Space>
        <div>Дней: {daysCount}</div>
        </>
    )
}