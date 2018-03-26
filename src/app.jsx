import React, {Component} from 'react';
import * as moment from 'moment';

import Header from './components/header';
import Notice from './components/notice';
import SwiperViewport from './components/swiper_viewport';
import CurrencyView from './components/currency_data';
import CurrencyNew from './components/currency_new';
import CurrencyAdd from './components/currency_add';

import './styles/app.css';

class CurrencyData {
	constructor(Name, Rate, Base = 'USD') {
		this.Name = Name;
		this.Rate = Rate;
		this.Base = Base;
	}
}

const DEFAULT_INIT_CURRENCIES = ['USD', 'HKD', 'JPY', 'CNY'];

class CurrencyConverterApp extends Component {
	constructor(props) {
		super(props);
		this.handleAddCurrency = this.handleAddCurrency.bind(this);
		this.handleDeleteCurrency = this.handleDeleteCurrency.bind(this);
		this.handleNewCurrency = this.handleNewCurrency.bind(this);
		this.handleRequestRates = this.handleRequestRates.bind(this);
		this.handleDatePicker = this.handleDatePicker.bind(this);
		this.handleNoticeClear = this.handleNoticeClear.bind(this);
		this.handleBaseUpdate = this.handleBaseUpdate.bind(this);
		this.state = {
			Title: '💸',
			Rates: [],
			AllRates: {},
			BaseValue: 100,
			BaseName: 'USD',
			Currencies: [],
			Date: moment(),
			PendingNewCurrency: false,
			Error: false,
			Notice: false,
			Message: '',
		};
		this.STORAGE_KEY = 'CC_CURRENCIES';
	}

	componentDidMount() {
		Promise.all([this.getCurrencies(), this.getRates()])
			.then(() => {
				this.loadLocalCache();
			})
			.catch(err => {
				this.popupNoticeOrError(err.message, true);
			});
	}

	getHistory(date) {
		return this.getRates(`history/${date}.json`);
	}

	getRates(url = 'latest.json') {
		const success = fetch(`./api/${url}`)
			.then((res) => res.json())
			.then((result) => this.updateRates(result))
			.catch((err) => {
				this.popupNoticeOrError(err.message, true);
			});
		const timeout = new Promise((resolve, reject) => {
			setTimeout(() => {
				reject('Connection timeout.');
			}, 10000);
		});
		return Promise.race([success, timeout]);
	}

	getCurrencies() {
		const success = fetch('./api/currencies.json')
			.then((res) => res.json())
			.then((result) => {
				const newCurrencies = [{
					abbr: 'ESC', full: 'Cancel',
				}];
				Object.keys(result).forEach(k => {
					newCurrencies.push({abbr: k, full: result[k]});
				});
				this.setState((_state, _props) => {
					return {
						Currencies: newCurrencies,
					};
				});
			})
			.catch((err) => {
				this.popupNoticeOrError(err.message, true);
			});
		const timeout = new Promise((resolve, reject) => {
			setTimeout(() => {
				reject('Connection timeout.');
			}, 10000);
		});
		return Promise.race([success, timeout]);
	}

	updateRates(result) {
		this.setState((state, _props) => {
			const newRates = state.Rates.map(v => {
				return new CurrencyData(v.Name, result.rates[v.Name]);
			});
			return {
				Rates: newRates,
				AllRates: result.rates,
			};
		});
		this.popupNoticeOrError('Rates updated.');
	}

	popupNoticeOrError(message, isError = false, time = 3000) {
		if (this.state.Error || this.state.Notice) {
			this.handleNoticeClear();
		}
		this.setState((_state, _props) => {
			return {
				Error: isError,
				Notice: !isError,
				Message: message,
				MessageTime: time,
			};
		});
	}

	// Local currencies storage
	saveLocalCache(rates) {
		const savedRates = [];
		for (const c of rates) {
			savedRates.push(c.Name);
		}
		localStorage.setItem(this.STORAGE_KEY, JSON.stringify(savedRates));
	}

	loadLocalCache() {
		const savedCurrencies = localStorage.getItem(this.STORAGE_KEY);
		let currencies = [];
		if (savedCurrencies) {
			try {
				currencies = JSON.parse(savedCurrencies);
			} catch (err) {
				currencies = DEFAULT_INIT_CURRENCIES;
			}
		} else {
			currencies = DEFAULT_INIT_CURRENCIES;
		}

		this.setState((_state, _props) => {
			return {
				Rates: currencies.map((c) => new CurrencyData(c, this.state.AllRates[c])),
			};
		});
	}

	// Event handlers:

	// Currency
	handleAddCurrency() {
		this.setState((_state, _props) => {
			return {
				PendingNewCurrency: true,
			};
		});
	}

	handleNewCurrency(toAdd) {
		if (toAdd === 'ESC') {
			this.setState((_state, _props) => ({PendingNewCurrency: false}));
			return;
		}
		this.setState((state, _props) => {
			const newRate = new CurrencyData(toAdd, state.AllRates[toAdd]);
			const newRates = state.Rates.filter((c) => c.Name !== toAdd).concat(newRate);
			this.saveLocalCache(newRates);
			return {
				PendingNewCurrency: false,
				Rates: newRates,
			};
		});
	}

	handleDeleteCurrency(toDelete) {
		this.setState((state, _props) => {
			const newRates = state.Rates.filter((c) => c.Name !== toDelete);
			this.saveLocalCache(newRates);
			return {
				Rates: newRates,
			};
		});
	}

	// Date picker
	handleDatePicker(newDate) {
		this.getHistory(newDate.format('YYYY-MM-DD'))
			.then(null, err => {
				this.popupNoticeOrError(err, true);
			});
		this.setState((_state, _props) => {
			return {
				Date: newDate,
			};
		});
	}

	// Noticement
	handleNoticeClear() {
		this.setState((_state, _props) => {
			return {
				Error: false,
				Notice: false,
				Message: '',
			};
		});
	}

	// Update rates
	handleRequestRates() {
		this.getRates()
			.then(null, err => {
				this.popupNoticeOrError(err, true);
			});;
	}

	handleBaseUpdate(newBase) {
		this.setState((_state, _props) => ({
			BaseValue: newBase,
		}));
	}

	render() {
		return (
			<div className="App">
				<div className="wrapper">
					<Header
						Title={this.state.Title}
						Date={this.state.Date}
						handleDatePicker={this.handleDatePicker}
						handleDatePickerFocus={this.handleDatePickerFocus}
						handleUpdate={this.handleRequestRates}
					/>
					<Notice
						Popup={this.state.Error || this.state.Notice}
						PopupTime={this.state.MessageTime}
						handleNoticeClear={this.handleNoticeClear}
						IsError={this.state.Error}
						Message={this.state.Message}
					/>
					<SwiperViewport>
						{
							this.state.Rates.map((r, i) => {
								return (
									<div className="SwiperViewport-row">
										<CurrencyView
											BaseValue={this.state.BaseValue}
											BaseName={this.state.BaseName}
											Currency={r}
											key={`slide-${i}`}
											handleDeleteCurrency={this.handleDeleteCurrency}
											handleValueUpdate={this.handleBaseUpdate}
										/>
									</div>
								);
							})
						}
						{
							this.state.PendingNewCurrency && (
								<div className="SwiperViewport-row">
									<CurrencyNew
										Currencies={this.state.Currencies}
										handleNewCurrency={this.handleNewCurrency}
										key="cn"
									/>
								</div>
							)
						}
						<div className="SwiperViewport-row">
							<CurrencyAdd
								handleAddCurrency={this.handleAddCurrency}
								key="ca"
							/>
						</div>
					</SwiperViewport>
				</div>
			</div>
		);
	}
}

export default CurrencyConverterApp;
