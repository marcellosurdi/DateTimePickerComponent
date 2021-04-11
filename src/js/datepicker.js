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
 */
export function DatePicker( id_div, settings ) {
  const self = this;

  const el = document.getElementById( id_div );
  if( el == null || el.nodeName != 'DIV' ) {
    return false;
  }

  let start_date = ( settings ) ? settings.start_date : null;
  let first_date = ( settings ) ? settings.first_date : null;
  let last_date = ( settings ) ? settings.last_date : null;
  let first_day_no = ( settings ) ? settings.first_day_no : 1;

  self.setPickerProps( el, start_date, first_date, last_date, first_day_no );

  /**
	 * La data che contiene tutte le informazioni relative al mese precedente rispetto a quello selezionato
	 * @member {Date}
	 * @see DatePicker#showDateTable
	 */
	self.prev_month = null;

	/**
	 * La data che contiene tutte le informazioni relative al mese selezionato
	 * @member {Date}
	 * @see DatePicker#showDateTable
	 */
	self.current_month = null;

	/**
	 * La data che contiene tutte le informazioni relative al mese successivo rispetto a quello selezionato
	 * @member {Date}
	 * @see DatePicker#showDateTable
	 */
	self.next_month = null;

  self.el_start.classList.add( 'datetime-container' );
  self.el_start.insertAdjacentHTML( 'afterbegin',
    `<div class="datetime date start">
      <span class="week-day">lun</span>
      <span class="month-day">00</span>
      <span class="month-year"><em>gen</em><br>2000</span>
    </div>
    <div class="picker"></div>`
  );
  self.printDate( self.el_start, self.start_date );

  const start_date_btn = self.el_start.querySelector( '.date.start' );
  const start_picker_div = start_date_btn.nextElementSibling;

  start_date_btn.addEventListener( 'click', onOpenPicker );


  function onOpenPicker( e ) {
    // document.body.addEventListener( evt, self.ifClickOutside );

    // Se il pulsante ha già il focus lo toglie
		this.classList.toggle( 'active-a-background' );

    if( this.classList.contains( 'active-a-background' ) ) {
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
