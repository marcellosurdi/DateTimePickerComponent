/**
 * @module js/date-picker
 * @author Marcello Surdi
 * @version 1.0.0
 *
 * @desc
 * This module contains the DatePicker class
 */

import { PickerBase } from './picker-base';

DatePicker.prototype = Object.create( PickerBase.prototype );
DatePicker.prototype.constructor = DatePicker;





/**
 * @class
 *
 * @classdesc
 * Creates a date picker inside the `div` passed as parameter
 *
 * @param {string} id Id of the `div` element where to append the component
 * @param {object} [settings={}] Object with user defined settings
 *
 * @example
 * // In settings object you can use either a date string (in ISO format) or a date object
 * new DatePicker( 'id', {
 *  first_date: "2021-01-02",
 *  start_date: "2021-01-05",
 *  last_date: new Date( 2021, 0, 29 )
 * } );
 */
export function DatePicker( id, settings = {} ) {
  PickerBase.call( this );


  // Settings
  this.i18n = ( settings?.i18n ) ? settings.i18n : this.i18n;
  this.date_output = ( settings?.date_output ) ? settings.date_output : 'short_ISO';

  const start_date = ( settings?.start_date ) ? settings.start_date : null;
  const first_date = ( settings?.first_date ) ? settings.first_date : null;
  const last_date = ( settings?.last_date ) ? settings.last_date : null;
  const first_day_no = ( typeof settings?.first_day_no !== 'undefined' ) ? settings.first_day_no : 1;
  this.setStartPickerProps( id, start_date, first_date, last_date, first_day_no );


  // Start date
  this.start_container.classList.add( 'datetime-container', 'fix-float' );
  this.start_container.insertAdjacentHTML( 'afterbegin', this.getHTMLButton() );
  this.showDateAndTime( this.start_container, this.start_date );

  this.start_date_btn = this.start_container.querySelector( 'button.date.start' );
  this.start_picker = this.start_container.querySelector( 'div.picker' );

  this.start_date_btn.addEventListener( 'click', this.onOpenPicker );
}
