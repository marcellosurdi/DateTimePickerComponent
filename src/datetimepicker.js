'use strict';

/**
 * Crea un datepicker
 * @class
 */
DatePicker = function() {
	let self = this;

	let hours = [
		'00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30',
		'08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
		'16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'
	];
	let months_fullname = [ 'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre' ];
	let months_label = [ 'gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic' ];
	let days_label = [ 'lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom' ];
	let ms_per_day = 24 * 60 * 60 * 1000;
	let ms_per_hour = 60 * 60 * 1000;
	let evt = 'click';

	/**
	 * Elemento div che contiene i pulsanti di inizio intervallo
	 * @member {HTMLDivElement}
	 */
	let el_start = '';

	/**
	 * Elemento div che contiene i pulsanti di fine intervallo
	 * @member {HTMLDivElement}
	 */
	let el_end = '';

	/**
	 * La data suggerita di inizio intervallo
	 * @member {Date}
	 */
	let start_date = null;

	/**
	 * La data suggerita di fine intervallo
	 * @member {Date}
	 */
	let end_date = null;

	/**
	 * L'oggetto prima data disponibile per il calcolo dell'intervallo
	 * @member {Date}
	 */
	let min_date = null;

	/**
	 * Tempo minimo di intervallo in millisecondi intercorrente tra inizio e fine
	 * @member {int}
	 */
	let min_time = 0;

	/**
	 * L'oggetto ultima data disponibile per il calcolo dell'intervallo
	 * @member {Date}
	 */
	let max_date = null;

	/**
	 * Massimo numero di giorni compresi in un intervallo
	 * @member {int}
	 */
	let max_days = null;

	/**
	 * Pulsante che apre il pannello con il calendario per la scelta della data di inizio intervallo
	 * @member {HTMLDivElement}
	 */
	let start_date_btn = null;

	/**
	 * Pulsante che apre il pannello con la griglia per la scelta dell'orario di inizio intervallo
	 * @member {HTMLDivElement}
	 */
	let start_time_btn = null;

	/**
	 * Il pannello che contiene il calendario per la scelta della data o la griglia per la scelta dell'orario di inizio intervallo
	 * @member {HTMLDivElement}
	 */
	let start_picker_div = null;

	/**
	 * Pulsante che apre il pannello con il calendario per la scelta della data di fine intervallo
	 * @member {HTMLDivElement}
	 */
	let end_date_btn = null;

	/**
	 * Pulsante che apre il pannello con la griglia per la scelta dell'orario di fine intervallo
	 * @member {HTMLDivElement}
	 */
	let end_time_btn = null;

	/**
	 * Il pannello che contiene il calendario per la scelta della data o la griglia per la scelta dell'orario di fine intervallo
	 * @member {HTMLDivElement}
	 */
	let end_picker_div = null;

	/**
	 * Indica se si sta lavorando in modalità di inizio (start) o fine (end) intervallo
	 * @member {string}
	 * @see DatePicker#onOpenPicker
	 */
	let mode = 'start';

	/**
	 * La data che contiene tutte le informazioni relative al mese precedente rispetto a quello selezionato
	 * @member {Date}
	 * @see DatePicker#showDateTable
	 */
	let prev_month = null;

	/**
	 * La data che contiene tutte le informazioni relative al mese selezionato
	 * @member {Date}
	 * @see DatePicker#showDateTable
	 */
	let current_month = null;

	/**
	 * La data che contiene tutte le informazioni relative al mese successivo rispetto a quello selezionato
	 * @member {Date}
	 * @see DatePicker#showDateTable
	 */
	let next_month = null;

	/**
	 * Inizializza le variabili principali ed i gestori di eventi.
	 * Stampa le date suggerite di inizio e fine intervallo
	 *
	 * @param {string} id_div_start id del div che contiene i pulsanti di inizio intervallo
	 * @param {string} id_div_end id del div che contiene i pulsanti di fine intervallo
	 * @param {Date} [start_interval] Data suggerita di inizio intervallo
	 * @param {Date} [end_interval] Data suggerita di fine intervallo
	 * @param {Date} [min_interval] Prima data disponibile per il calcolo dell'intervallo
	 * @param {number} [min_time_interval] Tempo minimo di intervallo in millisecondi intercorrente tra inizio e fine
	 * @param {Date} [max_interval] Ultima data disponibile per il calcolo dell'intervallo
	 * @param {number} [max_interval_days] numero massimo di giorni compresi in un intervallo
	 * @see DatePicker#roundMinutes
	 * @see DatePicker#printDateAndTime
	 * @see DatePicker#bindEvents
	 */
	this.init = function( id_div_start, id_div_end, start_interval, end_interval, min_interval, min_time_interval, max_interval, max_interval_days ) {
		el_start = document.getElementById( id_div_start );
		el_end = document.getElementById( id_div_end );
		if( el_start == null || el_end == null ) {
			// Esce se gli id passati non sono validi
			return false;
		}

		// Calcola la prima data disponibile per il calcolo dell'intervallo
		// min_date = min_interval || new Date( new Date().getTime() + ms_per_day );
		min_date = min_interval || new Date( new Date().getTime() + 2 * 60 * 60 * 1000 );

		let prev_start_value = parseInt( document.getElementById( 'start_interval_value' ).value );
		let prev_end_value = parseInt( document.getElementById( 'end_interval_value' ).value );
		let max_end_value = parseInt( document.getElementById( 'max_interval_value' ).value );
		let prev_start_interval;
		let prev_end_interval;
		let max_end_interval;

		if( prev_start_value > 0 && prev_end_value > 0 ) {
			prev_start_interval = new Date( prev_start_value * 1000 );
			prev_end_interval = new Date( prev_end_value * 1000 );

			if( prev_start_interval < min_date ) {
				// Se la data suggerita di inizio intervallo non è valida le considera entrambe inattendibili
				prev_start_interval = prev_end_interval = null;
			}
		}

		if( max_end_value > 0 ) {
			max_end_interval = new Date( max_end_value * 1000 );

			if( max_end_interval < min_date ) {
				max_end_interval = null;
			}
		}

		start_date = start_interval || prev_start_interval || new Date( min_date.getTime() );
		end_date = end_interval || prev_end_interval || new Date( start_date.getTime() + ms_per_day );
		min_time = min_time_interval || ms_per_hour;
		max_date = max_interval || max_end_interval || new Date( start_date.getTime() + ( ms_per_day * 364 ) );
		max_days = max_interval_days || 999;
		start_date_btn = el_start.querySelector( '.start.date' );
		start_time_btn = el_start.querySelector( '.start.time' );
		start_picker_div = el_start.nextElementSibling;
		end_date_btn = el_end.querySelector( '.end.date' );
		end_time_btn = el_end.querySelector( '.end.time' );
		end_picker_div = el_end.nextElementSibling;

		min_date = this.roundMinutes( min_date );
		max_date = this.roundMinutes( max_date );
		start_date = this.roundMinutes( start_date );
		end_date = this.roundMinutes( end_date );

		this.printDateAndTime( el_start, start_date );
		this.printDateAndTime( el_end, end_date );

		this.bindEvents();
	}

	/**
	 * Arrotonda i minuti ad intervalli di 30
	 *
	 * @param {Date} date La data da arrotondare
	 * @return {Date} La data arrotondata
	 */
	this.roundMinutes = function( date ) {
		date.setSeconds( 0, 0 );

		let m = date.getMinutes();
		let h = date.getHours();
		if( m == 0 ) {
			m = 0;
		} else if( m > 0 && m <= 30 ) {
			m = 30;
		} else {
			// Se arrotonda i minuti a 0 considera un'ora in più
			m = 0;
			h = h + 1;
			// Se in seguito all'arrotondamento si raggiunge la mezzanotte considera un giorno in più
			if( h == 24 ) {
				h = 0;
				date = new Date( date.getTime() + ms_per_day );
			}
			date.setHours( h );
		}
		date.setMinutes( m );

		return date;
	}

	/**
	 * Stampa nella pagina la data e l'orario di inizio o fine intervallo
	 *
	 * @param {HTMLDivElement} div Il contenitore dei pulsanti in cui stampare le informazioni di data o ora
	 * @param {Date} date La data di inizio o fine intervallo da stampare
	 */
	this.printDateAndTime = function( div, date ) {
		let span = div.querySelectorAll( 'div.date > *, div.time *' );
		let week_day = this.getWeekDay( date );

		span[0].innerHTML = i18n[ days_label[ week_day ] ];
		span[1].value = ( '0' + date.getDate() ).slice( -2 );
		span[2].innerHTML = '<em data-i18n="' + months_label[ date.getMonth() ] + '">' + i18n[ months_label[ date.getMonth() ] ] + '</em><br>' + date.getFullYear();

		span[3].innerHTML = ( '0' + date.getHours() ).slice( -2 );
		span[4].innerHTML = ':' + ( '0' + date.getMinutes() ).slice( -2 );

		let dates = this.returnDates();
		document.getElementById( 'start_interval_value' ).value = dates.out;
		document.getElementById( 'end_interval_value' ).value = dates.in;
	}

	/**
	 * Restituisce il giorno della settimana come numero (0 - Lunedì, 6 - Domenica)
	 *
	 * @param {Date} date Oggetto data da cui ricavare il giorno della settimana
	 * @return {number} Il giorno della settimana espresso in numero
	 */
	this.getWeekDay = function( date ) {
		let week_day = date.getDay();
		// Restituisce lo 0 per il Lunedì, l'1 per il Martedì a seguire
		return ( week_day > 0 ) ? ( week_day - 1 ) : 6;
	}

	/**
	 * Inizializza i principali gestori di eventi
	 *
	 * @see DatePicker#onOpenPicker
	 * @see DatePicker#onSelectDayOrHour
	 */
	this.bindEvents = function() {
		start_date_btn.addEventListener( 'click', this.onOpenPicker );
		start_date_btn.querySelector( 'input' ).addEventListener( 'focus', onFocus );
		start_date_btn.querySelector( 'input' ).addEventListener( 'click', onClick );
		end_date_btn.addEventListener( 'click', this.onOpenPicker );
		end_date_btn.querySelector( 'input' ).addEventListener( 'focus', onFocus );
		end_date_btn.querySelector( 'input' ).addEventListener( 'click', onClick );
		start_time_btn.addEventListener( 'click', this.onOpenPicker );
		end_time_btn.addEventListener( 'click', this.onOpenPicker );

		function onFocus( e ) {
			this.setSelectionRange( 0, 0 );
			this.blur();
			// Se il focus arriva tramite Tab o tasto precedente/successivo della virtual keyboard apre il pannello simulando l'evento click
			// Se il focus arriva tramite click dentro il campo di testo sarà tuttavia necessario arrestare la propagazione dell'evento per impedire che questo venga processato due volte
			this.parentElement.click();
		}

		function onClick( e ) {
			e.stopPropagation();
		}
	}

	/**
	 * Metodo eseguito quando l'utente clicca uno dei quattro pulsanti per selezionare una data o un orario di ritiro o consegna
	 *
	 * @param {MouseEvent} e
	 * @see DatePicker#showDateTable
	 * @see DatePicker#showTimeTable
	 */
	this.onOpenPicker = function( e ) {
		let div_open, div_close, date;

		document.body.addEventListener( evt, self.ifClickOutside );

		// Se il pulsante ha già il focus lo toglie
		this.classList.toggle( 'btn-background' );
		// Toglie il focus dagli altri pulsanti
		let coll = document.querySelectorAll( 'div#' + el_start.id + ' > div, div#' + el_end.id + ' > div' );
		for( let i = 0; i < coll.length; i++ ) {
			if( coll[ i ] != this ) {
				coll[ i ].classList.remove( 'btn-background' );
			}
		}

		// Stabilisce se occorre impostare la data di inizio o fine intervallo
		if( e.currentTarget.classList.contains( 'start' ) ) {
			div_open = start_picker_div;
			div_close = end_picker_div;
			date = start_date;
			mode = 'start';
		} else {
			div_open = end_picker_div;
			div_close = start_picker_div;
			date = end_date;
			mode = 'end';
		}

		if( this.classList.contains( 'btn-background' ) ) {
			// Apre il pannello corrente
			div_open.style.display = 'block';
			// Se un altro pannello è aperto lo chiude
			div_close.style.display = 'none';
			let substr = ( this.classList.contains( 'date' ) )? 'Date' : 'Time';
			let method = 'show' + substr + 'Table';
			self[ method ]( div_open, date );

			// Rende il contenuto del pannello corrente visibile in caso superi l'altezza del viewport
			let box = e.currentTarget.getBoundingClientRect();
			let h = box.top + e.currentTarget.offsetHeight + div_open.offsetHeight;
			let height_diff = h - document.documentElement.clientHeight

			if( height_diff > 0 ) {
				window.scrollBy( 0, height_diff );
			}
		} else {
			// Se si preme nuovamente il pulsante chiude il pannello aperto
			div_open.style.display = 'none';
			document.body.removeEventListener( evt, self.ifClickOutside );
		}
	}

	/**
	 * Genera il calendario per la scelta della data di ritiro o consegna
	 *
	 * @param {HTMLDivElement} picker Il pannello che contiene il calendario per la scelta della data di inizio o fine intervallo
	 * @param {Date} date La data che contiene le informazioni relative a mese e anno corrente di inizio o fine intervallo
	 * @see DatePicker#getDayClassName
	 */
	this.showDateTable = function( picker, date ) {
		let class_name, html = '';

		let month = date.getMonth();
		let year = date.getFullYear();

		current_month = new Date( date.getTime() );

		// Determina la durata del mese di Febbraio
		let feb = ( ( year % 100 != 0 ) && ( year % 4 == 0 ) || ( year % 400 == 0 ) ) ? 29 : 28;
		let total_days = [ '31', '' + feb + '', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31' ];

		let week_day = this.getWeekDay( new Date( year, month, 1 ) );

		prev_month = new Date( year, ( month - 1 ), 1, date.getHours(), date.getMinutes() );
		let prev_month_total_days = total_days[ prev_month.getMonth() ];
		let j = week_day;

		let i = 0
		while( j > 0 ) {
			i = ( prev_month_total_days - ( j - 1 ) );
			class_name = this.getDayClassName( i, prev_month );
			html += "<td class='prev-month " + class_name + "'>" + i + "</td>";
			j--;
		}

		i = 1;
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

		next_month = new Date( year, ( month + 1 ), 1, date.getHours(), date.getMinutes() );
		for( i = 1; week_day <= 6; week_day++, i++ ) {
			class_name = this.getDayClassName( i, next_month );
			html += "<td class='next-month " + class_name + "'>" + i + "</td>";
		}

		picker.innerHTML =
			"<table class='date'>" +
				"<tr>" +
					"<th><a href='javascript:void(0);' class='prev-month'>&laquo;</a></th>" +
					"<th colspan='5'>" +
						"<span data-i18n='" + months_fullname[ month ] + "'>" + i18n[ months_fullname[ month ] ] +"</span> " +
						"<span class='number'>" + year + "</span>" +
					"</th>" +
					"<th><a href='javascript:void(0);' class='next-month'>&raquo;</a></th>" +
				"</tr>" +
				"<tr>" +
					"<td class='day-label' data-i18n='" + days_label[0] + "'>" + i18n[ days_label[0] ] + "</td>" +
					"<td class='day-label' data-i18n='" + days_label[1] + "'>" + i18n[ days_label[1] ] + "</td>" +
					"<td class='day-label' data-i18n='" + days_label[2] + "'>" + i18n[ days_label[2] ] + "</td>" +
					"<td class='day-label' data-i18n='" + days_label[3] + "'>" + i18n[ days_label[3] ] + "</td>" +
					"<td class='day-label' data-i18n='" + days_label[4] + "'>" + i18n[ days_label[4] ] + "</td>" +
					"<td class='day-label' data-i18n='" + days_label[5] + "'>" + i18n[ days_label[5] ] + "</td>" +
					"<td class='day-label' data-i18n='" + days_label[6] + "'>" + i18n[ days_label[6] ] + "</td>" +
				"</tr>" +
				"<tr>" +
				html +
				"</tr>" +
			"</table>";

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
	}

	/**
	 * Ricava le classi da assegnare agli elementi <td> che contengono i giorni nei calendari di inizio o di fine intervallo
	 * Utilizzato sia in fase di inizializzazione della tabella sia in fase di aggiornamento della stessa sempre all'interno di un ciclo iterativo
	 *
	 * @param {string} day Il giorno corrente corrente all'interno del ciclo iterativo
	 * @param {Date} date La data che contiene le informazioni relative al mese corrente
	 * @return {string} Le classi da assegnare all'elemento <td> corrente all'interno del ciclo iterativo
	 */
	this.getDayClassName = function( day, date ) {
		let class_name, if_btn;

		// Non tiene conto delle informazioni dell'orario
		let start_date_ms = new Date( start_date.getFullYear(), start_date.getMonth(), start_date.getDate() ).getTime();
		let end_date_ms = new Date( end_date.getFullYear(), end_date.getMonth(), end_date.getDate() ).getTime();
		let curr_day_ms = new Date( date.getFullYear(), date.getMonth(), day ).getTime();
		let min_date_ms = new Date( min_date.getFullYear(), min_date.getMonth(), min_date.getDate() ).getTime();
		let max_date_ms = new Date( max_date.getFullYear(), max_date.getMonth(), max_date.getDate() ).getTime();

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
			if_btn = ( mode == 'start' ) ? 'btn-background' : 'light-a-background';
			class_name += ' start ' + if_btn;
		}
		// Giorno compreso nell'intervallo
		if( curr_day_ms > start_date_ms && curr_day_ms < end_date_ms ) {
			class_name += ' xlight-grey-background';
		}
		// Giorno di fine intervallo
		if( curr_day_ms == end_date_ms ) {
			if_btn = ( mode == 'end' ) ? 'btn-background' : 'light-a-background';
			class_name += ' end ' + if_btn;
		}

		return class_name;
	}

	/**
	 * Genera la griglia per la scelta dell'orario di inizio o fine intervallo
	 *
	 * @param {HTMLDivElement} picker Il pannello che contiene la griglia per la scelta dell'orario di inizio o fine intervallo
	 * @param {Date} day La data che contiene le informazioni relative a mese e anno corrente di inizio o fine intervallo
	 * @see DatePicker#getHourClassName
	 */
	this.showTimeTable = function( picker, day ) {
		let j, i = 0, html = '', class_name;

		for( j = 1; j < 9; j++ ) {
			html += "<tr>";

			for( i = 1 * i ; i < 6 * j; i++ ) {
				if( hours[i] ) {
					class_name = this.getHourClassName( hours[i], day );

					html += "<td class='" + class_name + "'>" + hours[i] + "</td>";
				} else {
					html += "<td class='white-background disabled'></td>";
				}
			}

			html += "</tr>";
		}

		picker.innerHTML =
			"<table class='time'>" +
			"<tr>" +
				"<th colspan='7'>" +
					"<span class='number'>" + day.getDate() + "</span> " +
					"<span data-i18n='" + months_fullname[ day.getMonth() ] + "'>" + i18n[ months_fullname[ day.getMonth() ] ] + "</span>" +
				"</th>" +
			"</tr>" +
			html +
			"</table>";

			this.addEventOnSelect();
	}

	/**
	 * Ricava le classi da assegnare agli elementi <td> che contengono le ore ed i minuti (hh:mm) nelle griglie di inizio o di fine intervallo
	 * Utilizzato sia in fase di inizializzazione della tabella sia in fase di aggiornamento della stessa sempre all'interno di un ciclo iterativo
	 *
	 * @param {string} hour L'orario hh:mm corrente all'interno del ciclo iterativo
	 * @param {Date} date La data che contiene le informazioni relative all'orario di inizio o di fine intervallo
	 * @return {string} Le classi da assegnare all'elemento <td> corrente all'interno del ciclo iterativo
	 */
	this.getHourClassName = function( hour, date ) {
		// Indica l'orario selezionato dall'utente aggiornato subito prima la chiamata al metodo getHourClassName
		let selected_hour = ( '0' + date.getHours() ).slice( -2 ) + ':' + ( '0' + date.getMinutes() ).slice( -2 );

		let h = hour.split( ':' );

		// Si crea un oggetto Date temporaneo per confrontare ogni orario del ciclo iterativo con quello selezionato dall'utente
		let tmp_day = new Date( date.getTime() );
		tmp_day.setHours( h[0], h[1], 0, 0 );

		let class_name = 'hour ';
		if( tmp_day < min_date || tmp_day > max_date ) {
			class_name += 'disabled';
		} else {
			class_name += 'selectable';
			class_name += ( selected_hour == hour ) ? ' btn-background '+ mode : '';
		}

		return class_name;
	}

	/**
	 * Aggiunge il gestore di eventi per i giorni o gli orari selezionabili
	 *
	 * @see DatePicker#showDateTable
	 * @see DatePicker#showTimeTable
	 * @see DatePicker#onSelectDayOrHour
	 */
	this.addEventOnSelect = function() {
		let coll = document.querySelectorAll( 'td.selectable' );
		let n = coll.length;

		for( let i = 0; i < n; i++) {
			coll[ i ].addEventListener( 'click', self.onSelectDayOrHour );
		}
	}

	/**
	 * Metodo eseguito quando l'utente clicca per selezionare un giorno o un orario
	 *
	 * @param {MouseEvent} e
	 */
	this.onSelectDayOrHour = function( e ) {
		let obj = {};
		obj.text = e.target.textContent;

		let if_hour = ( obj.text.indexOf(':') != -1 ) ? true : false;

		if( mode == 'start' ) {
			obj.date = start_date;
			obj.div_close = start_picker_div;
			obj.interval_div = el_start;
			obj.btn = ( !if_hour ) ? start_date_btn : start_time_btn;
		} else {
			obj.date = end_date;
			obj.div_close = end_picker_div;
			obj.interval_div = el_end;
			obj.btn = ( !if_hour ) ? end_date_btn : end_time_btn;
		}

		if( if_hour ) {
			let arr = obj.text.split(':');
			obj.hour = arr[0];
			obj.minute = arr[1]
		} else {
			obj.prev_month = e.target.classList.contains('prev-month');
			obj.next_month = e.target.classList.contains('next-month');
		}

		let substr = ( e.target.classList.contains( 'day' ) )? 'Day' : 'Hour';
		let method = 'select' + substr;
		self[ method ]( obj );
	}

	/**
	 * Seleziona il giorno scelto dall'utente
	 *
	 * @param {object} obj Oggetto contenente tutte le informazioni contestuali calcolate dal metodo chiamante {@link DatePicker#onSelectDayOrHour}
	 * @see DatePicker#printDateAndTime
	 * @see DatePicker#closeDateOrHourTable
	 */
	this.selectDay = function( obj ) {
		if( obj.prev_month ) {
			obj.date.setFullYear( prev_month.getFullYear(), prev_month.getMonth(), obj.text );
		} else if( obj.next_month ) {
			obj.date.setFullYear( next_month.getFullYear(), next_month.getMonth(), obj.text );
		} else {
			obj.date.setFullYear( current_month.getFullYear(), current_month.getMonth(), obj.text );
		}

		// Ricava le rispettive date senza differenze di orario
		let _start_date = new Date( start_date.getFullYear(), start_date.getMonth(), start_date.getDate() );
		let _end_date = new Date( end_date.getFullYear(), end_date.getMonth(), end_date.getDate() );
		let _curr_date = new Date( obj.date.getFullYear(), obj.date.getMonth(), obj.date.getDate() );
		let _min_date = new Date( min_date.getFullYear(), min_date.getMonth(), min_date.getDate() );
		let _max_date = new Date( max_date.getFullYear(), max_date.getMonth(), max_date.getDate() );
		this.checkDateTimeContraints( obj, _start_date, _end_date, _curr_date, _min_date, _max_date );

		// Aggiorna il calendario
		let coll = document.querySelectorAll( 'td.selectable' );
		let l = coll.length

		for( let i = 0; i < l; i++ ) {
			let param, class_name = '';
			if( coll[ i ].classList.contains( 'prev-month' ) ) {
				param = prev_month;
				class_name += 'prev-month ';
			}
			else if( coll[ i ].classList.contains( 'next-month' ) ) {
				param = next_month;
				class_name += 'next-month ';
			}
			else {
				param = current_month;
			}
			class_name += this.getDayClassName( coll[ i ].textContent, param );
			coll[ i ].className = class_name;
		}

		// Stampa nella pagina
		this.printDateAndTime( obj.interval_div, obj.date );

		// Chiude il pannello attivo e toglie il focus dal pulsante corrispondente
		this.closeDateOrHourTable( obj.btn, obj.div_close, 500 );
	}

	/**
	 * Seleziona l'orario scelto dall'utente
	 *
	 * @param {object} obj Oggetto contenente tutte le informazioni contestuali calcolate dal metodo chiamante {@link DatePicker#onSelectDayOrHour}
	 * @see DatePicker#printDateAndTime
	 * @see DatePicker#closeDateOrHourTable
	 */
	this.selectHour = function( obj ) {
		// Aggiorna l'orario in memoria di inizio o fine intervallo
		obj.date.setHours( obj.hour, obj.minute, 0, 0 );
		// Ricava le rispettive date tenendo conto del tempo minimo di intervallo
		let _start_date = new Date( start_date.getTime() + min_time );
		let _end_date = new Date( end_date.getTime() - min_time );
		let _curr_date = new Date( obj.date.getTime() );
		let _min_date = new Date( min_date.getTime() + min_time );
		let _max_date = new Date( max_date.getTime() - min_time );
		this.checkDateTimeContraints( obj, _start_date, _end_date, _curr_date, _min_date, _max_date );

		// Aggiorna la tabella contenente gli orari di inizio o fine intervallo
		let coll = document.querySelectorAll( 'td.selectable' );
		let l = coll.length
		for( let i = 0; i < l; i++ ) {
			coll[i].className = this.getHourClassName( coll[i].textContent, obj.date );
		}

		// Stampa nella pagina
		this.printDateAndTime( obj.interval_div, obj.date );

		// Chiude il pannello
		this.closeDateOrHourTable( obj.btn, obj.div_close, 500 );
	}

	/**
	 * Verifica:
	 *  - che la data di inizio intervallo non sia maggiore di quella di fine intervallo;
	 *  - che la data di fine intervallo non sia minore della data di inizio intervallo;
	 *  - che i limiti della prima e dell'ultima data disponibile per il calcolo dell'intervallo non vengano mai elusi
	 *  - che i giorni di intervallo non eccedano quelli consentiti
	 *
	 * @param {object} obj Oggetto contenente tutte le informazioni contestuali calcolate dal metodo {@link DatePicker#onSelectDayOrHour}
	 * @param {Date} _start_date Data suggerita di inizio intervallo
	 * @param {Date} _end_date Data suggerita di fine intervallo
	 * @param {Date} _curr_date Data selezionata dall'utente
	 * @param {Date} _min_date Prima data disponibile per il calcolo dell'intervallo
	 * @param {Date} _max_date Ultima data disponibile per il calcolo dell'intervallo
	 * @see DatePicker#printDateAndTime
	 */
	this.checkDateTimeContraints = function( obj, _start_date, _end_date, _curr_date, _min_date, _max_date ) {
		if( mode == 'start' ) {
			// Se la data di inizio intervallo è maggiore o uguale di quella di fine intervallo
			if( _curr_date >= _end_date ) {
				// Se la data di inizio intervallo è ANCHE maggiore o uguale dell'ultima data disponibile per il calcolo dell'intervallo
				if( _curr_date >= _max_date ) {
					// Sottrae il tempo minimo di intervallo alla data di inizio intervallo
					// Diversamente la data di fine intervallo potrebbe essere maggiore dell'ultima data disponibile per il calcolo dell'intervallo
					obj.date.setTime( max_date.getTime() - min_time );
				}
				// Imposta la data di fine intervallo in modo che sia maggiore del tempo minimo di intervallo rispetto a quella di inizio intervallo
				// min_time / 2 correzione proposta da Trionfera in modo che venga calcolato in via predefinita un giorno di noleggio in meno
				end_date = new Date( obj.date.getTime() );
				end_date.setTime( end_date.getTime() + ( min_time / 2 ) );
				this.printDateAndTime( el_end, end_date );
			}

			// Se l'orario della data di inizio intervallo è minore di quello della prima data disponibile per il calcolo dell'intervallo
			if( obj.date <= min_date ) {
				obj.date.setHours( min_date.getHours(), min_date.getMinutes(), 0, 0 );
			}
		// mode == 'end'
		} else {
			// Se la data di fine intervallo è minore o uguale di quella di inizio intervallo
			if( _curr_date <= _start_date ) {
				// Se la data di fine intervallo è ANCHE minore o uguale della prima data disponibile per il calcolo dell'intervallo
				if( _curr_date <= _min_date ) {
					// Aggiunge il tempo minimo di intervallo alla data di fine intervallo
					// Diversamente la data di inizio intervallo potrebbe essere minore della prima data disponibile per il calcolo dell'intervallo
					obj.date.setTime( min_date.getTime() + min_time );
				}

				// Imposta da data di inizio intervallo in modo che sia minore del tempo minimo di intervallo rispetto a quella di fine intervallo
				start_date = new Date( obj.date.getTime() );
				start_date.setTime( start_date.getTime() - min_time );
				this.printDateAndTime( el_start, start_date );
			}

			// Se l'orario della data di fine intervallo è maggiore di quello dell'ultima data disponibile per il calcolo dell'intervallo
			if( obj.date >= max_date ) {
				obj.date.setHours( max_date.getHours(), max_date.getMinutes(), 0, 0 );
			}
		}

		// let diff_time = end_date.getTime() - start_date.getTime();
		// let diff_days = Math.round( diff_time / ms_per_day );
		// if( diff_days > max_days ) {
		// 	if( mode == 'start' ) {
		// 		start_date = obj.date = new Date( end_date.getTime() - ( ms_per_day * max_days ) );
		// 	} else {
		// 		end_date = obj.date = new Date( start_date.getTime() + ( ms_per_day * max_days ) );
		// 	}
		// }
	}

	/**
	 * Chiude l'elemento contenente la tabella con le date o gli orari di inizio o fine intervallo
	 * La chiusura può essere temporizzata
	 *
	 * @param {HTMLDivElement} btn Il pulsante che ha aperto la tabella con le date o gli orari
	 * @param {HTMLDivElement} picker Il pannello corrente che contiene la tabella con le date o gli orari
	 * @param {int} msec Il numero di millisecondi dopo il quale l'elemento deve essere chiuso
	 * @see DatePicker#selectDay
	 * @see DatePicker#selectHour
	 */
	this.closeDateOrHourTable = function( btn, picker, msec ) {
		let ms = msec || 0;

		setTimeout( function() {
			picker.style.display = 'none';
			btn.classList.remove( 'btn-background' );
			document.body.removeEventListener( evt, self.ifClickOutside );
		}, ms );
	}

	/**
	 * Chiude il pannello se l'utente clicca fuori da questo
	 *
	 * @param {Event} e
	 */
	this.ifClickOutside = function( e ) {
		let div = ( mode == 'start' ) ? start_picker_div : end_picker_div;

		let el = e.target.parentElement;
		let inside = false;

		// Se l'utente seleziona il mese precedente o successivo la nuova tabella risulta fuori dal DOM
		if( e.target.className == 'next-month' || e.target.className == 'prev-month') {
			inside = true;
		} else {
			while( el ) {
				if( div.parentElement == el) {
					inside = true;
					break;
				}

				el = el.parentElement;
			}
		}

		if( !inside )  {
			let coll = div.previousElementSibling.querySelectorAll( 'div' );
			for( let i = 0; i < coll.length; i++ ) {
				coll[ i ].classList.remove( 'btn-background' );
			}

			div.style.display = 'none';

			document.body.removeEventListener( evt, self.ifClickOutside );
		}
	}

	/**
	 * Restituisce le date di inizio e fine intervallo in formato timestamp senza l'informazione dei millisecondi
	 *
	 * @return {oject}
	 */
	this.returnDates = function() {
		let start_date_s = Math.round( start_date.getTime() / 1000 );
		let end_date_s = Math.round( end_date.getTime() / 1000 );

		return { 'out' : start_date_s, 'in' : end_date_s };
	}
}
