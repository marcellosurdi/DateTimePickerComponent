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
The picker is dynamically appended to the `div` element passed as parameter. As the picker is not tied to an input text, the selected date is returned to the value attribute of `input.date_output`.

### DatePicker
This class allows to select a single date.

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
| `id`         | `{string}` | None        | Id of the `div` element. **An error is thrown** if no value or invalid value is passed |
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
All classes support property `l10n` to localize the component in your language. You have to pass an object to that property.
