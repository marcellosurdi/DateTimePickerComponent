/**
 * @module js/date-time-range-picker
 * @author Marcello Surdi
 *
 * @desc
 * This module contains the DateTimeRangePicker class
 */

import { PickerBase } from './picker-base';

DateTimeRangePicker.prototype = Object.create( PickerBase.prototype );
DateTimeRangePicker.prototype.constructor = DateTimeRangePicker;





/**
 * @class
 *
 * @classdesc
 * Creates a date time range picker inside the `div` elements passed as parameters.
 *
 * Example:
 * ``` javascript
 * new DateTimeRangePicker( 'start_id', 'end_id' {
 *  first_date: "2030-01-02T10:30:00",
 *  start_date: "2030-01-05T16:00:00",
 *  end_date: "2030-01-06T18:00:00",
 *  last_date: new Date( 2030, 0, 29, 14, 0 ),
 *  first_day_no: 1,
 *  round_to: 30,
 *  date_output: "timestamp",
 *  styles: {
 *    active_background: '#e34c26',
 *    active_color: '#fff',
 *    inactive_background: '#0366d9',
 *    inactive_color: '#fff' },
 *  min_range_hours: 18
 * } );
 * ```
 * @param {string} start_id Id of the start date `div` element
 * @param {string} end_id Id of the end date `div` element
 * @param {object} [settings={}] Object with user defined settings
 */
export function DateTimeRangePicker( start_id, end_id, settings = {} ) {
  PickerBase.call( this );


  // Settings
  this.i18n = ( settings.l10n ) ? settings.l10n : this.i18n;
  this.round_to = ( settings.round_to ) ? settings.round_to : false;
  this.date_output = ( settings.date_output ) ? settings.date_output : 'full_ISO';
  this.min_range = ( settings.min_range_hours ) ? ( settings.min_range_hours * 60 * 60 * 1000 ) : ( 1 * 60 * 60 * 1000 );

  const start_date = ( settings.start_date ) ? settings.start_date : null;
  const first_date = ( settings.first_date ) ? settings.first_date : null;
  const last_date = ( settings.last_date ) ? settings.last_date : null;
  const first_day_no = ( typeof settings.first_day_no !== 'undefined' ) ? settings.first_day_no : 0;
  const styles = ( settings.styles ) ? settings.styles : {};
  this.setStartPickerProps( start_id, start_date, first_date, last_date, first_day_no );

  const end_date = ( settings.end_date ) ? settings.end_date : null;
  this.setEndPickerProps( end_id, end_date );


  // Start date
  this.start_container.classList.add( 'datetime-container', 'fix-float' );
  this.start_container.insertAdjacentHTML( 'afterbegin', this.getHTML( 'start', 'datetime', styles ) );
  this.printDateAndTime( this.start_container, this.start_date );

  this.start_date_btn = this.start_container.querySelector( 'button.date.start' );
  this.start_time_btn = this.start_container.querySelector( 'button.time.start' );
  this.start_picker = this.start_container.querySelector( 'div.picker' );

  this.start_date_btn.addEventListener( 'click', this.onOpenPicker );
  this.start_time_btn.addEventListener( 'click', this.onOpenPicker );


  // End date
  this.end_container.classList.add( 'datetime-container', 'fix-float' );
  this.end_container.insertAdjacentHTML( 'afterbegin', this.getHTML( 'end', 'datetime' ) );
  this.printDateAndTime( this.end_container, this.end_date );

  this.end_date_btn = this.end_container.querySelector( 'button.date.end' );
  this.end_time_btn = this.end_container.querySelector( 'button.time.end' );
  this.end_picker = this.end_container.querySelector( 'div.picker' );

  this.end_date_btn.addEventListener( 'click', this.onOpenPicker );
  this.end_time_btn.addEventListener( 'click', this.onOpenPicker );
}
