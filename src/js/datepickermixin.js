/**
 * @module js/datepickermixin
 * @author Marcello Surdi
 * @version 1.0.0
 *
 * @desc
 * This module contains a mixin object with methods for DatePicker class
 */

import { i18n } from './i18n';





/**
 * @mixin
 * @memberof module:js/datepickermixin
 *
 * @desc
 * This is a mixin object that contains methods for DatePicker class. It can be implemented by copying methods into their prototype
 */
export const DatePickerMixin = {
  ms_per_day: 24 * 60 * 60 * 1000,
  default_days_order: [ 'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat' ],
  months_label: [ 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec' ],
  months_fullname: [ 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december' ],

  /**
   * @memberof module:js/datepickermixin.exports.DatePickerMixin
   *
   * @desc
   * Returns a date based on these precedence criteria:
   * - the date provided in a hidden input field (if any) takes priority over other dates;
   * - then follows the date provided as parameter of setPickerProps method;
   * - default date comes last.
   *
   * @param {Date} date_default Default date
   * @param {Date|string} date_param The date provided as parameter of setPickerProps method
   * @param {HTMLInputElement|null} input A hidden input field with ISO date string in its value attribute
   * @return {Date}
   *
   * @see {@link module:js/datepickermixin.exports.DatePickerMixin.isISOFormat|isISOFormat}
   */
  getDateBetween( date_default, date_param, input ) {
    if( typeof date_param == 'string' && this.isISOFormat( date_param ) ) {
        date_param = new Date( date_param )
    }

    // Date may be invalid even if isISOFormat returns true (for istance '2015-13-25T12:00:00'), that's why we have to check it with isNan
    const date = ( date_param instanceof Date && !isNaN( date_param ) ) ? date_param : date_default;

    let prev_date = input?.value;
    if( prev_date && this.isISOFormat( prev_date ) ) {
      prev_date = new Date( prev_date );
    }

    return ( !isNaN( prev_date ) ) ? prev_date : date;
  },





  /**
   * @memberof module:js/datepickermixin.exports.DatePickerMixin
   *
   * @desc
   * Returns the day of the week as number accordingly to `this.user_days_order` (if any) or `date.getDay` method.
   *
   * @param {Date} date Date from which to get the day of the week
   * @return {number} The day of the week as number
   */
  getWeekDayNo( date ) {
    let week_day = date.getDay();

    if( this.user_days_order ) {
      week_day = this.user_days_order.indexOf( this.default_days_order[ week_day ] );
    }

    return week_day;
  },





  /**
   * @memberof module:js/datepickermixin.exports.DatePickerMixin
   *
   * @desc
   * Checks if `iso_date` has the right ISO format (it doesn't do date validation).
   *
   * Accepted values:
   * - '2015-03-25'
   * - '2015-03-25T12:00:00'
   * - '2015-03-25T12:00:00Z'
   * - '2015-03-25T12:00:00-06:30'
   *
   * Rejected values:
   * - '2015-**3**-25'
   * - '2015-**13**-25T12:00:00'
   *
   * ...and so on
   *
   * @param {string} iso_date date string
   * @return {boolean} `true` if format is valid, `false` otherwise
   */
  isISOFormat( iso_date ) {
		return ( iso_date.match( /^(\d{4})-(\d{2})-(\d{2})(T\d{2}\:\d{2}\:\d{2}[+-]\d{2}\:\d{2})?|Z$/ ) ) ? true : false
	},





  /**
   * @memberof module:js/datepickermixin.exports.DatePickerMixin
   *
   * @desc
   * Displays a date in its own button
   *
   * @param {HTMLDivElement} div The `div` element in which to display the date
   * @param {Date} date The date to be displayed
   */
  printDate( div, date ) {
    const [ week_day_span, month_day_input, month_year_span ] = div.querySelectorAll( 'div.date > *' );
    const week_day_number = this.getWeekDayNo( date );

    week_day_span.textContent = i18n[ this.days_order[ week_day_number ] ];
    month_day_input.value = ( '0' + date.getDate() ).slice( -2 );
    month_year_span.innerHTML = `<em data-i18n="${this.months_label[ date.getMonth() ]}">${i18n[ this.months_label[ date.getMonth() ] ]}</em><br>${date.getFullYear()}`;
  },





  /**
   * @memberof module:js/datepickermixin.exports.DatePickerMixin
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
   * @memberof module:js/datepickermixin.exports.DatePickerMixin
   *
   * @desc
   * Initializes picker start values
   *
   * @param {HTMLDivElement} el `div` element that will contain the button
   * @param {Date} [start_date_param] Start selected date
   * @param {Date} [first_date_param] First selectable date
   * @param {Date} [last_date_param] Last selectable date
   * @param {number} [first_day_no] Day with which the week must start. Accordingly to returned values of `Date.getDate` method, accepted range values are 0-6 where 0 means Sunday, 1 means Monday and so on
   *
   * @see {@link module:js/datepickermixin.exports.DatePickerMixin.getDateBetween|getDateBetween}
   * @see {@link module:js/datepickermixin.exports.DatePickerMixin.roundMinutes|roundMinutes}
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
   * @memberof module:js/datepickermixin.exports.DatePickerMixin
   *
   * @desc
	 * Creates the calendar for the current month
	 *
	 * @param {HTMLDivElement} picker The panel that contains the calendar for day selection
	 * @param {Date} date Current date
   *
   * @see {@link module:js/datepickermixin.exports.DatePickerMixin.getWeekDayNo|getWeekDayNo}
   * @see {@link module:js/datepickermixin.exports.DatePickerMixin.getDayClassName|getDayClassName}
	 */
	showDateTable( picker, date ) {
		let class_name, html = '';

		const month = date.getMonth();
		const year = date.getFullYear();

		// February length
		const feb = ( ( year % 100 != 0 ) && ( year % 4 == 0 ) || ( year % 400 == 0 ) ) ? 29 : 28;
		const total_days = [ '31', feb, '31', '30', '31', '30', '31', '31', '30', '31', '30', '31' ];

    // First day of current month as number
		let week_day = this.getWeekDayNo( new Date( year, month, 1 ) );


		this.prev_month = new Date( year, ( month - 1 ), 1, date.getHours(), date.getMinutes() );
		const prev_month_total_days = total_days[ this.prev_month.getMonth() ];

		let i = 0
    let j = week_day;
    // This loop displays the last days of the previous month
		while( j > 0 ) {
			i = ( prev_month_total_days - ( j - 1 ) );
			class_name = this.getDayClassName( i, this.prev_month );
			html += `<td class="prev-month ${ class_name }">${ i }</td>`;
			j--;
		}


    this.current_month = new Date( date.getTime() );
		i = 1;
    // This loop displays the days of the current month
		while ( i <= total_days[ month ] ) {
			// Starts a new row
			if( week_day > 6 ) {
				week_day = 0;
				html += "</tr><tr>";
			}

			class_name = this.getDayClassName( i, this.current_month );
      html += `<td class="${ class_name }">${ i }</td>`;

			week_day++;
			i++;
		}

		this.next_month = new Date( year, ( month + 1 ), 1, date.getHours(), date.getMinutes() );
    // This loop displays the first days of the next month
		for( i = 1; week_day <= 6; week_day++, i++ ) {
			class_name = this.getDayClassName( i, this.next_month );
      html += `<td class="next-month ${ class_name }">${ i }</td>`;
		}

		picker.innerHTML =
			`<table class="date">
				<tr>
					<th><a href="javascript:void(0);" class="prev-month">&laquo;</a></th>
					<th colspan="5">
						<span data-i18n="${ this.months_fullname[ month ] }">${ i18n[ this.months_fullname[ month ] ] }</span>
						<span class="number">${ year }</span>
					</th>
					<th><a href="javascript:void(0);" class="next-month">&raquo;</a></th>
				</tr>
				<tr>
					<td class="day-label" data-i18n="${ this.days_order[0] }">${ i18n[ this.days_order[0] ] }</td>
					<td class="day-label" data-i18n="${ this.days_order[1] }">${ i18n[ this.days_order[1] ] }</td>
					<td class="day-label" data-i18n="${ this.days_order[2] }">${ i18n[ this.days_order[2] ] }</td>
					<td class="day-label" data-i18n="${ this.days_order[3] }">${ i18n[ this.days_order[3] ] }</td>
					<td class="day-label" data-i18n="${ this.days_order[4] }">${ i18n[ this.days_order[4] ] }</td>
					<td class="day-label" data-i18n="${ this.days_order[5] }">${ i18n[ this.days_order[5] ] }</td>
					<td class="day-label" data-i18n="${ this.days_order[6] }">${ i18n[ this.days_order[6] ] }</td>
				</tr>
				<tr>
				${ html }
				</tr>
			</table>`;

    // Previous month button
		this.prev_month.setDate( prev_month_total_days );
		const prev_month_btn = picker.querySelector( '.prev-month' );
		if( this.prev_month >= this.first_date ) {
			prev_month_btn.addEventListener( 'click', () => this.showDateTable( picker, this.prev_month ) );
		}
		else {
			prev_month_btn.classList.add( 'disabled' );
		}

    // Next month button
		const next_month_btn = picker.querySelector( '.next-month' );
		if( this.last_date > this.next_month ) {
			next_month_btn.addEventListener( 'click', () => this.showDateTable( picker, this.next_month ) );
		}
		else {
			next_month_btn.classList.add( 'disabled' );
		}

		// this.addEventOnSelect();
	},

  /**
   * @memberof module:js/datepickermixin.exports.DatePickerMixin
   *
   * @desc
	 * Ricava le classi da assegnare agli elementi `td` che contengono i giorni nei calendari
	 * Utilizzato all'interno di un ciclo iterativo sia in fase di inizializzazione della tabella sia in fase di aggiornamento della stessa
	 *
	 * @param {string} day Il giorno corrente all'interno del ciclo iterativo
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
