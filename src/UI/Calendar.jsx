import React, {useState, useEffect} from 'react'
import { DateRange } from 'react-date-range';
import ko from 'date-fns/locale/ko';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import './calendar.css'
import { connectStorageEmulator } from 'firebase/storage';

const Calendar = ({dateChange, date}) => {
    
  return (
    <>
        <DateRange
            locale={ko}
            editableDateInputs={true}
            onChange={(item) => {
                const { startDate, endDate } = item.selection ? item.selection : item.range1;       
                dateChange([{startDate, endDate}]);
            }}
            moveRangeOnFirstSelection={false}
            ranges={date}
            months={6}
            direction="vertical"
            minDate={new Date()}
            color="#000"
        />
    </>
  )
}

export default Calendar