/**
 * @module js/date-time-picker
 * @author Marcello Surdi
 * @version 1.0.0
 *
 * @desc
 * This module contains the DateTimePicker class
 */

import { PickerBase } from './picker-base';

DateTimePicker.prototype = Object.create( PickerBase.prototype );
DateTimePicker.prototype.constructor = DateTimePicker;





/**
 * @class
 *
 * @classdesc
 * Creates a date time picker inside the `div` passed as parameter
 *
 * @param {string} id Id of the `div` element where to append the component
 * @param {object} [settings={}] Object with user defined settings
 *
 * @example
 * // In settings object you can use either a date string (in ISO format) or a date object
 * new DatePicker( 'id', {
 *  first_date: "2021-01-02T23:00:00",
 *  start_date: "2021-01-05T23:00:00",
 *  last_date: new Date( 2021, 0, 29 )
 * } );
 */
export function DateTimePicker( id, settings = {} ) {
  PickerBase.call( this );


  // Settings
  this.i18n = ( settings?.l10n ) ? settings.l10n : this.i18n;
  this.date_output = ( settings?.date_output ) ? settings.date_output : 'full_ISO';

  const start_date = ( settings?.start_date ) ? settings.start_date : null;
  const first_date = ( settings?.first_date ) ? settings.first_date : null;
  const last_date = ( settings?.last_date ) ? settings.last_date : null;
  const first_day_no = ( typeof settings?.first_day_no !== 'undefined' ) ? settings.first_day_no : 1;
  this.setStartPickerProps( id, start_date, first_date, last_date, first_day_no );


  // Start date
  this.start_container.classList.add( 'datetime-container', 'fix-float' );
  this.start_container.insertAdjacentHTML( 'afterbegin', this.getHTMLButton( 'datetime' ) );
  this.showDateAndTime( this.start_container, this.start_date );

  this.start_date_btn = this.start_container.querySelector( 'button.date.start' );
  this.start_time_btn = this.start_container.querySelector( 'button.time.start' );
  this.start_picker = this.start_container.querySelector( 'div.picker' );

  this.start_date_btn.addEventListener( 'click', this.onOpenPicker );
  this.start_time_btn.addEventListener( 'click', this.onOpenPicker );
}
