# Change Log
All notable changes to this project will be documented in this file.

## [1.1.0] - 2021-07-12
Added an **alternative time picker** with two select elements, one for the hours and one for the minutes. Minutes are rounded to the `round_to` value and his multiples.

### Added
- `settings.round_to` property for DateTimePicker and DateTimeRangePicker classes;
- `name` attribute in `input.date_output` fields;
- `i18n.done` property.

### Fixed
Inline styles are no longer duplicated in `start_container` and `end_container`.

## [1.0.0] - 2021-05-28
First stable release
