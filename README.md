# DateTimePickerComponent

## Description
DateTimePickerComponent is a very lightweight and dependency-free web component written in pure JavaScript. It supports localization, date format, range selections and disabled dates.

## Why?
Some time ago, during the development of some booking applications, I needed a date time picker that didn't require any heavy dependencies. I didn't find anything that met all my needs and browser's native implementations are inconsistent, so I developed mine.

## Compatibility
IE11 and all desktop and mobile recent browsers.

## Getting started

### Module environments
DateTimePickerComponent is usually delivered via npm:

`npm install --save date-time-picker-component`

DateTimePickerComponent exposes **four different classes**:

1. DatePicker;
2. DateTimePicker;
3. DateRangePicker;
4. DateTimeRangePicker.

If you're using a bundler like Webpack, you'll need to import one or the ones you need.

```
import 'date-time-picker-component/dist/css/date-time-picker-component.min.css';
import { DatePicker } from "date-time-picker-component/dist/js/date-time-picker-component.min";

new DatePicker( 'select_date', {
    first_day_no: 0
  }
);
```

### Non-module environments
DateTimePickerComponent works as well in non-module environments. You can include the necessary files from local

```
<link href="local-path-to/date-time-picker-component.min.css" rel="stylesheet">
<script src="local-path-to/date-time-picker-component.min.js"></script>
```

or from [jsdeliver CDN](https://www.jsdelivr.com/)

```
<link href="https://cdn.jsdelivr.net/gh/marcellosurdi/DateTimePickerComponent/dist/css/date-time-picker-component.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/gh/marcellosurdi/DateTimePickerComponent/dist/js/date-time-picker-component.min.js"></script>
```

In this use case you can access the classes of component via `DateTimePickerComponent` object:

```
new DateTimePickerComponent.DatePicker( 'select_date', {
    first_day_no: 0
  }
);
```
## Usage

### How does the component work?
The HTML of the component is dynamically appended to the `div` element passed as parameter (see param sections below). As the picker **is not tied** to an input text, the selected date is returned to the value attribute of the `input.date_output` appended to the `div`.

### DatePicker
This class allows to select a single date, [see the demo](https://www.marcellosurdi.name/date-time-picker-component/date-picker.html).

```
import 'date-time-picker-component/dist/css/date-time-picker-component.min.css';
import { DatePicker } from "date-time-picker-component/dist/js/date-time-picker-component.min";

new DatePicker( 'select_date', {
    first_date: "2030-01-02",
    start_date: "2030-01-05",
    last_date: new Date( 2030, 0, 29 ),
    first_day_no: 0,
    date_output: "short_ISO",
  }
);
```
#### Params
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `id`         | `{string}` | None        | Id of the `div` element where to append the component. **An error is thrown** if no value or invalid value is passed |
| [`settings`] | `{object}` | `undefined` | Object with user defined values |

#### Settings
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `first_date`   | `{Date\|string}` | Current date                    | First selectable date. **All date values** must be a date string (in ISO format) or a date object |
| `start_date`   | `{Date\|string}` | One day more than current date  | Start selected date |
| `last_date`    | `{Date\|string}` | One year more than `start_date` | Last selectable date |
| `first_day_no` | `{number}`       | `1`                             | Day the week must start with. Accordingly to the returned values of `Date.getDate` method, accepted range values are 0-6 where 0 means Sunday, 1 means Monday and so on |
| `date_output`  | `{string}`       | `"short_ISO"`                   | Denotes the date format returned to the value attribute of `input.date_output` (accepted values are short_ISO (`"2030-01-05"`), full_ISO and timestamp) |

### Localization (i10n)
All classes support the `l10n` property to localize the component in your language. You just have to pass an object like the one below to that property.

```
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

new DatePicker( 'select_date', {
    l10n: it,
  }
);
```
