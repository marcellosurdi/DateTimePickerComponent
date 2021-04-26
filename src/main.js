import './css/style.scss';
import { DatePicker } from './js/datepicker';
import { DateTimePicker } from './js/datetimepicker';


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
  'january':'Gennaio',
  'february':'Febbraio',
  'march':'Marzo',
  'april':'Aprile',
  'may':'Maggio',
  'june':'Giugno',
  'july':'Luglio',
  'august':'Agosto',
  'september':'Settembre',
  'october':'Ottobre',
  'november':'Novembre',
  'december':'Dicembre',
  'mon':'Lun',
  'tue':'Mar',
  'wed':'Mer',
  'thu':'Gio',
  'fri':'Ven',
  'sat':'Sab',
  'sun':'Dom',
  'lunedi':'Lunedì',
  'martedi':'Martedì',
  'mercoledi':'Mercoledì',
  'giovedi':'Giovedì',
  'venerdi':'Venerdì',
  'sabato':'Sabato',
  'domenica':'Domenica',
};

new DatePicker( 'select_date', { first_day_no: 0 } );

new DatePicker( 'select_date_2', {
  first_date: "2020-12-01",
  start_date: "2021-01-05",
  last_date: new Date( 2021, 0, 29 ),
  i18n: it
} );

new DatePicker( 'select_date_3', { first_day_no: 0 } );





new DateTimePicker( 'select_datetime', { first_day_no: 0 } );
