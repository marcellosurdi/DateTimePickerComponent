'use strict';

DatePicker = function() {
	/**
	 * Inizializza i principali gestori di eventi
	 *
	 * @see DatePicker#onOpenPicker
	 * @see DatePicker#onSelectDayOrHour
	 */
	this.bindEvents = function() {
		start_date_btn.addEventListener( 'click', this.onOpenPicker );
		end_date_btn.addEventListener( 'click', this.onOpenPicker );
		start_time_btn.addEventListener( 'click', this.onOpenPicker );
		end_time_btn.addEventListener( 'click', this.onOpenPicker );
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
}
