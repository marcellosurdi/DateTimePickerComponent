/**
 * @module js/datepickermixin
 * @author Marcello Surdi
 * @version 1.0.0
 *
 * @desc
 * This module contains a mixin object with methods for DatePicker class
 */


 if( !Element.prototype.matches ) {
   Element.prototype.matches =
     Element.prototype.matchesSelector ||
     Element.prototype.mozMatchesSelector ||
     Element.prototype.msMatchesSelector ||
     Element.prototype.oMatchesSelector ||
     Element.prototype.webkitMatchesSelector
 }


/**
 * @mixin
 * @memberof module:js/datepickermixin
 *
 * @desc
 * This is a mixin object that contains methods for DatePicker class. It can be implemented by copying methods into their prototype
 */
export const DatePickerMixin = {
  ms_per_day: 24 * 60 * 60 * 1000,
  i18n: {
    'jan':'jan',
    'feb':'feb',
    'mar':'mar',
    'apr':'apr',
    'may':'may',
    'jun':'jun',
    'jul':'jul',
    'aug':'aug',
    'sep':'set',
    'oct':'sep',
    'nov':'nov',
    'dec':'dec',
    'january':'January',
    'february':'February',
    'march':'March',
    'april':'April',
    'may':'May',
    'june':'June',
    'july':'July',
    'august':'August',
    'september':'September',
    'october':'October',
    'november':'November',
    'december':'December',
    'mon':'mon',
    'tue':'tue',
    'wed':'wed',
    'thu':'thu',
    'fri':'fri',
    'sat':'sat',
    'sun':'sun',
    'lunedi':'Monday',
    'martedi':'Tuesday',
    'mercoledi':'Wednesday',
    'giovedi':'Thursday',
    'venerdi':'Friday',
    'sabato':'Saturday',
    'domenica':'Sunday',
  },
  default_days_order: [ 'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat' ],
  months_label: [ 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec' ],
  months_fullname: [ 'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december' ],
  click: ( navigator.userAgent.match( /(iPad|iPhone|iPod)/g ) ) ? 'touchstart' : 'click',

  /**
   * @memberof module:js/datepickermixin.exports.DatePickerMixin
   *
   * @desc
   * Returns a date depending on these precedence criteria:
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
	 * Gets the classes for `td` elements that contain the days of calendar.
	 * It's used inside a loop both when building table and when updating it.
	 *
	 * @param {string} day Current day inside a loop
	 * @param {Date} date Date object with the year/month info
	 * @return {string} Classes to be assigned to the current `td` element
	 */
	getDayClassName( day, date ) {
		let class_name;

		// We don't take hours/minutes/seconds info into account for subsequent date comparisons
    const today = new Date();
    today.setHours( 0, 0, 0, 0 );
    const today_ms = today.getTime();
		const start_date_ms = new Date( this.start_date.getFullYear(), this.start_date.getMonth(), this.start_date.getDate() ).getTime();
		const curr_day_ms = new Date( date.getFullYear(), date.getMonth(), day ).getTime();
		const first_date_ms = new Date( this.first_date.getFullYear(), this.first_date.getMonth(), this.first_date.getDate() ).getTime();
		const last_date_ms = new Date( this.last_date.getFullYear(), this.last_date.getMonth(), this.last_date.getDate() ).getTime();

		class_name = 'day ';
		if( curr_day_ms < first_date_ms || curr_day_ms > last_date_ms ) {
			class_name += 'disabled ';
		} else {
			class_name += 'selectable ';
		}

    if( curr_day_ms == today_ms ) {
      class_name += 'today ';
    }

		if( curr_day_ms == start_date_ms ) {
			class_name += 'start-day ';
		}

    // -- Only for intervals--
    // if( this.end_date ) {
    //   let end_date_ms = new Date( this.end_date.getFullYear(), this.end_date.getMonth(), this.end_date.getDate() ).getTime();
    //
  	// 	// Giorno compreso nell'intervallo
  	// 	if( curr_day_ms > start_date_ms && curr_day_ms < end_date_ms ) {
  	// 		class_name += ' interval-background';
  	// 	}
  	// 	// Giorno di fine intervallo
  	// 	if( curr_day_ms == end_date_ms ) {
  	// 		class_name += ' end-day ';
  	// 	}
    // }

		return class_name;
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
   * Accepted values: '2015-03-25', '2015-03-25T12:00:00', '2015-03-25T12:00:00Z', '2015-03-25T12:00:00-06:30'
   *
   * Rejected values: '2015-**3**-25', '2015-**13**-25T12:00:00'
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
   * Displays date and time in their own button.
   * output_date...
   *
   * @param {HTMLDivElement} div The `div` element in which to display the date
   * @param {Date} date The date to be displayed
   */
  printDateAndTime( div, date ) {
    const [ week_day_span, month_day, month_year_span ] = div.querySelectorAll( 'button.date > *' );
    const week_day_number = this.getWeekDayNo( date );

    week_day_span.textContent = this.i18n[ this.days_order[ week_day_number ] ];
    month_day.textContent = ( '0' + date.getDate() ).slice( -2 );
    month_year_span.innerHTML = `<em data-i18n="${this.months_label[ date.getMonth() ]}">${this.i18n[ this.months_label[ date.getMonth() ] ]}</em><br>${date.getFullYear()}`;

    // if time

    let output_date;
    // Offset in milliseconds (Date.getTimezoneOffset returns minutes)
    var time_zone_offset = ( new Date() ).getTimezoneOffset() * 60000;
    // toISOString with timezone offset (the slice(0, -1) gets rid of the trailing Z)
    var full_iso = ( new Date( date.getTime() - time_zone_offset ) ).toISOString().slice( 0, -1 );
    switch( this.date_output ) {
      // YYYY-MM-DDTHH:mm:ss.sss
      case 'full_ISO': output_date = full_iso; break;
      // YYYY-MM-DD
      case 'short_ISO': [ output_date, ] = full_iso.split( 'T' ); break;
      case 'timestamp':
      default:
        output_date = Math.round( date.getTime() / 1000 );
      break;
    }

    div.querySelector( 'input.output_date' ).value = output_date;
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

    this.start_container = el;
    this.start_date = start_date;
    this.first_date = first_date;
    this.last_date = last_date;
    this.days_order = ( this.user_days_order ) ? this.user_days_order : this.default_days_order;
  },





  /**
   * @memberof module:js/datepickermixin.exports.DatePickerMixin
   *
   * @desc
	 * Creates the calendar for the current month.
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
						<span data-i18n="${ this.months_fullname[ month ] }">${ this.i18n[ this.months_fullname[ month ] ] }</span>
						<span class="number">${ year }</span>
					</th>
					<th><a href="javascript:void(0);" class="next-month">&raquo;</a></th>
				</tr>
				<tr>
					<td class="day-label" data-i18n="${ this.days_order[0] }">${ this.i18n[ this.days_order[0] ] }</td>
					<td class="day-label" data-i18n="${ this.days_order[1] }">${ this.i18n[ this.days_order[1] ] }</td>
					<td class="day-label" data-i18n="${ this.days_order[2] }">${ this.i18n[ this.days_order[2] ] }</td>
					<td class="day-label" data-i18n="${ this.days_order[3] }">${ this.i18n[ this.days_order[3] ] }</td>
					<td class="day-label" data-i18n="${ this.days_order[4] }">${ this.i18n[ this.days_order[4] ] }</td>
					<td class="day-label" data-i18n="${ this.days_order[5] }">${ this.i18n[ this.days_order[5] ] }</td>
					<td class="day-label" data-i18n="${ this.days_order[6] }">${ this.i18n[ this.days_order[6] ] }</td>
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

    // Adds click handlers to td.selectable elements
    const coll = document.querySelectorAll( 'td.selectable' );

		for( let n = coll.length, i = 0; i < n; i++ ) {
			coll[ i ].addEventListener( 'click', ( e ) => this.onSelectDayOrHour( e ) );
		}
	},





  /**
	 * Metodo eseguito quando l'utente clicca uno dei quattro pulsanti per selezionare una data o un orario di ritiro o consegna
	 *
	 * @param {MouseEvent} e
	 * @see showDateTable
	 * @see showTimeTable
	 */
	onOpenPicker( e ) {
    const btn = e.currentTarget;
		let div_open, div_close, date;

		// Se il pulsante ha già il focus lo toglie
		btn.classList.toggle( 'active' );

		// // Toglie il focus dagli altri pulsanti
		// let coll = document.querySelectorAll( 'div#' + el_start.id + ' > div, div#' + el_end.id + ' > div' );
		// for( let i = 0; i < coll.length; i++ ) {
		// 	if( coll[ i ] != this ) {
		// 		coll[ i ].classList.remove( 'active' );
		// 	}
		// }

    // Stabilisce se occorre impostare la data di inizio o fine intervallo
    if( btn.classList.contains( 'start' ) ) {
    	div_open = this.start_picker_div;
    	// div_close = end_picker_div;
    	date = this.start_date;
    	// mode = 'start';
    } else {
    	// div_open = end_picker_div;
    	// div_close = start_picker_div;
    	// date = end_date;
    	// mode = 'end';
    }

    if( !div_open.ifOutside ) {
      div_open.ifOutside = ( e ) => this.ifOutside( e );
    }
		document.body.addEventListener( this.click, div_open.ifOutside );

		if( btn.classList.contains( 'active' ) ) {
			// Apre il pannello corrente
			div_open.style.display = 'block';
			// // Se un altro pannello è aperto lo chiude
			// div_close.style.display = 'none';
			let substr = ( btn.classList.contains( 'date' ) )? 'Date' : 'Time';
			let method = 'show' + substr + 'Table';
			this[ method ]( div_open, date );

			// Check if panel exceeds viewport height
      const rect = div_open.getBoundingClientRect();
      const diff = ( rect.top + div_open.offsetHeight ) - document.documentElement.clientHeight

			if( diff > 0 ) {
        // If scroll behavior is supported
        if( 'scrollBehavior' in document.documentElement.style ) {
          window.scrollBy( {
            top: diff,
            left: 0,
            behavior: 'smooth'
          } );
        } else {
  				window.scrollBy( 0, diff );
        }
			}
		} else {
			// Se si preme nuovamente il pulsante chiude il pannello aperto
			div_open.style.display = 'none';
			document.body.removeEventListener( this.click, div_open.ifOutside );
		}
	},

  /**
	 * Chiude il pannello se l'utente clicca fuori da questo
	 *
	 * @param {Event} e
	 */
	ifOutside( e ) {
		let div = ( this.mode == 'start' ) ? this.start_picker_div : this.end_picker_div;

    if( e.type == 'touchstart' ) {
      e.clientX = e.touches[0].clientX;
      e.clientY = e.touches[0].clientY;
    }
		let el = document.elementFromPoint( e.clientX, e.clientY );
		let inside = false;

    do {
      if( el.matches( `#${ this.start_container.id }.datetime-container` ) ) {
        inside = true;
      }
      el = el.parentElement || el.parentNode;
    } while( el !== null && el.nodeType === 1 );

		if( !inside )  {
      document.body.removeEventListener( this.click, div.ifOutside );

      div.previousElementSibling.querySelector( '.active' ).classList.remove( 'active' );
  		div.style.display = 'none';
		}
	},

  /**
   * @memberof module:js/datepickermixin.exports.DatePickerMixin
   *
   * @desc
   * This is a click handler triggered when user clicks to select either a day or an hour.
   * It passes an object as parameter to `this.selectDay` or to `this.selectHour` depending on the user clicks a day button or an hour button, respectively.
   *
   * If a day button is clicked these are the object properties:
   * - `btn` [HTMLButtonElement]
   * - `container` [HTMLDivElement]
   * - `date` [Date]
   * - `next_month` [boolean]
   * - `picker` [HTMLDivElement]
   * - `prev_month` [boolean]
   * - `text` [string]
	 *
	 * @param {MouseEvent} e
   *
   * @see selectDay
   * @see selectHour
	 */
	onSelectDayOrHour( e ) {
		const o = {};
    const t = e.target;

		o.text = t.textContent;

		const if_hour = ( o.text.indexOf(':') != -1 ) ? true : false;

		// if( mode == 'start' ) {
			o.date = this.start_date;
      o.container = this.start_container;
      o.btn = ( !if_hour ) ? this.start_date_btn : this.start_time_btn;
			o.picker = this.start_picker_div;
		// } else {
		// 	o.date = end_date;
		// 	o.div_close = end_picker_div; // => picker
		// 	o.interval_div = el_end; // => container
		// 	o.btn = ( !if_hour ) ? end_date_btn : end_time_btn;
		// }
    //
		// if( if_hour ) {
		// 	let arr = o.text.split(':');
		// 	o.hour = arr[0];
		// 	o.minute = arr[1]
		// } else {
			o.prev_month = t.classList.contains('prev-month');
			o.next_month = t.classList.contains('next-month');
		// }

		const substr = ( t.classList.contains( 'day' ) )? 'Day' : 'Hour';
		const method = 'select' + substr;
		this[ method ]( o );
	},

  /**
   * @memberof module:js/datepickermixin.exports.DatePickerMixin
   *
   * @desc
	 * Seleziona il giorno scelto dall'utente
	 *
	 * @param {object} obj Oggetto contenente tutte le informazioni contestuali calcolate dal metodo chiamante {@link DatePicker#onSelectDayOrHour}
   *
	 * @see DatePicker#printDateAndTime
	 * @see DatePicker#closeDateOrHourTable
	 */
	selectDay( o ) {
    // Updates this.start_date or this.end_date after user selection
		if( o.prev_month ) {
			o.date.setFullYear( this.prev_month.getFullYear(), this.prev_month.getMonth(), o.text );
		} else if( o.next_month ) {
			o.date.setFullYear( this.next_month.getFullYear(), this.next_month.getMonth(), o.text );
		} else {
			o.date.setFullYear( this.current_month.getFullYear(), this.current_month.getMonth(), o.text );
		}

		// // Ricava le rispettive date senza differenze di orario
		// let _start_date = new Date( start_date.getFullYear(), start_date.getMonth(), start_date.getDate() );
		// let _end_date = new Date( end_date.getFullYear(), end_date.getMonth(), end_date.getDate() );
		// let _curr_date = new Date( obj.date.getFullYear(), obj.date.getMonth(), obj.date.getDate() );
		// let _min_date = new Date( min_date.getFullYear(), min_date.getMonth(), min_date.getDate() );
		// let _max_date = new Date( max_date.getFullYear(), max_date.getMonth(), max_date.getDate() );
    //
		// this.checkDateTimeContraints( obj, _start_date, _end_date, _curr_date, _min_date, _max_date );

		// Updates day classes after user selection
		let coll = document.querySelectorAll( 'td.selectable' );

		for( let n = coll.length, i = 0; i < n; i++ ) {
			let param, class_name = '';
			if( coll[ i ].classList.contains( 'prev-month' ) ) {
				param = this.prev_month;
				class_name += 'prev-month ';
			}
			else if( coll[ i ].classList.contains( 'next-month' ) ) {
				param = this.next_month;
				class_name += 'next-month ';
			}
			else {
				param = this.current_month;
			}
			class_name += this.getDayClassName( coll[ i ].textContent, param );
			coll[ i ].className = class_name;
		}

		// Stampa nella pagina
		this.printDateAndTime( o.container, o.date );

		// Chiude il pannello attivo e toglie il focus dal pulsante corrispondente
		this.closeDateOrHourTable( o.btn, o.picker, 500 );
	},

  /**
	 * Chiude l'elemento contenente la tabella con le date o gli orari di inizio o fine intervallo
	 * La chiusura può essere temporizzata
	 *
	 * @param {HTMLDivElement} btn Il pulsante che ha aperto la tabella con le date o gli orari
	 * @param {HTMLDivElement} picker Il pannello corrente che contiene la tabella con le date o gli orari
	 * @param {int} [msec:0] Il numero di millisecondi dopo il quale l'elemento deve essere chiuso
	 * @see DatePicker#selectDay
	 * @see DatePicker#selectHour
	 */
	closeDateOrHourTable( btn, picker, ms = 0 ) {
		setTimeout( () => {
			picker.style.display = 'none';
			btn.classList.remove( 'active' );
			document.body.removeEventListener( this.click, picker.ifOutside );
		}, ms );
	}
}
