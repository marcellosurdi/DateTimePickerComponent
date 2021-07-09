import './css/style.scss';
import { DatePicker } from './js/date-picker';
import { DateTimePicker } from './js/date-time-picker';
import { DateRangePicker } from './js/date-range-picker';
import { DateTimeRangePicker } from './js/date-time-range-picker';


new DatePicker( 'select_date' );

new DatePicker( 'select_date_2', {
  first_date: "2030-01-02",
  start_date: "2030-01-05",
  last_date: new Date( 2030, 0, 29 ),
  first_day_no: 1,
  date_output: "timestamp",
  styles: {
    active_background: '#e34c26',
    active_color: '#fff'
  }
} );

new DatePicker( 'select_date_3', {
  first_date: "2030-01-02",
  start_date: "2030-01-05",
} );





const it = {
  'jan':'Gen',
  'feb':'Feb',
  'mar':'Mar',
  'apr':'Apr',
  'may':'Mag',
  'jun':'Giu',
  'jul':'Lug',
  'aug':'Ago',
  'sep':'Set',
  'oct':'Ott',
  'nov':'Nov',
  'dec':'Dic',
  'jan_':'Gennaio',
  'feb_':'Febbraio',
  'mar_':'Marzo',
  'apr_':'Aprile',
  'may_':'Maggio',
  'jun_':'Giugno',
  'jul_':'Luglio',
  'aug_':'Agosto',
  'sep_':'Settembre',
  'oct_':'Ottobre',
  'nov_':'Novembre',
  'dec_':'Dicembre',
  'mon':'Lun',
  'tue':'Mar',
  'wed':'Mer',
  'thu':'Gio',
  'fri':'Ven',
  'sat':'Sab',
  'sun':'Dom',
  'mon_':'Lunedì',
  'tue_':'Martedì',
  'wed_':'Mercoledì',
  'thu_':'Giovedì',
  'fri_':'Venerdì',
  'sat_':'Sabato',
  'sun_':'Domenica',
  'done':'Imposta'
};

new DateTimePicker( 'select_datetime', {
  start_date: "2030-03-22T14:30:00",
  last_date: new Date( 2030, 2, 29, 22, 30 ),
  first_day_no: 1,
  l10n: it,
} );





new DateRangePicker( 'start_date', 'end_date', {
  min_range_hours: 48,
} );





new DateTimeRangePicker( 'start_date_time', 'end_date_time', {
  first_date: "2030-01-02T10:30:00",
  start_date: "2030-01-05T16:00:00",
  end_date: "2030-01-06T18:00:00",
  last_date: new Date( 2030, 0, 29, 14, 0 ),
  first_day_no: 1,
  round_to: 5,
  date_output: "timestamp",
  styles: {
    active_background: '#e34c26',
    active_color: '#fff',
    inactive_background: '#0366d9',
    inactive_color: '#fff'
  },
  min_range_hours: 18
} );
