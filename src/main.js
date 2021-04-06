'use strict';

import './style.css';
import {i18n} from './i18n';
import {DateTimeIntervalPickerMixin} from './pickermixin.js';

function DatePicker( id_div, start_date, first_date, last_date, first_day_no ) {
  const self = this;
  self.setPickerDefaults( id_div, start_date, first_date, last_date, first_day_no );

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

  self.el_start.classList.add( 'interval-container' );
  self.el_start.insertAdjacentHTML( 'afterbegin',
    `<label for="${ 'id-' + self.start_date.getTime() }">${ i18n.start_label }</label>
    <div class="datetime start date interval-background">
      <span class="week-day">lun</span>
      <input id="${ 'id-' + self.start_date.getTime() }" value="00">
      <span class="month-year"><em>gen</em><br>2000</span>
    </div>
    <div class="picker"></div>`
  );
  self.printDate( self.el_start, self.start_date );

  const start_date_btn = self.el_start.querySelector( '.start.date' );
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


Object.assign( DatePicker.prototype, DateTimeIntervalPickerMixin );
new DatePicker( 'select_date',null,null,null,4 /*, new Date( 2021, 0, 4, 23, 0, 22 ), new Date( 2021, 0, 2, 23, 0, 22 ), new Date( 2020, 0, 15, 23, 0, 22 )*/ );
// console.log( new Date( 2023, 1, 5, 23, 0, 22 ).getTime() / 1000 );


new DatePicker( 'select_date_2', null, null, null, 1 );
