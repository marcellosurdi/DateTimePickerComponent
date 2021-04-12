/**
 * @module js/datepicker
 * @author Marcello Surdi
 * @version 1.0.0
 *
 * @desc
 * This module contains DatePicker class
 */

import { i18n } from './i18n';
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
  const self = this;

  const el = document.getElementById( id_div );
  if( el == null || el.nodeName != 'DIV' ) {
    return false;
  }

  // Settings
  let start_date = ( settings ) ? settings.start_date : null;
  let first_date = ( settings ) ? settings.first_date : null;
  let last_date = ( settings ) ? settings.last_date : null;
  let first_day_no = ( settings ) ? settings.first_day_no : 1;
  this.setPickerProps( el, start_date, first_date, last_date, first_day_no );

  this.start_container.classList.add( 'datetime-container' );
  this.start_container.insertAdjacentHTML( 'afterbegin',
    `<div class="date-container">
      <button type="button" class="date start">
        <span class="week-day">mon</span>
        <span class="month-day">00</span>
        <span class="month-year"><em>jan</em><br>2000</span>
      </button>
      <div class="picker"></div>
    </div>`
  );
  this.printDate( this.start_container, this.start_date );

  const start_date_btn = this.start_container.querySelector( 'button.date.start' );
  const start_picker_div = start_date_btn.nextElementSibling;

  this.start_date_btn = start_date_btn;
  this.start_picker_div = start_picker_div;

  start_date_btn.addEventListener( 'click', onOpenPicker );


  function onOpenPicker( e ) {
    // document.body.addEventListener( evt, self.ifClickOutside );

    // Se il pulsante ha già il focus lo toglie
		this.classList.toggle( 'active' );

    if( this.classList.contains( 'active' ) ) {
			// Apre il pannello corrente
			start_picker_div.style.display = 'block';
      self.showDateTable( start_picker_div, self.start_date );

			// Rende il contenuto del pannello corrente visibile in caso superi l'altezza del viewport
      // Mettere in un metodo a parte richiamato da this.showDateTable e this.showTimeTable
			// let box = e.currentTarget.getBoundingClientRect();
			// let h = box.top + e.currentTarget.offsetHeight + start_picker_div.offsetHeight;
			// let height_diff = h - document.documentElement.clientHeight
      //
			// if( height_diff > 0 ) {
			// 	window.scrollBy( 0, height_diff );
			// }
		} else {
			// Se si preme nuovamente il pulsante chiude il pannello aperto
			start_picker_div.style.display = 'none';
			// document.body.removeEventListener( evt, self.ifClickOutside );
		}
  }
}
