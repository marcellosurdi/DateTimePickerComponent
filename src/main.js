import './css/style.scss';
import { DatePicker } from './js/datepicker';





new DatePicker( 'select_date' );

new DatePicker( 'select_date_2', {
  first_date: "2020-12-01",
  start_date: "2021-01-05",
  last_date: new Date( 2021, 0, 29 )
} );

new DatePicker( 'select_date_3' );
