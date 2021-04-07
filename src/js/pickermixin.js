/**
 * @module js/pickermixin
 * @author Marcello Surdi
 * @version 1.0.0
 *
 * @desc
 * This is a *mixin object* that contains methods for other functions. It can be implemented by copying methods into prototype
 */


import { i18n } from './i18n';

/**
 * @namespace
 * @memberof module:js/pickermixin
 */
export const DateTimeIntervalPickerMixin = {
  ms_per_day: 24 * 60 * 60 * 1000,
  default_days_order: [ 'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat' ],
  months_fullname: [ 'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre' ],
  months_label: [ 'gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic' ],

  /**
   * @memberof module:js/pickermixin.exports.DateTimeIntervalPickerMixin
   *
   * @desc
   * Initializes the default values.
   *
   * @param {HTMLDivElement} el &lt;div&gt; element that will contain the button
   * @param {Date} [start_date_param] Start selected date
   * @param {Date} [first_date_param] First selectable date
   * @param {Date} [last_date_param] Last selectable date
   * @param {number} [first_day_no] Day with which the week must start. Accepted range values are 0-6 (accordingly to returned values of Date.getDate() method) where 0 means Sunday, 1 means Monday and so on
   *
   * @see {@link module:js/pickermixin.exports.DateTimeIntervalPickerMixin.getDateBetween|getDateBetween}
   * @see {@link module:js/pickermixin.exports.DateTimeIntervalPickerMixin.roundMinutes|roundMinutes}
   */
  setPickerProps( el, start_date_param, first_date_param, last_date_param, first_day_no ) {
    // Default start selected date is one day more than current date
    const start_date_default = new Date( Date.now() + this.ms_per_day );
    let start_date = this.getDateBetween( start_date_default, start_date_param, el.querySelector( 'input.start_date' ) );

    // Default first selectable date is the current date
    const first_date_default = new Date;
    let first_date = this.getDateBetween( first_date_default, first_date_param, el.querySelector( 'input.first_date' ) );
    // Start selected date must be greater than or equal to first selectable date
    if( start_date.getTime() < first_date.getTime() ) {
      first_date = start_date;
    }

    // Default last selectable date is one year more than start selected date
    const last_date_default = new Date( start_date.getTime() + ( this.ms_per_day * 365 ) );
    let last_date = this.getDateBetween( last_date_default, last_date_param, el.querySelector( 'input.last_date' ) );
    // Last selectable date must be greater than start selected date
    if( last_date.getTime() < start_date.getTime()  ) {
      last_date = last_date_default;
    }

    start_date = this.roundMinutes( start_date );
    // console.log( start_date );
    first_date = this.roundMinutes( first_date );
    // console.log( first_date );
    last_date = this.roundMinutes( last_date );
    // console.log( last_date );

    first_day_no = +first_day_no;
    if( first_day_no > 6 ) {
      first_day_no = 6;
    }

    if( first_day_no > 0 ) {
      const array2 = this.default_days_order.slice( 0, first_day_no );
      const array1 = this.default_days_order.slice( first_day_no, this.default_days_order.length );
      this.user_days_order = array1.concat( array2 );
    }

    this.el_start = el;
    this.start_date = start_date;
    this.first_date = first_date;
    this.last_date = last_date;
    this.days_order = ( this.user_days_order ) ? this.user_days_order : this.default_days_order;
  },





  /**
   * @memberof module:js/pickermixin.exports.DateTimeIntervalPickerMixin
   *
   * @desc
   * Returns a date based on these criteria:
   * - the date provided as timestamp value in a hidden input field (if any) takes priority over other dates;
   * - then follows the date provided as parameter of setPickerProps method;
   * - default date comes last.
   *
   * @param {Date} date_default Default date
   * @param {Date} date_param The date provided as parameter of setPickerProps method
   * @param {HTMLInputElement|null} input A hidden input field with timestamp value
   * @return {Date}
   */
  getDateBetween( date_default, date_param, input ) {
    const date = ( date_param instanceof Date ) ? date_param : date_default;

    let prev_date = +input?.value;
    if( prev_date > 0 ) {
      prev_date = new Date( prev_date * 1000 );
    }

    return prev_date || date;
  },





  /**
   * @memberof module:js/pickermixin.exports.DateTimeIntervalPickerMixin
   *
   * @desc
   * Rounds minutes in intervals of 30.
   *
   * @param {Date} date The date to be rounded
   * @return {Date} The rounded date
   */
  roundMinutes( date ) {
    date.setSeconds( 0, 0 );

    let m = date.getMinutes();
    let h = date.getHours();
    if( m > 0 && m <= 30 ) {
      m = 30;
    }
    else if( m > 30 ) {
      m = 0;
      // If we round the minutes to 0 we have to take one more hour into account
      h = h + 1;
      // If, after rounding, midnight is reached, we have to take one more day into account
      if( h == 24 ) {
        h = 0;
        date = new Date( date.getTime() + this.ms_per_day );
      }
    }
    date.setHours( h, m );

    return date;
  },





  /**
   * Visualizza una data in un pulsante
   *
   * @param {HTMLDivElement} div L'elemento <div> in cui visualizzare le informazioni di data
   * @param {Date} date La data da visualizzare
   */
  printDate( div, date ) {
    const [ week_day_span, month_day_input, month_year_span ] = div.querySelectorAll( 'div.date > *' );
    const week_day_number = this.getWeekDayNo( date );

    week_day_span.textContent = i18n[ this.days_order[ week_day_number ] ];
    month_day_input.value = ( '0' + date.getDate() ).slice( -2 );
    month_year_span.innerHTML = `<em data-i18n="${this.months_label[ date.getMonth() ]}">${i18n[ this.months_label[ date.getMonth() ] ]}</em><br>${date.getFullYear()}`;
  },

  /**
   * Restituisce il giorno della settimana come numero (0 - Lunedì, 6 - Domenica)
   *
   * @param {Date} date Oggetto data da cui ricavare il giorno della settimana
   * @return {number} Il giorno della settimana espresso in numero
   */
  getWeekDayNo( date ) {
    let week_day = date.getDay();

    if( this.user_days_order ) {
      week_day = this.user_days_order.indexOf( this.default_days_order[ week_day ] );
    }

    return week_day;
  },

  /**
	 * Genera il calendario per la scelta della data di ritiro o consegna
	 *
	 * @param {HTMLDivElement} picker Il pannello che contiene il calendario per la scelta della data
	 * @param {Date} date La data che contiene le informazioni relative a mese e anno corrente
	 */
	showDateTable( picker, date ) {
		let class_name, html = '';

		let month = date.getMonth();
		let year = date.getFullYear();

		this.current_month = new Date( date.getTime() );

		// Determina la durata del mese di Febbraio
		let feb = ( ( year % 100 != 0 ) && ( year % 4 == 0 ) || ( year % 400 == 0 ) ) ? 29 : 28;
		let total_days = [ '31', '' + feb + '', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31' ];

    // Determina il numero del giorno della settimana del primo giorno del mese corrente
		let week_day = this.getWeekDayNo( new Date( year, month, 1 ) );

		this.prev_month = new Date( year, ( month - 1 ), 1, date.getHours(), date.getMinutes() );
		let prev_month_total_days = total_days[ this.prev_month.getMonth() ];

		let j = week_day;

		let i = 0
    // Stampa i giorni del mese precedente
		while( j > 0 ) {
			i = ( prev_month_total_days - ( j - 1 ) );
			class_name = this.getDayClassName( i, this.prev_month );
			html += "<td class='prev-month " + class_name + "'>" + i + "</td>";
			j--;
		}

		i = 1;
    // Stampa i giorni del mese corrente
		while ( i <= total_days[ month ] ) {
			// Determina quando comincia una nuova riga
			if( week_day > 6 ) {
				week_day = 0;
				html += "</tr><tr>";
			}

			class_name = this.getDayClassName( i, date );
			html += "<td class='" + class_name + "'>" + i + "</td>";

			week_day++;
			i++;
		}

		this.next_month = new Date( year, ( month + 1 ), 1, date.getHours(), date.getMinutes() );
    // Stampa i giorni del mese successivo
		for( i = 1; week_day <= 6; week_day++, i++ ) {
			class_name = this.getDayClassName( i, this.next_month );
			html += "<td class='next-month " + class_name + "'>" + i + "</td>";
		}

		picker.innerHTML =
			"<table class='date'>" +
				"<tr>" +
					"<th><a href='javascript:void(0);' class='prev-month'>&laquo;</a></th>" +
					"<th colspan='5'>" +
						"<span data-i18n='" + this.months_fullname[ month ] + "'>" + i18n[ this.months_fullname[ month ] ] +"</span> " +
						"<span class='number'>" + year + "</span>" +
					"</th>" +
					"<th><a href='javascript:void(0);' class='next-month'>&raquo;</a></th>" +
				"</tr>" +
				"<tr>" +
					"<td class='day-label' data-i18n='" + this.days_order[0] + "'>" + i18n[ this.days_order[0] ] + "</td>" +
					"<td class='day-label' data-i18n='" + this.days_order[1] + "'>" + i18n[ this.days_order[1] ] + "</td>" +
					"<td class='day-label' data-i18n='" + this.days_order[2] + "'>" + i18n[ this.days_order[2] ] + "</td>" +
					"<td class='day-label' data-i18n='" + this.days_order[3] + "'>" + i18n[ this.days_order[3] ] + "</td>" +
					"<td class='day-label' data-i18n='" + this.days_order[4] + "'>" + i18n[ this.days_order[4] ] + "</td>" +
					"<td class='day-label' data-i18n='" + this.days_order[5] + "'>" + i18n[ this.days_order[5] ] + "</td>" +
					"<td class='day-label' data-i18n='" + this.days_order[6] + "'>" + i18n[ this.days_order[6] ] + "</td>" +
				"</tr>" +
				"<tr>" +
				html +
				"</tr>" +
			"</table>";

    return;

		prev_month.setDate( prev_month_total_days );
		let prev_month_btn = picker.querySelector( '.prev-month' );
		if( prev_month >= min_date ) {
			prev_month_btn.addEventListener( 'click', this.showDateTable.bind( this, picker, prev_month ) );
		}
		else {
			prev_month_btn.classList.add( 'disabled' );
		}

		let next_month_btn = picker.querySelector( '.next-month' );
		if( max_date > next_month ) {
			next_month_btn.addEventListener( 'click', this.showDateTable.bind( this, picker, next_month ) );
		}
		else {
			next_month_btn.classList.add( 'disabled' );
		}

		this.addEventOnSelect();
	},

  /**
	 * Ricava le classi da assegnare agli elementi <td> che contengono i giorni nei calendari
	 * Utilizzato all'interno di un ciclo iterativo sia in fase di inizializzazione della tabella sia in fase di aggiornamento della stessa
	 *
	 * @param {string} day Il giorno corrente corrente all'interno del ciclo iterativo
	 * @param {Date} date La data che contiene le informazioni relative al mese corrente
	 * @return {string} Le classi da assegnare all'elemento <td> corrente all'interno del ciclo iterativo
	 */
	getDayClassName( day, date ) {
		let class_name, if_btn;

		// Non tiene conto delle informazioni dell'orario
		let start_date_ms = new Date( this.start_date.getFullYear(), this.start_date.getMonth(), this.start_date.getDate() ).getTime();
		let curr_day_ms = new Date( date.getFullYear(), date.getMonth(), day ).getTime();
		let min_date_ms = new Date( this.first_date.getFullYear(), this.first_date.getMonth(), this.first_date.getDate() ).getTime();
		let max_date_ms = new Date( this.last_date.getFullYear(), this.last_date.getMonth(), this.last_date.getDate() ).getTime();

		class_name = 'day ';
		// Giorni non disponibili per la prenotazione
		if( curr_day_ms < min_date_ms || curr_day_ms > max_date_ms ) {
			class_name += 'disabled';
		} else {
		  // Giorno disponibile per la prenotazione
			class_name += 'selectable';
		}

		// Giorno di inizio intervallo
		if( curr_day_ms == start_date_ms ) {
			if_btn = ( this?.mode == 'start' ) ? 'active-a-background' : 'active-b-background';
			class_name += ' start ' + if_btn;
		}

    if( this.end_date ) {
      let end_date_ms = new Date( this.end_date.getFullYear(), this.end_date.getMonth(), this.end_date.getDate() ).getTime();

  		// Giorno compreso nell'intervallo
  		if( curr_day_ms > start_date_ms && curr_day_ms < end_date_ms ) {
  			class_name += ' interval-background';
  		}
  		// Giorno di fine intervallo
  		if( curr_day_ms == end_date_ms ) {
  			if_btn = ( mode == 'end' ) ? 'active-a-background' : 'active-b-background';
  			class_name += ' end ' + if_btn;
  		}
    }

		return class_name;
	},
}
