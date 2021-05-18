# DateTimePickerComponent

## Description
DateTimePickerComponent is a dependency-free web component written in pure JavaScript. It supports internationalization, date format, range selections and disabled dates.

## Motivation
Some time ago, during the development of some booking applications, I needed a very lightweight date time picker that didn't require any heavy dependecies. I didn't find anything that met all my needs, so I developed mine.

## Compatibility
IE11 and all desktop and mobile recent browsers.

## Getting started
DateTimePickerComponent is delivered via npm:

`npm install --save date-time-picker-component`

### Non-module anvironments
`<link href="local-path-to/date-time-picker-component.css" rel="stylesheet">
<script src="local-path-to/date-time-picker-component.js"></script>`

or from [jsdeliver](https://www.jsdelivr.com/) (suggested):

`<link href="https://cdn.jsdelivr.net/npm/date-time-picker-component/dist/date-time-picker-component.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/date-time-picker-component/dist/date-time-picker-component.min.js"></script>`

## Usage
DateTimePickerComponent comes in four different flavours:

- DatePicker;
- DateTimePicker;
- DateRangePicker;
- DateTimeRangePicker.

If you’re using a bundler (e.g. webpack), you'll need to import one or the ones you need.

## Examples
...
