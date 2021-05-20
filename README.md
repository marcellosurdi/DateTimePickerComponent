# DateTimePickerComponent
## Description
DateTimePickerComponent is a very lightweight and dependency-free web component written in pure JavaScript. It supports localization, date format, range selections and disabled dates.

## Motivation
Some time ago, during the development of some booking applications, I needed a date time picker that didn't require any heavy dependencies. I didn't find anything that met all my needs and browser's native implementations are currently inconsistent, so I developed mine.

## Compatibility
All desktop/mobile recent browsers and IE11.

## Getting started
### Module environments
DateTimePickerComponent is usually delivered via npm:

```
npm install --save date-time-picker-component
```

DateTimePickerComponent exposes **four different classes**:

1. DatePicker;
2. DateTimePicker;
3. DateRangePicker;
4. DateTimeRangePicker.

Starting from now we'll refer to DatePicker and DateTimePicker as **Date*Picker** classes and we'll refer to DateRangePicker and DateTimeRangePicker as **Date*RangePicker** classes instead.

If you're using a bundler like Webpack, you'll need to import one class or the ones you need.

``` javascript
import 'date-time-picker-component/dist/css/date-time-picker-component.min.css';
import { DatePicker } from "date-time-picker-component/dist/js/date-time-picker-component.min";

new DatePicker( 'select_date' );
```

### Non-module environments
DateTimePickerComponent works as well in non-module environments. You can include the necessary files from local

``` html
<link href="local-path-to/date-time-picker-component.min.css" rel="stylesheet">
<script src="local-path-to/date-time-picker-component.min.js"></script>
```

or from [jsDelivr CDN](https://www.jsdelivr.com/)

``` html
<link href="https://cdn.jsdelivr.net/gh/marcellosurdi/DateTimePickerComponent/dist/css/date-time-picker-component.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/gh/marcellosurdi/DateTimePickerComponent/dist/js/date-time-picker-component.min.js"></script>
```

In non-module environments you must access the classes via `DateTimePickerComponent` object:

``` javascript
new DateTimePickerComponent.DatePicker( 'select_date' );
```

## Usage
### How does the component work?
When one of the classes is called with `new` operator, like above example `new DatePicker( 'select_date' );`, the necessary HTML is dynamically appended to the `div#select_date`.

For **Date*Picker** classes the resulting HTML will look similar to these lines of code:

``` html
<div id="select_date" class="datetime-container">
  <div class="buttons-container">
    <button type="button" class="date start">
      <span class="week-day">mon</span>
      <span class="month-day">00</span>
      <span class="month-year"><span>jan</span><br>2000</span>
    </button>
  </div>
  <div class="picker"></div>
  <input type="hidden" class="date_output" value="">
</div>
```

For **Date*RangePicker** classes instead:

``` html
<div id="select_date" class="datetime-container fix-float">
  <div class="buttons-container fix-float">
    <button type="button" class="date start w-50">
      <span class="week-day">mon</span>
      <span class="month-day">00</span>
      <span class="month-year"><span>jan</span><br>2000</span>
    </button>
    <button type="button" class="time start w-50">
      <span class="hours">00</span>
      <span class="minutes">:00</span>
    </button>
  </div>
  <div class="picker"></div>
  <input type="hidden" class="date_output" value="">
</div>
```

As you can see, the picker **is not tied** to an input text, so the selected date is always returned to the value attribute of the `input.date_output` according to `settings.date_output` property, see the settings section below.

### Date*Picker classes
DatePicker and DateTimePicker classes allow to select a date or a date/time respectively, [see the online demo](https://www.marcellosurdi.name/demo/date-time-picker-component/).

#### Params
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `id`              | `{string}` | None        | Id of the `div` element where to append the component. **An error is thrown** if no value or invalid value is passed |
| [`settings`]      | `{object}` | `{}`        | Object with user defined settings |

See the settings section for more details.

#### Example
Here a JavaScript example:

``` javascript
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

And the corresponding HTML:

``` html
<body>
  <div id="select_date"></div>
</body>
```

### Date*RangePicker classes
DateRangePicker and DateTimeRangePicker classes allow to select a date range or a date/time range respectively, [see the online demo](https://www.marcellosurdi.name/demo/date-time-picker-component/).

#### Params
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `start_id`        | `{string}` | None        | Id of the `div` element where to append the component for the start date. **An error is thrown** if no value or invalid value is passed |
| `end_id`          | `{string}` | None        | Id of the `div` element where to append the component for the end date. **An error is thrown** if no value or invalid value is passed |
| [`settings`]      | `{object}` | `{}`        | Object with user defined settings |

See the settings section for more details.

#### Example
Here a JavaScript example:

``` javascript
import 'date-time-picker-component/dist/css/date-time-picker-component.min.css';
import { DateRangePicker } from "date-time-picker-component/dist/js/date-time-picker-component.min";

new DateRangePicker( 'start_date', 'end_date', {
  first_date: "2030-01-02",
  start_date: "2030-01-05",
  end_date: "2030-01-07",
  last_date: new Date( 2030, 0, 29 ),
  first_day_no: 0,
  date_output: "short_ISO",
  min_range_hours: 3,
} );
```

And the corresponding HTML:

``` html
<body>
  <div id="start_date"></div>
  <div id="end_date"></div>
</body>
```

### Settings
**All classes** support these properties in `settings` object:

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `first_date`      | `{Date\|string}` | Current date                    | First selectable date. **All date values** must be a date string (in ISO format) or a date object |
| `start_date`      | `{Date\|string}` | One day more than current date  | Start selected date |
| `last_date`       | `{Date\|string}` | One year more than `start_date` | Last selectable date |
| `first_day_no`    | `{number}`       | `1` (Monday)                    | Day the week must start with. Accordingly to the returned values of `Date.getDate` method, accepted range values are 0-6 where 0 means Sunday, 1 means Monday and so on |
| `date_output`     | `{string}`       | `"short_ISO"`                   | Denotes the date format returned to the value attribute of `input.date_output` (accepted values are short_ISO (`"2030-01-05"`), full_ISO and timestamp) |
| `l10n`            | `{object}`       | Object with English strings     | Object that contains the strings for translation |

Only the **Date*RangePicker** classes also support these properties:

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `end_date`        | `{Date\|string}` | One day more than `start_date`  | End selected date |
| `min_range_hours` | `{number}`       | `1`                             | Denotes the minimum range expressed in hours that must elapse between `start_date` and `end_date` |

### Localization (i10n)
All classes support the `l10n` property to localize the component in your language. You just have to pass an object like the one below to that property.

``` javascript
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

### Maintaining state
To maintaining state, that is to retain the user selected dates after a page reload due, for instance, to a failed validation, you have to manually add the `input.date_output` inside the `div` in this way:

``` html
<body>
  <!-- Date*Picker classes -->
  <div id="select_date">
    <input type="hidden" class="date_output" value="2030-05-22">
  </div>

  <!-- Date*RangePicker classes -->
  <div id="start_date">
    <input type="hidden" class="date_output" value="2030-05-22">
  </div>
  <div id="end_date">
    <input type="hidden" class="date_output" value="2030-05-22T10:00:00">
  </div>
</body>
```

The component will detect hidden input fields and read the content of the value attribute.

## Links
1. [Online demo](https://www.marcellosurdi.name/demo/date-time-picker-component/)
2. [JSDoc documentation](https://www.marcellosurdi.name/jsdoc/date-time-picker-component/) (if you are a developer probably you can find here other useful information).
