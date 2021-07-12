/**
 * @module js/date-time-picker
 * @author Marcello Surdi
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
 * Creates a date time picker inside the `div` passed as parameter.
 *
 * Example:
 * ``` javascript
 * new DateTimePicker( 'id', {
   *  first_date: "2030-01-02T16:00:00",
   *  start_date: "2030-01-05T16:00:00",
   *  last_date: new Date( 2030, 0, 29, 16 ),
   *  first_day_no: 1,
   *  round_to: 15,
   *  date_output: "timestamp",
   *  styles: {
   *    active_background: '#e34c26',
   *    active_color: '#fff'
   *  }
 * } );
 * ```
 *

 * @param {string} id Id of the `div` element where to append the component
 * @param {object} [settings={}] Object with user defined settings
 */
export function DateTimePicker( id, settings = {} ) {
  PickerBase.call( this );


  // Settings
  this.i18n = ( settings.l10n ) ? settings.l10n : this.i18n;
  this.round_to = ( settings.round_to ) ? settings.round_to : false;
  this.date_output = ( settings.date_output ) ? settings.date_output : 'full_ISO';

  const start_date = ( settings.start_date ) ? settings.start_date : null;
  const first_date = ( settings.first_date ) ? settings.first_date : null;
  const last_date = ( settings.last_date ) ? settings.last_date : null;
  const first_day_no = ( typeof settings.first_day_no !== 'undefined' ) ? settings.first_day_no : 0;
  const styles = ( settings.styles ) ? settings.styles : {};
  this.setStartPickerProps( id, start_date, first_date, last_date, first_day_no );


  // Start date
  this.start_container.classList.add( 'datetime-container', 'fix-float' );
  this.start_container.insertAdjacentHTML( 'afterbegin', this.getHTML( 'start', 'datetime', styles ) );
  this.printDateAndTime( this.start_container, this.start_date );

  this.start_date_btn = this.start_container.querySelector( 'button.date.start' );
  this.start_time_btn = this.start_container.querySelector( 'button.time.start' );
  this.start_picker = this.start_container.querySelector( 'div.picker' );

  this.start_date_btn.addEventListener( 'click', this.onOpenPicker );
  this.start_time_btn.addEventListener( 'click', this.onOpenPicker );
}
