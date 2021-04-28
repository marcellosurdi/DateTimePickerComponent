/**
 * @module js/datetimepicker
 * @author Marcello Surdi
 * @version 1.0.0
 *
 * @desc
 * This module contains the DateIntervalPicker class
 */

import { PickerBase } from './pickerbase';

DateIntervalPicker.prototype = Object.create( PickerBase.prototype );
DateIntervalPicker.prototype.constructor = DateIntervalPicker;





/**
 * @class
 *
 * @classdesc
 * Creates a date interval picker inside the `div` elements passed as parameters
 *
 * @param {string} start_id Id of the `div` element that will contain the start date button
 * @param {string} end_id Id of the `div` element that will contain the end date button
 * @param {object} [settings] Object with user defined values
 *
 * @example
 * // In settings object you can use either a date string (in ISO format) or a date object
 * new DatePicker( 'start_id', 'end_id' {
 *  first_date: "2021-01-02",
 *  start_date: "2021-01-05",
 *  last_date: new Date( 2021, 0, 29 ),
 *  end_date: "2021-01-07"
 * } );
 */
export function DateIntervalPicker( start_id, end_id, settings ) {
  PickerBase.call( this );

  // Settings
  this.i18n = ( settings?.i18n ) ? settings.i18n : this.i18n;
  this.date_output = ( settings?.date_output ) ? settings.date_output : 'full_ISO';

  const start_date = ( settings?.start_date ) ? settings.start_date : null;
  const first_date = ( settings?.first_date ) ? settings.first_date : null;
  const last_date = ( settings?.last_date ) ? settings.last_date : null;
  const first_day_no = ( typeof settings?.first_day_no !== 'undefined' ) ? settings.first_day_no : 1;
  this.setStartPickerProps( start_id, start_date, first_date, last_date, first_day_no );


  // Start date
  this.start_container.classList.add( 'datetime-container', 'fix-float' );
  this.start_container.insertAdjacentHTML( 'afterbegin',
  `<div class="buttons-container fix-float">
    <button type="button" class="date start">
      <span class="week-day">mon</span>
      <span class="month-day">00</span>
      <span class="month-year"><span>jan</span><br>2000</span>
    </button>
  </div>
  <div class="picker"></div>
  <input type="hidden" class="date_output" value="">`
  );
  this.printDateAndTime( this.start_container, this.start_date, 'date' );

  this.start_date_btn = this.start_container.querySelector( 'button.date.start' );
  this.start_picker_div = this.start_container.querySelector( 'div.picker' );

  this.start_date_btn.addEventListener( 'click', this.onOpenPicker );


  // End date
  const end_date = ( settings?.end_date ) ? settings.end_date : null;
  this.setEndPickerProps( end_id, end_date );

  this.end_container.classList.add( 'datetime-container', 'fix-float' );
  this.end_container.insertAdjacentHTML( 'afterbegin',
  `<div class="buttons-container fix-float">
    <button type="button" class="date end">
      <span class="week-day">mon</span>
      <span class="month-day">00</span>
      <span class="month-year"><span>jan</span><br>2000</span>
    </button>
  </div>
  <div class="picker"></div>
  <input type="hidden" class="date_output" value="">`
  );
  this.printDateAndTime( this.end_container, this.end_date, 'date' );

  this.end_date_btn = this.end_container.querySelector( 'button.date.end' );
  this.end_picker_div = this.end_container.querySelector( 'div.picker' );

  this.end_date_btn.addEventListener( 'click', this.onOpenPicker );
}
