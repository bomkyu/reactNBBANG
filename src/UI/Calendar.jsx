import React, {useState, useEffect} from 'react'
import { DateRange } from 'react-date-range';
import { addDays, parseISO } from "date-fns"
import ko from 'date-fns/locale/ko';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import './calendar.css'

const Calendar = ({dateChange, date}) => {
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 1),
            key: 'selection',
        }
    ]);

    useEffect(() => {
    console.log('카렌다로 내려오는 데이터들',date)
        
    }, [date]);

    useEffect(() => {
        dateChange(state);
    
        
    }, [state]);
  return (
    <>
        <DateRange
            locale={ko}
            editableDateInputs={true}
            onChange={(item) => {
                const { startDate, endDate } = item.selection;
                setState([{ startDate, endDate, key: 'selection' }]);
            }}
            moveRangeOnFirstSelection={false}
            ranges={
                date.goDay !== '' && date.comeDay !== '' ? [{
                    startDate : parseISO(date.goDay),
                    endDate : parseISO(date.comeDay),
                    
                }] : state
            }
            months={6}
            direction="vertical"
            minDate={new Date()}
            color="#000"
        />
    </>
  )
}

export default Calendar