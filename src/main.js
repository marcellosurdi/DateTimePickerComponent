'use strict';

import './css/style.css';
import { DateTimeIntervalPickerMixin } from './js/pickermixin';
import { DatePicker } from './js/datepicker';



Object.assign( DatePicker.prototype, DateTimeIntervalPickerMixin );
new DatePicker( 'select_date' );
new DatePicker( 'select_date_2' );
// new DatePicker( 'select_date',null,null,null,4 , new Date( 2021, 0, 4, 23, 0, 22 ), new Date( 2021, 0, 2, 23, 0, 22 ), new Date( 2020, 0, 15, 23, 0, 22 ) );
// console.log( new Date( 2023, 1, 5, 23, 0, 22 ).getTime() / 1000 );
// new DatePicker( 'select_date_2', null, null, null, 1 );
