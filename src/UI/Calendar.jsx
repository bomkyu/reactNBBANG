import React, {useState, useEffect} from 'react'
import { DateRange } from 'react-date-range';
import { addDays } from "date-fns"
import ko from 'date-fns/locale/ko';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import './calendar.css'

const Calendar = ({dateChange}) => {
    
const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 1),
            key: 'selection'
        }
    ]);

    useEffect(() => {
        dateChange(state);
    }, [state]);
  return (
    <>
        <DateRange
            locale={ko}
            editableDateInputs={true}
            onChange={(item) => setState([item.selection])}
            moveRangeOnFirstSelection={false}
            ranges={state}
            months={6}
            direction="vertical"
            minDate={new Date()}
            color="#000"
        />
    </>
  )
}

export default Calendar