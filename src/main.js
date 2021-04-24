import './css/style.scss';
import { DatePicker } from './js/datepicker';
import { DateTimePicker } from './js/datetimepicker';


let it = {
  'jan':'gen',
  'feb':'feb',
  'mar':'mar',
  'apr':'apr',
  'may':'mag',
  'jun':'giu',
  'jul':'lug',
  'aug':'ago',
  'sep':'set',
  'oct':'ott',
  'nov':'nov',
  'dec':'dic',
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
  'mon':'lun',
  'tue':'mar',
  'wed':'mer',
  'thu':'gio',
  'fri':'ven',
  'sat':'sab',
  'sun':'dom',
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
