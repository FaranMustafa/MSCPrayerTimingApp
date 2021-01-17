import React, {useEffect} from 'react';
import {Calendar} from 'react-native-calendars';
export default function MonthCalendar() {
  useEffect(() => {
    fetch(
      'http://api.aladhan.com/v1/calendar?latitude=51.508515&longitude=-0.1254872&method=2&month=4&year=2017',
      {method: 'GET'},
    )
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.log('error', error));
  }, []);

  return (
    <Calendar
    // Collection of dates that have to be marked. Default = {}
    />
  );
}
