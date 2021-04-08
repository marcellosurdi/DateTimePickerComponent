'use strict';

import './css/style.css';
import { DateTimeIntervalPickerMixin } from './js/pickermixin';
import { DatePicker } from './js/datepicker';



Object.assign( DatePicker.prototype, DateTimeIntervalPickerMixin );
new DatePicker( 'select_date' );
new DatePicker( 'select_date_2', {
  start_date: "2021-01-05",
  first_date: "2021-01-02",
  last_date: new Date( 2021, 0, 29 )
} );
