/**
 * @module js/datetimepicker
 * @author Marcello Surdi
 * @version 1.0.0
 *
 * @desc
 * This module contains the DateTimePicker class
 */

import { PickerBase } from './pickerbase';

DateTimePicker.prototype = Object.create( PickerBase.prototype );
DateTimePicker.prototype.constructor = DateTimePicker;





/**
 * @class
 *
 * @classdesc
 * Creates a date time picker inside the `div` passed as parameter
 *
 * @param {string} id Id of the `div` element
 * @param {object} [settings] Object with user defined values
 *
 * @example
 * // In settings object you can use either a date string (in ISO format) or a date object
 * new DatePicker( 'id', {
 *  first_date: "2021-01-02T23:00:00",
 *  start_date: "2021-01-05T23:00:00",
 *  last_date: new Date( 2021, 0, 29 )
 * } );
 */
export function DateTimePicker( id, settings ) {
  PickerBase.call( this );

  // Settings
  const start_date = ( settings?.start_date ) ? settings.start_date : null;
  const first_date = ( settings?.first_date ) ? settings.first_date : null;
  const last_date = ( settings?.last_date ) ? settings.last_date : null;
  const first_day_no = ( typeof settings?.first_day_no !== 'undefined' ) ? settings.first_day_no : 1;
  this.setStartPickerProps( id, start_date, first_date, last_date, first_day_no );

  this.i18n = ( settings?.i18n ) ? settings.i18n : this.i18n;
  this.date_output = ( settings?.date_output ) ? settings.date_output : 'full_ISO';

  this.start_container.classList.add( 'datetime-container', 'fix-float' );
  this.start_container.insertAdjacentHTML( 'afterbegin',
  `<div class="buttons-container fix-float">
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
  <input type="hidden" class="date_output" value="">`
  );
  this.showDateAndTime( this.start_container, this.start_date );

  this.start_date_btn = this.start_container.querySelector( 'button.date.start' );
  this.start_time_btn = this.start_container.querySelector( 'button.time.start' );
  this.start_picker_div = this.start_container.querySelector( 'div.picker' );

  this.start_date_btn.addEventListener( 'click', this.onOpenPicker );
  this.start_time_btn.addEventListener( 'click', this.onOpenPicker );
}
