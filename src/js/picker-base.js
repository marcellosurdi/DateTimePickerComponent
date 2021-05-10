/**
 * @module js/picker-base
 * @author Marcello Surdi
 * @version 1.0.0
 *
 * @desc
 * This module contains the PickerBase class that serves as a base for Date*Picker classes.
 *
 * @todo Provide support to disable days and hours even if these are between `first_date` and `last_date`
 * @todo Provide support for touch events
 * @todo Provide a year/month picker
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
 * @property {HTMLDivElement} end_container Top level `div` container for end date/time buttons (end_* properties are present **only** if there's an interval)
 * @property {HTMLButtonElement} end_date_btn `button.date.end` inside `end_container`
 * @property {HTMLButtonElement} end_time_btn `button.time.end` inside `end_container`
 * @property {HTMLDivElement} end_picker `div.picker` inside `end_container`. It contains the calendar or the timetable
 * @property {Date} first_date First selectable date
 * @property {Date} start_date Start selected date
 * @property {Date} end_date End selected date
 * @property {Date} last_date Last selectable date
 * @property {string} date_output Denotes the date format returned to the value attribute of `input.date_output` (accepted values are short_ISO, full_ISO and timestamp)
 * @property {number} min_interval Denotes the minimum interval in milliseconds that must elapse between `start_date` and `end_date`
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
    'sep':'Set',
    'oct':'Sep',
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
  };

  const ms_per_day = 24 * 60 * 60 * 1000;
  const default_days_order = [ 'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat' ];
  const months_order = [ 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec' ];
  const hours = [
    '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30',
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
  ];
  // Click events don't always work like expected on iOS, we can use touchstart instead
  const click = ( navigator.userAgent.match( /(iPad|iPhone|iPod)/g ) ) ? 'touchstart' : 'click';
  let user_days_order, days_order;
  let mode = 'start';





  /**
   * Adds an event handler to `td.selectable` elements.
   * It's used by both {@link module:js/picker-base.PickerBase#showCalendar|showCalendar}
   * and {@link module:js/picker-base.PickerBase#showTimeTable|showTimeTable} methods.
   *
   * @param {HTMLDivElement} picker The picker currently open
   */
  this.addEventOnSelect = function( picker ) {
    let coll = picker.querySelectorAll( 'td.selectable' );

    for( let i = 0, n = coll.length; i < n; i++ ) {
      coll[ i ].addEventListener( 'click', this.onSelectDayOrHour );
    }
  }




  /**
   * Checks if dates are still consistent after user selection (`this.start_date` may be
   * greater than `this.end_start` and other similar cases) and fixes any inconsistencies.
   * It's used by both {@link module:js/picker-base.PickerBase#selectDay|selectDay}
   * and {@link module:js/picker-base.PickerBase#selectHour|selectHour} methods.
  */
  this.checkDateTimeConsistency = function() {
    if( !this.end_date ) {
      return;
    }

    const start_date_ms = this.start_date.getTime();
    const end_date_ms = this.end_date.getTime();
    const first_date_ms = this.first_date.getTime();
    const last_date_ms = this.last_date.getTime();

    if( mode == 'start' ) {
      if( start_date_ms >= end_date_ms ) {
        if( start_date_ms >= last_date_ms ) {
          this.start_date = new Date( last_date_ms - this.min_interval );
        }

        this.end_date = new Date( start_date_ms + this.min_interval );
				this.showDateAndTime( this.end_container, this.end_date );
			}
    }

    else {
      if( end_date_ms <= start_date_ms ) {
        if( end_date_ms <= first_date_ms ) {
          this.end_date = new Date( first_date_ms + this.min_interval );
        }

        this.start_date = new Date( end_date_ms - this.min_interval );
        this.showDateAndTime( this.start_container, this.start_date );
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
      document.body.removeEventListener( click, this.onClickOutside );
    }, ms );
  }





  /**
   * @desc
   * Returns dates (named `_dates`) converted in milliseconds and without hours/minutes information for
   * comparisons in {@link module:js/picker-base.PickerBase#getDayClassName|getDayClassName} method.
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
   * It's used inside a loop both when building table ({@link module:js/picker-base.PickerBase#onOpenPicker|onOpenPicker})
   * and when updating it ({@link module:js/picker-base.PickerBase#selectDay|selectDay}).
   *
   * @param {string} day The day inside a loop iteration
   * @param {Date} date Date object with current year/month information
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
    }

    if( this.end_date ) {
    	if( _curr_day > _dates._start_date && _curr_day < _dates._end_date ) {
    		class_name += ' interval';
    	}

    	if( _curr_day == _dates._end_date ) {
    		class_name += ' end-day ';
    	}
    }

    return class_name;
  }





  /**
   * Returns classes for `td` elements that contain the hour/minute pairs (HH:mm).
   * It's used inside a loop both when building table ({@link module:js/picker-base.PickerBase#onOpenPicker|onOpenPicker})
   * and when updating it ({@link module:js/picker-base.PickerBase#selectHour|selectHour}).
   *
   * @param {string} hour An hour/minute pair (HH:mm) inside a loop iteration
   * @param {Date} date Date object with current hour/minutes information
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
   * @param {string} type 'date' or 'datetime'
   * @param {string} mode='start' 'start' or 'end'
   * @return {string} HTML for requested button
   */
  this.getHTMLButton = function( type, mode = 'start' ) {
    let html;

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
        <input type="hidden" class="date_output" value="">`;
      break;
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
        <input type="hidden" class="date_output" value="">`;
    }

    return html;
  }





  /**
   * This is a click handler that closes the picker if the user clicks outside of it.
   *
   * @param {Event} e
   *
   * @see {@link module:js/picker-base.PickerBase#closePicker|closePicker}
  */
  this.onClickOutside = ( e ) => {
    let div = ( mode == 'start' ) ? this.start_picker : this.end_picker;

    if( e.type == 'touchstart' ) {
      e.clientX = e.touches[0].clientX;
      e.clientY = e.touches[0].clientY;
    }
    let el = document.elementFromPoint( e.clientX, e.clientY );
    let inside = false;

    do {
      if( el.matches( `#${ div.parentElement.id }.datetime-container` ) ) {
        inside = true;
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
   * @see {@link module:js/picker-base.PickerBase#showCalendar|showCalendar}
   * @see {@link module:js/picker-base.PickerBase#showTimeTable|showTimeTable}
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

    // If there is not an interval, only the start date exists
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

      document.body.addEventListener( click, this.onClickOutside );

      let suffix = ( btn.classList.contains( 'date' ) )? 'Calendar' : 'TimeTable';
      let method = 'show' + suffix;
      this[ method ]( picker, date );

      scrollPage( picker );
    }

    // ...otherwise
    else {
      // The picker was already open, so we close it
      picker.style.display = 'none';
      document.body.removeEventListener( click, this.onClickOutside );
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
   * Selects the day clicked by the user and then closes the picker. It's used by
   * {@link module:js/picker-base.PickerBase#onSelectDayOrHour|onSelectDayOrHour} method.
   *
   * @param {module:js/picker-base.PickerBaseNS.UserSelection} o Object with contextual info
   *
   * @see {@link module:js/picker-base.PickerBase#showDateAndTime|showDateAndTime}
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

    this.showDateAndTime( o.container, o.date, 'date' );

    this.closePicker( o.picker, o.btn, 500 );
  }





  /**
   * Selects the hour/minute pair clicked by the user and then closes the picker.
   *
   * @param {module:js/picker-base.PickerBaseNS.UserSelection} o Object with contextual info
   *
   * @see {@link module:js/picker-base.PickerBase#showDateAndTime|showDateAndTime}
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

    this.showDateAndTime( o.container, o.date, 'time' );

    this.closePicker( o.picker, o.btn, 500 );
  }





  /**
   * @desc
   * Initializes the end date picker properties.
   *
   * @param {string} id id of the `div` element that will contain the button(s)
   * @param {Date|string|null} [end_date_setting] End selected date from settings
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
    const end_date_default = new Date( this.start_date.getTime() + this.min_interval );
    let end_date = getDateBetween( end_date_default, end_date_setting, this.start_container.querySelector( 'input.end_date' ) );
    // End selected date must be greater than start selected date
    if( end_date < this.start_date) {
      end_date = end_date_default;
    }

    roundMinutes( [ end_date ] );

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
   * @param {Date} [start_date_setting] Start selected date from settings
   * @param {Date} [first_date_setting] First selectable date from settings
   * @param {Date} [last_date_setting] Last selectable date from settings
   * @param {number} [first_day_no] Day the week must start with. Accordingly to returned values of `Date.getDate` method, accepted range values are 0-6 where 0 means Sunday, 1 means Monday and so on
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
    let start_date = getDateBetween( start_date_default, start_date_setting, el.querySelector( 'input.start_date' ) );

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

    roundMinutes( [ start_date, first_date, last_date ] );

    setDaysOrder( first_day_no );

    this.start_container = el;
    this.start_date = start_date;
    this.first_date = first_date;
    this.last_date = last_date;
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
   * @see {@link module:js/picker-base.PickerBase#addEventOnSelect|addEventOnSelect}
   */
  this.showCalendar = function( picker, date ) {
    let class_name, html = '';

    const month = date.getMonth();
    const year = date.getFullYear();

    // February length
    const feb = ( ( year % 100 != 0 ) && ( year % 4 == 0 ) || ( year % 400 == 0 ) ) ? 29 : 28;
    const total_days = [ '31', feb, '31', '30', '31', '30', '31', '31', '30', '31', '30', '31' ];

    // First day of current month as number
    let week_day = getWeekDayNo( new Date( year, month, 1 ) );

    const _dates = this.get_Dates();

    // This loop displays the last days of the previous month
    let i = 0
    let j = week_day;
    this.prev_month = new Date( year, ( month - 1 ), 1, date.getHours(), date.getMinutes() );
    const prev_month_total_days = total_days[ this.prev_month.getMonth() ];
    while( j > 0 ) {
      i = ( prev_month_total_days - ( j - 1 ) );
      class_name = this.getDayClassName( i, this.prev_month, _dates );
      html += `<td class="prev-month ${ class_name }">${ i }</td>`;
      j--;
    }


    // This loop displays the days of the current month
    i = 1;
    this.current_month = new Date( date.getTime() );
    while ( i <= total_days[ month ] ) {
      // Starts a new row
      if( week_day > 6 ) {
        week_day = 0;
        html += "</tr><tr>";
      }

      class_name = this.getDayClassName( i, this.current_month, _dates );
      html += `<td class="${ class_name }">${ i }</td>`;

      week_day++;
      i++;
    }

    // This loop displays the first days of the next month
    this.next_month = new Date( year, ( month + 1 ), 1, date.getHours(), date.getMinutes() );
    for( i = 1; week_day <= 6; week_day++, i++ ) {
      class_name = this.getDayClassName( i, this.next_month, _dates );
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
    this.prev_month.setDate( prev_month_total_days );
    const prev_month_btn = picker.querySelector( '.prev-month' );
    if( this.prev_month > this.first_date ) {
      prev_month_btn.addEventListener( 'click', () => this.showCalendar( picker, this.prev_month ) );
    }
    else {
      prev_month_btn.classList.add( 'disabled' );
    }

    // Next month button
    const next_month_btn = picker.querySelector( '.next-month' );
    if( this.last_date > this.next_month ) {
      next_month_btn.addEventListener( 'click', () => this.showCalendar( picker, this.next_month ) );
    }
    else {
      next_month_btn.classList.add( 'disabled' );
    }

    this.addEventOnSelect( picker );
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
   * @see {@link module:js/picker-base.PickerBase~getISOStringTZ|getISOStringTZ}
   */
  this.showDateAndTime = function( div, date ) {
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
    const full_iso = getISOStringTZ( date );
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
      // Timestamp value without milliseconds information
      case 'timestamp':
      default:
        output_date = Math.round( date.getTime() / 1000 );
    }

    div.querySelector( 'input.date_output' ).value = output_date;
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
   * @see {@link module:js/picker-base.PickerBase#addEventOnSelect|addEventOnSelect}
   */
  this.showTimeTable = function( picker, day ) {
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

    this.addEventOnSelect( picker );
  }





  /**
   * @desc
   * Returns a date depending on these precedence criteria:
   * - the date provided in a hidden input field (if any) takes priority over other dates;
   * - then follows the date provided by the settings object;
   * - default date provided by the {@link module:js/picker-base.PickerBase#setStartPickerProps|setStartPickerProps} method comes last.
   *
   * @param {Date} date_default Default date
   * @param {Date|string} date_param The date provided by the settings object
   * @param {HTMLInputElement|null} [input=null] A hidden input field with ISO date string in its value attribute
   * @return {Date}
   *
   * @see {@link module:js/picker-base.PickerBase~ISO2Date|ISO2Date}
   */
  function getDateBetween( date_default, date_param, input = null ) {
    let date;

    const prev_date = input?.value;
    if( prev_date ) {
      date = ISO2Date( prev_date );
      if( date ) return date;
    }

    if( date_param ) {
      if( date_param instanceof Date ) {
        return date_param;
      }

      if( typeof date_param == 'string' ) {
        date = ISO2Date( date_param );
        if( date ) return date;
      }
    }

    return date_default;
  }





  /**
   * Returns a ISO string with timezone offset from date passed as parameter.
   * It's used by {@link module:js/picker-base.PickerBase#showDateAndTime|showDateAndTime}.
   *
   * @param {Date} date
   */
  function getISOStringTZ( date ) {
    // Offset in milliseconds (because Date.getTimezoneOffset returns minutes)
    const time_zone_offset = ( new Date() ).getTimezoneOffset() * 60000;
    // toISOString with timezone offset, the slice(0, -5) gets rid of the trailing .ssssZ
    return ( new Date( date.getTime() - time_zone_offset ) ).toISOString().slice( 0, -5 );
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
   * Tries to convert `iso_date` in a valid Date object (always in local time).
   * Accepted values are 'HHHH-MM-DD' and 'HHHH-MM-DDTHH:mm:ss''.
   *
   * @param {string} iso_date Date string
   * @return {Date|null} `Date` if `iso_date` had a right pattern and was a valid date, `null` otherwise
   *
   * @see {@link https://css-tricks.com/everything-you-need-to-know-about-date-in-javascript/|Everything you need to know about date in JavaScript}
   */
  function ISO2Date( iso_date ) {
    let date = null;
    const arr = iso_date.match( /^(\d{4})-(\d{2})-(\d{2})(T(\d{2}):(\d{2}):(\d{2}))?$/ );

    // If `iso_date` has the right pattern and it's a valid date (i.e. new Date doesn't return NaN)
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
   * @desc
   * Rounds minutes to the next half hour.
   *
   * @param {array} dates An array containing an arbitrary number of dates to be rounded
   */
  function roundMinutes( dates ) {
    dates.forEach( ( date ) => {
      date.setSeconds( 0, 0 );

      let m = date.getMinutes();
      let h = date.getHours();
      if( m > 0 && m <= 30 ) {
        m = 30;
      }
      else if( m > 30 ) {
        m = 0;
        // If we round the minutes to 0 we have to sum +1 hour
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