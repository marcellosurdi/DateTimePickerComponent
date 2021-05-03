import './css/style.scss';
import { DatePicker } from './js/datepicker';
import { DateTimePicker } from './js/datetimepicker';
import { DateIntervalPicker } from './js/dateintervalpicker';


let it = {
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
};





new DateIntervalPicker( 'start_date', 'end_date', {
  end_date: '2021-05-13T23:12:00',
  last_date: '2021-05-25',
  i18n: it
} );





new DateTimePicker( 'select_datetime', { i18n: it } );





new DatePicker( 'select_date', { first_day_no: 0 } );

new DatePicker( 'select_date_2', {
  first_date: "2020-12-01",
  start_date: "2021-01-05",
  last_date: new Date( 2021, 0, 29 ),
  i18n: it
} );

new DatePicker( 'select_date_3', { first_day_no: 0 } );
