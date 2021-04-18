/**
 * @module js/datepicker
 * @author Marcello Surdi
 * @version 1.0.0
 *
 * @desc
 * This module contains DatePicker class
 */

import { PickerBase } from './pickerbase';

DatePicker.prototype = Object.create( PickerBase.prototype );
DatePicker.prototype.constructor = DatePicker;





/**
 * @class
 *
 * @desc
 * Creates a date picker inside the `div` whose id is passed as parameter
 *
 * @param {string} id_div Id of a `div` element that will contain the button for date selection
 * @param {object} [settings] Object with user defined values
 *
 * @example
 * // In settings object you can use either a date string (in ISO format) or a date object
 * new DatePicker( 'id', {
 *  first_date: "2021-01-02",
 *  start_date: "2021-01-05",
 *  last_date: new Date( 2021, 0, 29 )
 * } )
 */
export function DatePicker( id_div, settings ) {
  PickerBase.call( this );

  const el = document.getElementById( id_div );
  if( el == null || el.nodeName != 'DIV' ) {
    return false;
  }

  // Settings
  const start_date = ( settings?.start_date ) ? settings.start_date : null;
  const first_date = ( settings?.first_date ) ? settings.first_date : null;
  const last_date = ( settings?.last_date ) ? settings.last_date : null;
  const first_day_no = ( typeof settings?.first_day_no !== 'undefined' ) ? settings.first_day_no : 1;
  this.setPickerProps( el, start_date, first_date, last_date, first_day_no );

  this.i18n = ( settings?.i18n ) ? settings.i18n : this.i18n;
  this.date_output = ( settings?.date_output ) ? settings.date_output : 'short_ISO';

  this.start_container.classList.add( 'datetime-container', 'fix-float' );
  this.start_container.insertAdjacentHTML( 'afterbegin',
  `<div class="buttons-container fix-float">
    <button type="button" class="date start">
      <span class="week-day">mon</span>
      <span class="month-day">00</span>
      <span class="month-year"><em>jan</em><br>2000</span>
    </button>
  </div>
  <div class="picker"></div>
  <input type="hidden" class="output_date" value="">`
  );
  this.printDateAndTime( this.start_container, this.start_date );

  this.start_date_btn = this.start_container.querySelector( 'button.date.start' );
  this.start_picker_div = this.start_container.querySelector( 'div.picker' );

  this.start_date_btn.addEventListener( 'click', ( e ) => this.onOpenPicker( e ) );
}
