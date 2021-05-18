# DateTimePickerComponent

## Description
DateTimePickerComponent is a very lightweight and dependency-free web component written in pure JavaScript. It supports internationalization, date format, range selections and disabled dates.

## Why?
Some time ago, during the development of some booking applications, I needed a date time picker that didn't require any heavy dependecies. I didn't find anything that met all my needs and browser's native implementations are incosistent, so I developed mine.

## Compatibility
IE11 and all desktop and mobile recent browsers.

## Getting started
DateTimePickerComponent is usually delivered via npm:

`npm install --save date-time-picker-component`

DateTimePickerComponent comes in **four different flavours**:

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

In this use case you can access component features via `DateTimePickerComponent` object:

```
new DateTimePickerComponent.DatePicker( 'select_date', {
    first_day_no: 0
  }
);
```
