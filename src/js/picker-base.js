/**
 * @module js/picker-base
 * @author Marcello Surdi
 *
 * @desc
 * This module contains the PickerBase class that serves as a base for all classes.
 *
 * @todo Provide a year/month picker
 * @todo Provide support for disabling arbitrary days and hours between `first_date` and `last_date`
 * @todo Provide support for swiping months
 */

// IE11 backcompatibility notes
// Polyfill for Element.prototype.matches
 if( !Element.prototype.matches ) {
   Element.prototype.matches =
   Element.prototype.matchesSelector ||
   Element.prototype.mozMatchesSelector ||
   Element.prototype.msMatchesSelector ||
   Element.prototype.oMatchesSelector ||
   Element.prototype.webkitMatchesSelector
 }
// The following code will be transpiled with WebPack/Babel for IE11 backcompatibility.
// If you want to use destructuring assignment too, you also need to install @babel/polyfill, but
// the file size will increase consequently.





/**
 * @namespace PickerBaseNS
 * @memberof module:js/picker-base
 */

/**
 * @typedef {object} UserSelection
 * @memberof module:js/picker-base.PickerBaseNS
 *
 * @property {HTMLButtonElement} btn The active button
 * @property {HTMLDivElement} container Start or end top level container depending on which button was clicked
 * @property {Date} date Start date or end date
 * @property {HTMLDivElement} picker Picker to be closed after updating
 * @property {string} text The day number or the hour/minute pair (HH:mm) inside the `td` element
 * @property {boolean} [next_month] Denotes if it's a next month day (for days selection only)
 * @property {boolean} [prev_month] Denotes if it's a previous month day (for days selection only)
 * @property {string} [hour] 2-digit hour (for hour/minute selection only)
 * @property {string} [minute] 2-digit minute (for hour/minute selection only)
 */





/**
 * @class
 *
 * @classdesc
 * It's the base class for Date*Picker classes. Objects of this class
 * are **never** created, subclasses inherit from it.
 *
 * @property {object} i18n Strings for translation
 * @property {HTMLDivElement} start_container Top level `div` container for start date/time buttons
 * @property {HTMLButtonElement} start_date_btn `button.date.start` inside `start_container`
 * @property {HTMLButtonElement} start_time_btn `button.time.start` inside `start_container`
 * @property {HTMLDivElement} start_picker `div.picker` inside `start_container`. It contains the calendar or the timetable
 * @property {HTMLDivElement} end_container Top level `div` container for end date/time buttons (end_* properties are present **only** if there's a range)
 * @property {HTMLButtonElement} end_date_btn `button.date.end` inside `end_container`
 * @property {HTMLButtonElement} end_time_btn `button.time.end` inside `end_container`
 * @property {HTMLDivElement} end_picker `div.picker` inside `end_container`. It contains the calendar or the timetable
 * @property {Date} first_date First selectable date
 * @property {Date} start_date Start selected date
 * @property {Date} end_date End selected date
 * @property {Date} last_date Last selectable date
 * @property {Date} current_month Date object with current year/month relative to the picker just opened (*_month values are updated **each time** a picker is opened)
 * @property {Date} prev_month Date object with previous year/month relative to the picker just opened
 * @property {Date} next_month Date object with next year/month relative to the picker just opened
 * @property {string} date_output The date format returned to the value attribute of `input.date_output` (accepted values are short_ISO, full_ISO and timestamp)
 * @property {number} min_range The minimum range in milliseconds that must elapse between `start_date` and `end_date`
 * @property {number} round_to Minutes are rounded to the `round_to` value (if any) and his multiples
 */
export function PickerBase() {
  this.i18n = {
    'jan':'Jan',
    'feb':'Feb',
    'mar':'Mar',
    'apr':'Apr',
    'may':'May',
    'jun':'Jun',
    'jul':'Jul',
    'aug':'Aug',
    'sep':'Sep',
    'oct':'Oct',
    'nov':'Nov',
    'dec':'Dec',
    'jan_':'January',
    'feb_':'February',
    'mar_':'March',
    'apr_':'April',
    'may_':'May',
    'jun_':'June',
    'jul_':'July',
    'aug_':'August',
    'sep_':'September',
    'oct_':'October',
    'nov_':'November',
    'dec_':'December',
    'mon':'Mon',
    'tue':'Tue',
    'wed':'Wed',
    'thu':'Thu',
    'fri':'Fri',
    'sat':'Sat',
    'sun':'Sun',
    'mon_':'Monday',
    'tue_':'Tuesday',
    'wed_':'Wednesday',
    'thu_':'Thursday',
    'fri_':'Friday',
    'sat_':'Saturday',
    'sun_':'Sunday',
    'done':'Done',
  };

  const ms_per_day = 24 * 60 * 60 * 1000;
  const default_days_order = [ 'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat' ];
  const months_order = [ 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec' ];
  // Click events don't always work like expected on iOS, we can use touchstart instead
  const click = ( navigator.userAgent.match( /(iPad|iPhone|iPod)/g ) ) ? 'touchstart' : 'click';
  let user_days_order, days_order;
  let mode = 'start';





  /**
   * Adds an event handler to `td.selectable` elements.
   * It's used by both {@link module:js/picker-base.PickerBase#showDatePicker|showDatePicker}
   * and {@link module:js/picker-base.PickerBase#showTimePicker|showTimePicker} methods.
   *
   * @param {HTMLDivElement} picker The picker currently open
   */
  this.addOnSelectEvent = function( picker ) {
    let coll = picker.querySelectorAll( 'td.selectable' );

    for( let i = 0, n = coll.length; i < n; i++ ) {
      coll[ i ].addEventListener( 'click', this.onSelectDayOrHour );
    }
  }




  /**
   * Checks if dates are still consistent after user selection and fixes any inconsistencies:
   * - `start_date` must always be greater than `first_date`;
   * - `end_date` must always be less than `last_date`.
   * - `start_date` plus `min_range` must always be less or equal than `end_date`;
   * - `end_date` minus `min_range` must always be greater or equal than `start_date`;
   *
   * It's used by both {@link module:js/picker-base.PickerBase#selectDay|selectDay}
   * and {@link module:js/picker-base.PickerBase#selectHour|selectHour} methods.
  */
  this.checkDateTimeConsistency = function() {
    const first_date_ms = this.first_date.getTime();
    const start_date_ms = this.start_date.getTime();
    const last_date_ms = this.last_date.getTime();

    // Always checks these conditions
    if( start_date_ms <= first_date_ms ) {
      this.start_date.setHours( this.first_date.getHours(), this.first_date.getMinutes(), 0, 0 );
    }

    if( start_date_ms >= last_date_ms ) {
      this.start_date.setHours( this.last_date.getHours(), this.last_date.getMinutes(), 0, 0 );
    }

    // Only checks if there's a range
    if( this.end_date ) {
      const end_date_ms = this.end_date.getTime();

      // start mode
      if( mode == 'start' ) {
        if( ( start_date_ms + this.min_range ) >= end_date_ms ) {
          if( ( start_date_ms + this.min_range ) >= last_date_ms ) {
            this.start_date.setTime( last_date_ms - this.min_range );
          }

          this.end_date.setTime( this.start_date.getTime() + this.min_range );
          this.printDateAndTime( this.end_container, this.end_date );
        }
      }

      // end mode
      else {
        if( ( end_date_ms - this.min_range ) <= start_date_ms ) {
          if( ( end_date_ms - this.min_range ) <= first_date_ms ) {
            this.end_date.setTime( first_date_ms + this.min_range );
          }

          this.start_date.setTime( this.end_date.getTime() - this.min_range );
          this.printDateAndTime( this.start_container, this.start_date );
        }

        if( end_date_ms >= last_date_ms ) {
          this.end_date.setHours( this.last_date.getHours(), this.last_date.getMinutes(), 0, 0 );
        }
      }
    }
  }





  /**
   * Closes the open picker and removes the active state from the the corresponding button.
   *
   * @param {HTMLDivElement} picker The picker currently open
   * @param {HTMLDivElement} btn The active button
   * @param {int} [msec=0] Number of milliseconds after which the picker is closed
  */
  this.closePicker = function( picker, btn, ms = 0 ) {
    setTimeout( () => {
      btn.classList.remove( 'active' );
      picker.style.display = 'none';
      document.removeEventListener( click, this.onClickOutside );
    }, ms );
  }





  /**
   * @desc
   * Returns dates converted in milliseconds with hours and minutes set to 0.
   *
   * @return {object} The object containing `_dates`
   */
  this.get_Dates = function() {
    const _today = new Date().setHours( 0, 0, 0, 0 );
    const _start_date = new Date( this.start_date ).setHours( 0, 0, 0, 0 );
    const _first_date = new Date( this.first_date ).setHours( 0, 0, 0, 0 );
    const _last_date = new Date( this.last_date ).setHours( 0, 0, 0, 0 );

    let _end_date = null;
    if( this.end_date ) {
      _end_date = new Date( this.end_date ).setHours( 0, 0, 0, 0 );
    }

    return {
      _today: _today,
      _start_date: _start_date,
      _first_date: _first_date,
      _last_date: _last_date,
      _end_date: _end_date
    };
  }





  /**
   * @desc
   * Returns classes for `td` elements that contain the days of calendar.
   * It's used inside a loop both when building table ({@link module:js/picker-base.PickerBase#showDatePicker|showDatePicker})
   * and when updating it ({@link module:js/picker-base.PickerBase#selectDay|selectDay}).
   *
   * @param {string} day The current day inside a loop iteration
   * @param {Date} date Date object with current year/month
   * @param {object} _dates Dates converted in milliseconds with hours and minutes set to 0
   * @return {string} Classes to be assigned to the `td` element
   */
  this.getDayClassName = function( day, date, _dates ) {
    const _curr_day = new Date( date.getFullYear(), date.getMonth(), day ).getTime();

    let class_name = 'day ';
    if( _curr_day < _dates._first_date || _curr_day > _dates._last_date ) {
      class_name += 'disabled ';
    } else {
      class_name += 'selectable ';
    }

    if( _curr_day == _dates._today ) {
      class_name += 'today ';
    }

    if( _curr_day == _dates._start_date ) {
      class_name += 'start-day ';
      class_name += ( mode == 'start' ) ? 'active ' : 'inactive ';
    }

    if( this.end_date ) {
    	if( _curr_day > _dates._start_date && _curr_day < _dates._end_date ) {
    		class_name += ' range';
    	}

    	if( _curr_day == _dates._end_date ) {
    		class_name += ' end-day ';
        class_name += ( mode == 'end' ) ? 'active ' : 'inactive ';
    	}
    }

    return class_name;
  }





  /**
   * Returns classes for `td` elements that contain the hour/minute pairs (HH:mm).
   * It's used inside a loop both when building table ({@link module:js/picker-base.PickerBase#showTimePicker|showTimePicker})
   * and when updating it ({@link module:js/picker-base.PickerBase#selectHour|selectHour}).
   *
   * @param {string} hour An hour/minute pair (HH:mm) inside a loop iteration
   * @param {Date} date Date object with current hour/minutes
   * @return {string} Classes to be assigned to the `td` element
   */
  this.getHourClassName = function( hour, date ) {
    const selected_hour = ( '0' + date.getHours() ).slice( -2 ) + ':' + ( '0' + date.getMinutes() ).slice( -2 );

    const arr = hour.split( ':' );
    const h = arr[ 0 ];
    const m = arr[ 1 ];
    // const [ h, m ] = hour.split( ':' );

    const _curr_day = new Date( date );
    _curr_day.setHours( h, m, 0, 0 );

    let class_name = 'hour ';
    if( _curr_day < this.first_date || _curr_day > this.last_date ) {
      class_name += 'disabled';
    } else {
      class_name += 'selectable';
      class_name += ( selected_hour == hour ) ? ' time-selected ' + mode : '';
    }

    return class_name;
  }





  /**
   * @desc
   * Returns HTML for buttons. It's used to populate `start_container` and `end_container`.
   *
   * @param {string} mode 'start' or 'end'
   * @param {string} type 'date' or 'datetime'
   * @param {object|null} styles User defined styles object
   * @return {string} HTML for requested button
   */
  this.getHTML = function( mode, type, styles ) {
    let html, css = '';
    const id = this[ mode + '_container' ].id;

    if( styles ) {
      let selector1 = `div#${ id } button.active, div#${ id } table td.active, div#${ id } table td.time-selected`;
      let selector2 = `div#${ id } table td.inactive`;
      if( this.end_container ) {
        const id2 = this.end_container.id;
        selector1 += `, div#${ id2 } button.active, div#${ id2 } table td.active, div#${ id2 } table td.time-selected`;
        selector2 += `, div#${ id2 } table td.inactive`;
      }

      if( styles.active_background && styles.active_color ) {
        css +=
        `${ selector1 } {
          background-color: ${ styles.active_background }; color: ${ styles.active_color };
        }`;
      }

      if( styles.inactive_background && styles.inactive_color ) {
        css +=
        `${ selector2 } {
          background-color: ${ styles.inactive_background }; color: ${ styles.inactive_color };
        }`;
      }

      if( css ) { css = `<style>${ css }</style>`; }
    }

    const input = ( !this[ mode + '_container' ].querySelector( 'input.date_output' ) )
      ? `<input type="hidden" name="${ id }_value" class="date_output" value="">`
      : '';

    switch( type ) {
      case 'datetime':
        html =
        `<div class="buttons-container fix-float">
          <button type="button" class="date ${ mode } w-50">
            <span class="week-day">mon</span>
            <span class="month-day">00</span>
            <span class="month-year"><span>jan</span><br>2000</span>
          </button>
          <button type="button" class="time ${ mode } w-50">
            <span class="hours">00</span>
            <span class="minutes">:00</span>
          </button>
        </div>
        <div class="picker"></div>
        ${ input }`;
      break;
      case 'date':
      default:
        html =
        `<div class="buttons-container">
          <button type="button" class="date ${ mode }">
            <span class="week-day">mon</span>
            <span class="month-day">00</span>
            <span class="month-year"><span>jan</span><br>2000</span>
          </button>
        </div>
        <div class="picker"></div>
        ${ input }`;
    }

    return css + html;
  }





  /**
   * This is a click handler that closes the picker if the user clicks outside of it.
   *
   * @param {Event} e
   *
   * @see {@link module:js/picker-base.PickerBase#closePicker|closePicker}
   *
   * @todo a.prev-month and a.next-month must be outside the table.date element
  */
  this.onClickOutside = ( e ) => {
    let div = ( mode == 'start' ) ? this.start_picker : this.end_picker;

    let el = e.target;
    let inside = false;

    do {
      if(
        el.matches( `#${ div.parentElement.id }.datetime-container` ) ||
        el.classList.contains( 'prev-month' ) ||
        el.classList.contains( 'next-month' )
      ) {
        inside = true;
        break;
      }
      el = el.parentElement;
    } while( el !== null && el.nodeType === 1 );

    if( !inside )  {
      this.closePicker( div, div.previousElementSibling.querySelector( '.active' ) );
    }
  }





  /**
   * This is a click handler triggered when the user opens the picker by clicking either a
   * date or a time button. This method sets the value of the mode variable.
   *
   * @param {Event} e
   *
   * @see {@link module:js/picker-base.PickerBase#showDatePicker|showDatePicker}
   * @see {@link module:js/picker-base.PickerBase#showTimePicker|showTimePicker}
   * @see {@link module:js/picker-base.PickerBase~scrollPage|scrollPage}
  */
  this.onOpenPicker = ( e ) => {
    const btn = e.currentTarget;
    let picker, close, date;

    // Adds or removes the active state from current button when it's clicked
    btn.classList.toggle( 'active' );

    // Removes the active state from the other buttons except the current one
    let css_selector = `div#${ this.start_container.id } button`;
    css_selector += ( this.end_container?.id ) ? `, div#${ this.end_container.id } button` : '';
    [].slice.call( document.querySelectorAll( css_selector ) ).forEach( ( item ) => {
      if( item != btn ) {
        item.classList.remove( 'active' )
      }
    } );

    // If there is not a range, only the start date exists
    if( btn.classList.contains( 'start' ) ) {
      picker = this.start_picker;
      close = this.end_picker;
      date = this.start_date;
      mode = 'start';
    } else {
      picker = this.end_picker;
      close = this.start_picker;
      date = this.end_date;
      mode = 'end';
    }

    // If the button has the active state...
    if( btn.classList.contains( 'active' ) ) {
      picker.style.display = 'block';
      // Closes the picker previously opened (if any)
      if( close ) {
        close.style.display = 'none';
      }

      document.addEventListener( click, this.onClickOutside );

      let prefix = ( btn.classList.contains( 'date' ) ) ? 'Date' : 'Time';
      if( prefix == 'Time' && this.round_to ) {
        prefix = 'Alternative' + prefix;
      }
      let method = 'show' + prefix + 'Picker';
      this[ method ]( picker, date );

      scrollPage( picker );
    }

    // ...otherwise
    else {
      // The picker was already open, so we close it
      picker.style.display = 'none';
      document.removeEventListener( click, this.onClickOutside );
    }
  }





  /**
  * @desc
  * This is a click handler triggered when the user clicks to select either a day or an hour.
  * It passes an {@link module:js/picker-base.PickerBaseNS.UserSelection|UserSelection} object as
  * parameter to {@link module:js/picker-base.PickerBase#selectDay|selectDay} or to
  * {@link module:js/picker-base.PickerBase#selectHour|selectHour} methods, depending on the user
  * clicks on a day button or on an hour button respectively.
  *
  * @param {Event} e
  *
  * @see {@link module:js/picker-base.PickerBase#selectDay|selectDay}
  * @see {@link module:js/picker-base.PickerBase#selectHour|selectHour}
  */
  this.onSelectDayOrHour = ( e ) => {
    const o = {};
    const t = e.target;

    o.text = t.textContent;

    const if_hour = ( o.text.indexOf(':') != -1 ) ? true : false;

    if( mode == 'start' ) {
      o.date = this.start_date;
      o.container = this.start_container;
      o.btn = ( !if_hour ) ? this.start_date_btn : this.start_time_btn;
      o.picker = this.start_picker;
    } else {
      o.date = this.end_date;
      o.container = this.end_container;
      o.btn = ( !if_hour ) ? this.end_date_btn : this.end_time_btn;
      o.picker = this.end_picker;
    }

    if( if_hour ) {
      let arr = o.text.split(':');
      o.hour = arr[0];
      o.minute = arr[1];
      // [ o.hour, o.minute ] = o.text.split(':');
    } else {
      o.prev_month = t.classList.contains('prev-month');
      o.next_month = t.classList.contains('next-month');
    }

    const substr = ( t.classList.contains( 'day' ) )? 'Day' : 'Hour';
    const method = 'select' + substr;
    this[ method ]( o );
  }





  /**
   * @desc
   * Displays date and/or time in their own buttons. According to `settings.date_output` property,
   * it outputs the date in local time to the value attribute of `input.date_output`.
   *
   * @param {HTMLDivElement} div `div` element where to display the date/time
   * @param {Date} date Date to be displayed
   *
   * @see {@link module:js/picker-base.PickerBase~getWeekDayNo|getWeekDayNo}
   * @see {@link module:js/picker-base.PickerBase~date2ISOString|date2ISOString}
   */
  this.printDateAndTime = function( div, date ) {
    // Displays date
    const date_coll = div.querySelectorAll( 'button.date > *' );
    const week_day_span = date_coll[ 0 ];
    const month_day = date_coll[ 1 ];
    const month_year_span = date_coll[ 2 ];
    // const [ week_day_span, month_day, month_year_span ] = div.querySelectorAll( 'button.date > *' );

    const week_day_number = getWeekDayNo( date );

    week_day_span.textContent = this.i18n[ days_order[ week_day_number ] ];
    month_day.textContent = ( '0' + date.getDate() ).slice( -2 );
    month_year_span.innerHTML =
      `<span data-i18n="${ months_order[ date.getMonth() ] }">${ this.i18n[ months_order[ date.getMonth() ] ] }</span><br>${ date.getFullYear() }`;


    // Displays time
    const button_time = div.querySelector( 'button.time' );
    if( button_time ) {
      const time_coll = button_time.querySelectorAll( 'span' );
      const hours = time_coll[ 0 ];
      const minutes = time_coll[ 1 ];
      // const [ hours, minutes ] = button_time.querySelectorAll( 'span' );

      hours.textContent = ( '0' + date.getHours() ).slice( -2 );
      minutes.textContent = `:${ ( '0' + date.getMinutes() ).slice( -2 ) }`;
    }


    // Outputs date and time according to this.date_output
    let output_date;
    const full_iso = date2ISOString( date );
    switch( this.date_output ) {
      // YYYY-MM-DDTHH:mm:ss
      case 'full_ISO':
        output_date = full_iso;
      break;
      // YYYY-MM-DD
      case 'short_ISO':
        let arr = full_iso.split( 'T' );
        output_date = arr[ 0 ];
        // [ output_date, ] = full_iso.split( 'T' );
      break;
      // Timestamp value without milliseconds
      case 'timestamp':
      default:
        output_date = date2UTCTimestamp( date );
    }

    div.querySelector( 'input.date_output' ).value = output_date;
  }





  /**
   * @desc
   * Rounds minutes to the next `round_to` value.
   *
   * @param {array} dates An array containing an arbitrary number of dates to be rounded
   */
  this.roundMinutes = function( dates ) {
    dates.forEach( ( date ) => {
      date.setSeconds( 0, 0 );

      let sum_one_hour = false;
      let m = date.getMinutes();
      let h = date.getHours();

      // Rounds m to the next round value
      const round = ( this.round_to ) ? this.round_to : 30;
      if( m % round != 0 ) {
        for( let i = m; i <= ( m + round ); i++ ) {
          if( i % round == 0 ) {
            m = i;
            break;
          }
        }
      }

      if( m == 60 ) {
        m = 0;
        // If we round minutes to 0 we have to sum +1 hour
        h = h + 1;
        // If, after rounding, the midnight is reached, we have to sum +1 day
        if( h == 24 ) {
          h = 0;
          date.setDate( date.getDate() + 1 );
        }
      }

      date.setHours( h, m );
    } );
  }





  /**
   * @desc
   * Selects the day clicked by the user and then closes the picker. It's used by
   * {@link module:js/picker-base.PickerBase#onSelectDayOrHour|onSelectDayOrHour} method.
   *
   * @param {module:js/picker-base.PickerBaseNS.UserSelection} o Object with contextual info
   *
   * @see {@link module:js/picker-base.PickerBase#printDateAndTime|printDateAndTime}
   * @see {@link module:js/picker-base.PickerBase#closePicker|closePicker}
   */
  this.selectDay = function( o ) {
    // Updates this.start_date or this.end_date after user selection
    if( o.prev_month ) {
      o.date.setFullYear( this.prev_month.getFullYear(), this.prev_month.getMonth(), o.text );
    } else if( o.next_month ) {
      o.date.setFullYear( this.next_month.getFullYear(), this.next_month.getMonth(), o.text );
    } else {
      o.date.setFullYear( this.current_month.getFullYear(), this.current_month.getMonth(), o.text );
    }

    this.checkDateTimeConsistency();

    const _dates = this.get_Dates();

    // Updates day classes after user selection
    const coll = document.querySelectorAll( 'td.selectable' );

    for( let i = 0, n = coll.length; i < n; i++ ) {
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

      class_name += this.getDayClassName( coll[ i ].textContent, param, _dates );
      coll[ i ].className = class_name;
    }

    this.printDateAndTime( o.container, o.date );

    this.closePicker( o.picker, o.btn, 500 );
  }





  /**
   * Selects the hour/minute pair clicked by the user and then closes the picker.
   *
   * @param {module:js/picker-base.PickerBaseNS.UserSelection} o Object with contextual info
   *
   * @see {@link module:js/picker-base.PickerBase#printDateAndTime|printDateAndTime}
   * @see {@link module:js/picker-base.PickerBase#closePicker|closePicker}
   */
  this.selectHour = function( o ) {
    // Updates hour and minute with those selected by the user
    o.date.setHours( o.hour, o.minute, 0, 0 );

    this.checkDateTimeConsistency();

    // Updates the table after user selection
    let coll = document.querySelectorAll( 'td.selectable' );

    for( let i = 0, n = coll.length; i < n; i++ ) {
      coll[ i ].className = this.getHourClassName( coll[ i ].textContent, o.date );
    }

    this.printDateAndTime( o.container, o.date );

    this.closePicker( o.picker, o.btn, 500 );
  }





  /**
   * @desc
   * Initializes the end date picker properties.
   *
   * @param {string} id id of the `div` element that will contain the button(s)
   * @param {Date|string|null} end_date_setting End selected date from settings
   *
   * @see {@link module:js/picker-base.PickerBase~getDateBetween|getDateBetween}
   * @see {@link module:js/picker-base.PickerBase~roundMinutes|roundMinutes}
   */
  this.setEndPickerProps = function( id, end_date_setting ) {
    const el = document.getElementById( id );
    if( el == null || el.nodeName != 'DIV' ) {
      throw new Error( `Does div#${ id } exist? Please, check your HTML code` );
    }

    // Default end selected date is one day more than start selected date
    const end_date_default = new Date( this.start_date.getTime() + this.min_range );
    let end_date = getDateBetween( end_date_default, end_date_setting, el.querySelector( 'input.date_output' ) );
    // End selected date must be greater than start selected date
    if( end_date < this.start_date) {
      end_date = end_date_default;
    }

    this.roundMinutes( [ end_date ] );

    // End selected date can't be greater than last selectable date
    if( end_date > this.last_date ) {
      this.last_date = end_date;
    }

    this.end_container = el;
    this.end_date = end_date;
  }





  /**
   * @desc
   * Initializes the start date picker properties.
   *
   * @param {string} id id of the `div` element that will contain the button(s)
   * @param {Date|string|null} start_date_setting Start selected date from settings
   * @param {Date|string|null} first_date_setting First selectable date from settings
   * @param {Date|string|null} last_date_setting Last selectable date from settings
   * @param {number} first_day_no Day the week must start with. Similarly to the returned values of `Date.getDate` method, accepted range values are 0-6 where 0 means Sunday, 1 means Monday and so on
   *
   * @see {@link module:js/picker-base.PickerBase~getDateBetween|getDateBetween}
   * @see {@link module:js/picker-base.PickerBase~roundMinutes|roundMinutes}
   * @see {@link module:js/picker-base.PickerBase~setDaysOrder|setDaysOrder}
   */
  this.setStartPickerProps = function( id, start_date_setting, first_date_setting, last_date_setting, first_day_no ) {
    const el = document.getElementById( id );
    if( el == null || el.nodeName != 'DIV' ) {
      throw new Error( `Does div#${ id } exist? Please, check your HTML code` );
    }

    // Default start selected date is one day more than current date
    const start_date_default = new Date( Date.now() + ms_per_day );
    let start_date = getDateBetween( start_date_default, start_date_setting, el.querySelector( 'input.date_output' ) );

    // Default first selectable date is the current date
    const first_date_default = new Date;
    let first_date = getDateBetween( first_date_default, first_date_setting );
    // Start selected date must be greater than first selectable date
    if( start_date < first_date ) {
      first_date = start_date;
    }

    // Default last selectable date is one year more than start selected date
    const last_date_default = new Date( start_date.getTime() + ( ms_per_day * 365 ) );
    let last_date = getDateBetween( last_date_default, last_date_setting );
    // Last selectable date must be greater than start selected date
    if( last_date < start_date ) {
      last_date = last_date_default;
    }

    if( this.round_to ) {
      if( [ 1, 5, 10, 15, 20, 30 ].indexOf( this.round_to ) < 0 ) {
        this.round_to = 1;
      }
    }
    this.roundMinutes( [ start_date, first_date, last_date ] );

    setDaysOrder( first_day_no );

    this.start_container = el;
    this.start_date = start_date;
    this.first_date = first_date;
    this.last_date = last_date;
  }





  /**
   * @desc
   * Creates select elements for hours and minutes inside the picker
   *
   * @param {HTMLDivElement} picker The picker that contains the table
   * @param {Date} day Current day
   *
   * @see {@link module:js/picker-base.PickerBase~getWeekDayNo|getWeekDayNo}
   *
   * @since 1.1.0
   */
  this.showAlternativeTimePicker = function( picker, day ) {
    let _curr_day = new Date( day );
    let selected_hour;

    let getSelectMinutesOptions = () => {
      let select_content = '';
      for( let m = 0; m <= 59; m++ ) {
        if( m % this.round_to == 0 ) {
          _curr_day.setHours( selected_hour, m );
          if( _curr_day < this.first_date || _curr_day > this.last_date ) {
            continue;
          }

          let current_minute = ( '0' + m ).slice( -2 );
          let selected = ( m == day.getMinutes() ) ? 'selected' : '';
          select_content +=   `<option value="${ current_minute }" ${ selected }>${ current_minute }</option>`;
        }
      }

      return select_content;
    }

    let select_hours = '<select class="select-hours">';
    for( let h = 0; h <= 23; h++ ) {

       _curr_day.setHours( h );
      if( _curr_day < this.first_date || _curr_day > this.last_date ) {
        continue;
      }

      let current_hour = ( '0' + h ).slice( -2 );
      let selected = ( h == day.getHours() ) ? 'selected' : '';
      if( selected ) {
        selected_hour = h;
      }
      select_hours +=      `<option value="${ current_hour }" ${ selected }>${ current_hour }</option>`;
    }
    select_hours +=     '</select>';

    let select_minutes = '<select class="select-minutes">';
    select_minutes +=       getSelectMinutesOptions();
    select_minutes +=    '</select>';

    picker.innerHTML =
    `<table class="time">
      <tr>
        <th>
          ${ this.i18n[ days_order[ getWeekDayNo( day ) ] + '_' ] }
          ${ day.getDate() }
          <span class="month" data-i18n="${ months_order[ day.getMonth() ] + '_' }">${ this.i18n[ months_order[ day.getMonth() ] + '_' ] }</span>
        </th>
      </tr>
      <tr>
        <td>
          ${ select_hours }
          ${ select_minutes }
          <button type="button" class="confirm">${ this.i18n['done'] }</button>
        </td>
      </tr>
    </table>`;

    let container, btn;
    if( mode == 'start' ) {
      container = this.start_container;
      btn = this.start_time_btn;
    } else {
      container = this.end_container;
      btn = this.end_time_btn;
    }
    const select_hours_el = container.querySelector( 'select.select-hours' );
    const select_minutes_el = container.querySelector( 'select.select-minutes' );
    const button_confirm = container.querySelector( 'button.confirm' );

    let onChangeHour = ( e ) => {
      selected_hour = select_hours_el.options[ select_hours_el.selectedIndex ].value;
      let select_content = getSelectMinutesOptions();
      select_minutes_el.innerHTML = select_content;
    }

    let onSetTime = ( e ) => {
      e.preventDefault();

      const current_hour = select_hours_el.options[ select_hours_el.selectedIndex ].value;
      const current_minute = select_minutes_el.options[ select_minutes_el.selectedIndex ].value;

      day.setHours( current_hour, current_minute, 0, 0 );

      this.checkDateTimeConsistency();

      this.printDateAndTime( container, day );
      this.closePicker( picker, btn, 500 );

      button_confirm.disabled = true;
    }

    select_hours_el.onchange = onChangeHour;
    button_confirm.onclick = onSetTime;
  }





  /**
   * @desc
   * Creates the calendar of the current month inside the picker.
   *
   * @param {HTMLDivElement} picker The picker that contains the calendar
   * @param {Date} date Current date
   *
   * @see {@link module:js/picker-base.PickerBase~getWeekDayNo|getWeekDayNo}
   * @see {@link module:js/picker-base.PickerBase#getDayClassName|getDayClassName}
   * @see {@link module:js/picker-base.PickerBase#addOnSelectEvent|addOnSelectEvent}
   */
  this.showDatePicker = function( picker, date ) {
    let class_name, html = '';

    const month = date.getMonth();
    const year = date.getFullYear();

    // February length
    const feb = ( ( year % 100 != 0 ) && ( year % 4 == 0 ) || ( year % 400 == 0 ) ) ? 29 : 28;
    const total_days = [ '31', feb, '31', '30', '31', '30', '31', '31', '30', '31', '30', '31' ];

    const current_month = new Date( year, month, 1 );
    // First day of current month as number
    let week_day = getWeekDayNo( current_month );
    const prev_month = new Date( year, ( month - 1 ), 1 );
    const next_month = new Date( year, ( month + 1 ), 1 );

    const _dates = this.get_Dates();

    // Displays the last days of the previous month
    let i = 0
    let j = week_day;
    const prev_month_total_days = total_days[ prev_month.getMonth() ];
    while( j > 0 ) {
      i = ( prev_month_total_days - ( j - 1 ) );
      class_name = this.getDayClassName( i, prev_month, _dates );
      html += `<td class="prev-month ${ class_name }">${ i }</td>`;
      j--;
    }

    // Displays the days of the current month
    i = 1;
    while ( i <= total_days[ month ] ) {
      // Starts a new row
      if( week_day > 6 ) {
        week_day = 0;
        html += "</tr><tr>";
      }

      class_name = this.getDayClassName( i, current_month, _dates );
      html += `<td class="${ class_name }">${ i }</td>`;

      week_day++;
      i++;
    }

    // Displays the first days of the next month
    for( i = 1; week_day <= 6; week_day++, i++ ) {
      class_name = this.getDayClassName( i, next_month, _dates );
      html += `<td class="next-month ${ class_name }">${ i }</td>`;
    }

    picker.innerHTML =
    `<table class="date">
      <tr>
        <th><a href="javascript:void(0);" class="prev-month">&laquo;</a></th>
        <th colspan="5">
          <span class="month" data-i18n="${ months_order[ month ] + '_' }">${ this.i18n[ months_order[ month ] + '_' ] }</span>
          ${ year }
        </th>
        <th><a href="javascript:void(0);" class="next-month">&raquo;</a></th>
      </tr>
      <tr>
        <td class="day-label" data-i18n="${ days_order[0] }">${ this.i18n[ days_order[0] ] }</td>
        <td class="day-label" data-i18n="${ days_order[1] }">${ this.i18n[ days_order[1] ] }</td>
        <td class="day-label" data-i18n="${ days_order[2] }">${ this.i18n[ days_order[2] ] }</td>
        <td class="day-label" data-i18n="${ days_order[3] }">${ this.i18n[ days_order[3] ] }</td>
        <td class="day-label" data-i18n="${ days_order[4] }">${ this.i18n[ days_order[4] ] }</td>
        <td class="day-label" data-i18n="${ days_order[5] }">${ this.i18n[ days_order[5] ] }</td>
        <td class="day-label" data-i18n="${ days_order[6] }">${ this.i18n[ days_order[6] ] }</td>
      </tr>
      <tr>
        ${ html }
      </tr>
    </table>`;

    // Previous month button
    prev_month.setDate( prev_month_total_days );
    const prev_month_btn = picker.querySelector( '.prev-month' );
    if( prev_month > this.first_date ) {
      prev_month_btn.addEventListener( 'click', () => this.showDatePicker( picker, prev_month ) );
    }
    else {
      prev_month_btn.classList.add( 'disabled' );
    }

    // Next month button
    const next_month_btn = picker.querySelector( '.next-month' );
    if( this.last_date > next_month ) {
      next_month_btn.addEventListener( 'click', () => this.showDatePicker( picker, next_month ) );
    }
    else {
      next_month_btn.classList.add( 'disabled' );
    }

    this.addOnSelectEvent( picker );

    this.current_month = current_month;
    this.prev_month = prev_month;
    this.next_month = next_month;
  }





  /**
   * @desc
   * Creates the table of hours inside the picker
   *
   * @param {HTMLDivElement} picker The picker that contains the table
   * @param {Date} day Current day
   *
   * @see {@link module:js/picker-base.PickerBase~getWeekDayNo|getWeekDayNo}
   * @see {@link module:js/picker-base.PickerBase#getHourClassName|getHourClassName}
   * @see {@link module:js/picker-base.PickerBase#addOnSelectEvent|addOnSelectEvent}
   */
  this.showTimePicker = function( picker, day ) {
    const hours = [
      '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30',
      '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
      '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
    ];

    let i = 0, html = '', class_name;

    // Nine rows
    for( let j = 1; j < 9; j++ ) {
      html += "<tr>";

      // Six columns
      for( i = 1 * i ; i < 6 * j; i++ ) {
        if( hours[ i ] ) {
          class_name = ''
          class_name = this.getHourClassName( hours[ i ], day );

          html += `<td class="${ class_name }">${ hours[ i ] }</td>`;
        } else {
          html += `<td class="white-background disabled"></td>`;
        }
      }

      html += "</tr>";
    }

    picker.innerHTML =
    `<table class="time">
      <tr>
        <th colspan="7">
          ${ this.i18n[ days_order[ getWeekDayNo( day ) ] + '_' ] }
          ${ day.getDate() }
          <span class="month" data-i18n="${ months_order[ day.getMonth() ] + '_' }">${ this.i18n[ months_order[ day.getMonth() ] + '_' ] }</span>
        </th>
      </tr>
      ${ html }
    </table>`;

    this.addOnSelectEvent( picker );
  }





  /**
   * Returns a ISO string from a date passed as parameter.
   * It's used by {@link module:js/picker-base.PickerBase#printDateAndTime|printDateAndTime}.
   *
   * @param {Date} d
   */
  function date2ISOString( d ) {
    const YYYY = d.getFullYear();
    const MO = ( '0' + ( d.getMonth() + 1 ) ).slice( -2 );
    const DD = ( '0' + d.getDate() ).slice( -2 );
    const HH = ( '0' + d.getHours() ).slice( -2 );
    const MI = ( '0' + d.getMinutes() ).slice( -2 );
    return `${ YYYY }-${ MO }-${ DD }T${ HH }:${ MI }:00`;
  }





  /**
   * Returns a UTC timestamp from a local date passed as parameter.
   * It's used by {@link module:js/picker-base.PickerBase#printDateAndTime|printDateAndTime}.
   *
   * @param {Date} d
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/UTC|Date.UTC}
   */
  function date2UTCTimestamp( d ) {
    const utc_timestamp = Date.UTC( d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), 0, 0 );
    return Math.floor( utc_timestamp / 1000 );
  }





  /**
   * @desc
   * Returns a date depending on these precedence criteria:
   * - the date provided in a hidden input field takes priority over other dates;
   * - then follows the date provided by the settings object;
   * - default date provided by the {@link module:js/picker-base.PickerBase#setStartPickerProps|setStartPickerProps} method comes last.
   *
   * @param {Date} date_default Default date
   * @param {Date|string} date_param The date provided by the settings object
   * @param {HTMLInputElement|null} [input=null] A hidden input field with ISO date string in its value attribute
   * @return {Date}
   *
   * @see {@link module:js/picker-base.PickerBase~ISOString2Date|ISOString2Date}
   */
  function getDateBetween( date_default, date_param, input = null ) {
    let date;

    const prev_date = input?.value;
    if( prev_date ) {
      date = ISOString2Date( prev_date );
      if( date ) return date;
    }

    if( date_param ) {
      if( date_param instanceof Date ) {
        return date_param;
      }

      if( typeof date_param == 'string' ) {
        date = ISOString2Date( date_param );
        if( date ) return date;
      }
    }

    return date_default;
  }





  /**
   * @desc
   * Returns the day of the week as number accordingly to `user_days_order` (if any) or `Date.prototype.getDay` method.
   *
   * @param {Date} date Date we get the day of the week from
   * @return {number} The day of the week as number
   */
  function getWeekDayNo( date ) {
    let week_day = date.getDay();

    if( user_days_order ) {
      week_day = user_days_order.indexOf( default_days_order[ week_day ] );
    }

    return week_day;
  }





  /**
   * @desc
   * Tries to convert a date string in ISO format `iso_date` in a valid Date object in local time.
   * Accepted values are 'HHHH-MM-DD' and 'HHHH-MM-DDTHH:mm:ss''.
   *
   * @param {string} iso_date Date string in ISO format
   * @return {Date|null} `Date` if `iso_date` had a right pattern and was a valid date, `null` otherwise
   *
   * @see {@link https://css-tricks.com/everything-you-need-to-know-about-date-in-javascript/|Everything you need to know about date in JavaScript}
   */
  function ISOString2Date( iso_date ) {
    let date = null;
    const arr = iso_date.match( /^(\d{4})-(\d{2})-(\d{2})(T(\d{2}):(\d{2}):(\d{2}))?$/ );

    // If `iso_date` has the right pattern and it's a valid date (otherwise new Date returns NaN)
    if( arr && +new Date( arr[0] ) ) {
      const year = arr[1];
      const month = arr[2] - 1;
      const day = arr[3];
      if( !arr[4] ) {
        date = new Date( year, month, day );
      } else {
        const hours = arr[5];
        const minutes = arr[6];
        const seconds = arr[7];
        date = new Date( year, month, day, hours, minutes, seconds );
      }
    }

    return ( date ) ? date : null;
  }





  /**
   * Scrolls the page if the picker exceeds the viewport height.
   * It's used by {@link module:js/picker-base.PickerBase#onOpenPicker|onOpenPicker}.
   *
   * @param {HTMLDivElement} picker The open picker
   */
  function scrollPage( picker ) {
    const rect = picker.getBoundingClientRect();
    const diff = ( rect.top + picker.offsetHeight ) - document.documentElement.clientHeight

    if( diff > 0 ) {
      // Checks if scroll behavior is supported
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
  }





  /**
   * Sets the `days_order` variable depending on `first_day_no` parameter.
   * It's used by {@link module:js/picker-base.PickerBase#setStartPickerProps|setStartPickerProps}.
   *
   * @param {number} first_day_no The first day of week number from settings object
   */
  function setDaysOrder( first_day_no ) {
    first_day_no = +first_day_no;
    if( first_day_no > 6 ) {
      first_day_no = 6;
    }

    if( first_day_no > 0 ) {
      const array2 = default_days_order.slice( 0, first_day_no );
      const array1 = default_days_order.slice( first_day_no, default_days_order.length );
      user_days_order = array1.concat( array2 );
    }
    days_order = ( user_days_order ) ? user_days_order : default_days_order;
  }
}
