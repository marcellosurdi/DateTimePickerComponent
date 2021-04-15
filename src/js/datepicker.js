/**
 * @module js/datepicker
 * @author Marcello Surdi
 * @version 1.0.0
 *
 * @desc
 * This module contains DatePicker class
 */

import { DatePickerMixin } from './datepickermixin';

Object.assign( DatePicker.prototype, DatePickerMixin );




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
 *
 * @todo Provide support for disabled days (even if between first_date and last_date)
 * @todo Provide support for touch events
 * @todo Provide a year navigation similar to a HTML native select control
 */
export function DatePicker( id_div, settings ) {
  const el = document.getElementById( id_div );
  if( el == null || el.nodeName != 'DIV' ) {
    return false;
  }

  // Settings
  let start_date = ( settings?.start_date ) ? settings.start_date : null;
  let first_date = ( settings?.first_date ) ? settings.first_date : null;
  let last_date = ( settings?.last_date ) ? settings.last_date : null;
  let first_day_no = ( typeof settings?.first_day_no !== 'undefined' ) ? settings.first_day_no : 1;
  this.setPickerProps( el, start_date, first_date, last_date, first_day_no );

  this.i18n = ( settings?.i18n ) ? settings.i18n : this.i18n;
  this.date_output = ( settings?.date_output ) ? settings.date_output : 'short_ISO';
  this.mode = 'start';

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
