# Change Log
All notable changes to this project will be documented in this file.

## [1.1.2] - 2021-08-02
Fixed `settings.date_output` result when set to `timestamp`. Now the same value is always returned regardless of the user's time zone.

## [1.1.0] - 2021-07-12
Added an **alternative time picker** with two select elements, one for the hours and one for the minutes. Minutes are rounded to the `round_to` value and his multiples.

### Added
- `settings.round_to` property for DateTimePicker and DateTimeRangePicker classes;
- `name` attribute in `input.date_output` fields;
- `i18n.done` property.
- CHANGELOG.md

### Changed
- README.md documentation improved

### Fixed
- inline styles are no longer duplicated in `start_container` and `end_container`;
- checkDateTimeConsistency logic.

## [1.0.0] - 2021-05-28
First stable release
