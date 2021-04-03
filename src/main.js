import './style.css';

'use strict';

const i18n = {
  'start_label':'Data e ora partenza',
  /* Datepicker */
  'gen':'gen',
  'feb':'feb',
  'Mar':'mar',
  'apr':'apr',
  'mag':'mag',
  'giu':'giu',
  'lug':'lug',
  'ago':'ago',
  'set':'set',
  'ott':'ott',
  'nov':'nov',
  'dic':'dic',
  'gennaio':'Gennaio',
  'febbraio':'Febbraio',
  'marzo':'Marzo',
  'aprile':'Aprile',
  'maggio':'Maggio',
  'giugno':'Giugno',
  'luglio':'Luglio',
  'agosto':'Agosto',
  'settembre':'Settembre',
  'ottobre':'Ottobre',
  'novembre':'Novembre',
  'dicembre':'Dicembre',
  'lun':'lun',
  'mar':'mar',
  'mer':'mer',
  'gio':'gio',
  'ven':'ven',
  'sab':'sab',
  'dom':'dom',
  'lunedi':'Lunedì',
  'martedi':'Martedì',
  'mercoledi':'Mercoledì',
  'giovedi':'Giovedì',
  'venerdi':'Venerdì',
  'sabato':'Sabato',
  'domenica':'Domenica',
};

const DateTimeIntervalPickerMixin = {
  ms_per_day: 24 * 60 * 60 * 1000,
  days_label: [ 'lun', 'mar', 'mer', 'gio', 'ven', 'sab', 'dom' ],
  months_fullname: [ 'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre' ],
  months_label: [ 'gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic' ],

  /**
   * It initializes the default values
   *
   * @param {string} id_div id of the <div> element that will contain the button
   * @param {Date} [start_date_param] Start selected date
   * @param {Date} [min_start_date_param] First selectable date
   * @param {Date} [max_end_date_param] Last selectable date
   * @return {object} Object with calculated default values
   */
  checkPickerDefaults( id_div, start_date_param, min_start_date_param, max_end_date_param ) {
    const el = document.getElementById( id_div );
    if( el == null ) {
      return false;
    }

    // Calcolo della data di inizio (start_date)
    // Data predefinita di inizio un giorno in più rispetto alla data e ora correnti
    const start_date_default = new Date( Date.now() + this.ms_per_day );
    let start_date = this.calcDateDefault( start_date_default, start_date_param, el, 'start_date' );

    // Calcolo della prima data selezionabile (min_start_date)
    // Prima data disponibile predefinita data e ora correnti
    const min_start_date_default = new Date;
    let min_start_date = this.calcDateDefault( min_start_date_default, min_start_date_param, el, 'min_start_date' );
    // La data di inizio deve essere maggiore o uguale della prima data disponibile
    if( start_date.getTime() < min_start_date.getTime() ) {
      min_start_date = start_date;
    }

    // Calcolo dell'ultima data selezionabile (max_end_date)
    // Ultima data disponibile predefinita un anno in più rispetto alla data di inizio
    const max_end_date_default = new Date( start_date.getTime() + ( this.ms_per_day * 365 ) );
    let max_end_date = this.calcDateDefault( max_end_date_default, max_end_date_param, el, 'max_end_date' );
    // L'ultima data disponibile deve essere maggiore rispetto alla data di inizio
    if( max_end_date.getTime() < start_date.getTime()  ) {
      max_end_date = max_end_date_default;
    }

    start_date = this.roundMinutes( start_date );
    min_start_date = this.roundMinutes( min_start_date );
    max_end_date = this.roundMinutes( max_end_date );

    // console.log( min_start_date );
    // console.log( start_date );
    // console.log( max_end_date );

    return { el, start_date, min_start_date, max_end_date };
  },

  /**
   * Calcola il valore predefinito di una data tenendo conto delle indicazioni così stabilite:
   * - la data calcolata sulla base del timestamp contenuto in un campo di testo nascosto ha priorità sulle altre;
   * - segue l'eventuale data suggerita passata come parametro al metodo checkPickerDefaults;
   * - ultima la data predefinita calcolata dal metodo checkPickerDefaults
   *
   * @param {Date} date_default La data predefinita calcolata dal metodo checkPickerDefaults
   * @param {Date} date_param La data passata suggerita come parametro al metodo checkPickerDefaults
   * @param {HTMLDivElement} el Elemento <div> in cui cercare l'eventuale campo di testo nascosto cui fa riferimento il parametro successivo
   * @param {string} date_class Classe del campo di testo nascosto che potrebbe contenere il timestamp di una data impostata precedentemente al caricamento di pagina
   * @return {Date} La data predefinita calcolata
   */
  calcDateDefault( date_default, date_param, el, date_class ) {
    // Se è stata fornita una data suggerita valida come parametro nel metodo checkPickerDefaults sovrascrive quella predefinita
    const date = ( date_param instanceof Date ) ? date_param : date_default;
    // Se è stata fornita una data valida come campo di testo nascosto sovrascrive quella corrente
    let prev_date = +el.querySelector( 'input.' + date_class )?.value;
    if( prev_date > 0 ) {
      prev_date = new Date( prev_date * 1000 );
    }
    return prev_date || date;
  },

  /**
   * Arrotonda i minuti ad intervalli di 30
   *
   * @param {Date} date La data da arrotondare
   * @return {Date} La data arrotondata
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
      // Se arrotonda i minuti a 0 considera un'ora in più
      h = h + 1;
      // Se in seguito all'arrotondamento si raggiunge la mezzanotte considera un giorno in più
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
    const week_day_number = this.getWeekDay( date );

    week_day_span.textContent = i18n[ this.days_label[ week_day_number ] ];
    month_day_input.value = ( '0' + date.getDate() ).slice( -2 );
    month_year_span.innerHTML = `<em data-i18n="${this.months_label[ date.getMonth() ]}">${i18n[ this.months_label[ date.getMonth() ] ]}</em><br>${date.getFullYear()}`;
  },

  /**
   * Restituisce il giorno della settimana come numero (0 - Lunedì, 6 - Domenica)
   *
   * @param {Date} date Oggetto data da cui ricavare il giorno della settimana
   * @return {number} Il giorno della settimana espresso in numero
   */
  getWeekDay( date ) {
    const week_day = date.getUTCDay();
    return ( week_day > 0 ) ? ( week_day - 1 ) : 6;
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

		let week_day = this.getWeekDay( new Date( year, month, 1 ) );

		this.prev_month = new Date( year, ( month - 1 ), 1, date.getHours(), date.getMinutes() );
		let prev_month_total_days = total_days[ this.prev_month.getMonth() ];

		let j = week_day;

		let i = 0
		while( j > 0 ) {
			i = ( prev_month_total_days - ( j - 1 ) );
			class_name = this.getDayClassName( i, this.prev_month );
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

		this.next_month = new Date( year, ( month + 1 ), 1, date.getHours(), date.getMinutes() );
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
					"<td class='day-label' data-i18n='" + this.days_label[0] + "'>" + i18n[ this.days_label[0] ] + "</td>" +
					"<td class='day-label' data-i18n='" + this.days_label[1] + "'>" + i18n[ this.days_label[1] ] + "</td>" +
					"<td class='day-label' data-i18n='" + this.days_label[2] + "'>" + i18n[ this.days_label[2] ] + "</td>" +
					"<td class='day-label' data-i18n='" + this.days_label[3] + "'>" + i18n[ this.days_label[3] ] + "</td>" +
					"<td class='day-label' data-i18n='" + this.days_label[4] + "'>" + i18n[ this.days_label[4] ] + "</td>" +
					"<td class='day-label' data-i18n='" + this.days_label[5] + "'>" + i18n[ this.days_label[5] ] + "</td>" +
					"<td class='day-label' data-i18n='" + this.days_label[6] + "'>" + i18n[ this.days_label[6] ] + "</td>" +
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
		let min_date_ms = new Date( this.min_start_date.getFullYear(), this.min_start_date.getMonth(), this.min_start_date.getDate() ).getTime();
		let max_date_ms = new Date( this.max_end_date.getFullYear(), this.max_end_date.getMonth(), this.max_end_date.getDate() ).getTime();

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





function DatePicker( id_div, start_date, min_start_date, max_end_date ) {
  const self = this;
  const picker_defaults = self.checkPickerDefaults( id_div, start_date, min_start_date, max_end_date );
  ( { el: self.el_start, start_date: self.start_date, min_start_date: self.min_start_date, max_end_date: self.max_end_date } = picker_defaults );

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

  // console.log( el_start );
  // console.log( 'start_date' );
  // console.log( start_date.toUTCString() );
  // console.log( 'min_start_date' );
  // console.log( min_start_date.toUTCString() );
  // console.log( 'max_end_date' );
  // console.log( max_end_date.toUTCString() );

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
new DatePicker( 'select_date'/*, new Date( 2021, 0, 4, 23, 0, 22 ), new Date( 2021, 0, 2, 23, 0, 22 ), new Date( 2020, 0, 15, 23, 0, 22 )*/ );
// console.log( new Date( 2023, 1, 5, 23, 0, 22 ).getTime() / 1000 );
