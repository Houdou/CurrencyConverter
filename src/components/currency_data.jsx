import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Hammer from 'react-hammerjs';

import '../styles/currency.css';
import deleteSvg from '../icons/delete.svg';

class CurrencyView extends Component {
	constructor(props) {
		super(props);
		this.prepareChange = this.prepareChange.bind(this);
		this.prepareDelete = this.prepareDelete.bind(this);
	}

	prepareChange(evt) {
		this.updateBaseValue(Number(evt.target.value) / this.props.Currency.Rate);
	}

	prepareDelete() {
		this.props.handleDeleteCurrency(this.props.Currency.Name);
	}

	updateBaseValue(v) {
		this.props.handleValueUpdate(v);
	}

	render() {
		return (
			<Hammer
				onDoubleTap={(e) => {
					e.preventDefault();
					this.updateBaseValue(100 / this.props.Currency.Rate);
				}}
			>
				<div className="Currency">
					<button className="Currency-remove" onClick={this.prepareDelete}>
						<img src={deleteSvg} alt="delete" />
					</button>
					<div className="Currency-value">
						<div className="Currency-main-value">
							<input
								className="Currency-input"
								type="number"
								value={
									Math.round(this.props.BaseValue * this.props.Currency.Rate * 100) / 100
								}
								onChange={this.prepareChange}
							/>
							<div className="Currency-name">
								{this.props.Currency.Name}
							</div>
						</div>
						<span className="Currency-rate">
							{`1${this.props.Currency.Name} = ${Math.round(1 / this.props.Currency.Rate * 10000) / 10000}${this.props.BaseName}`}
						</span>
					</div>
				</div>
			</Hammer>
		);
	}
}
CurrencyView.propTypes = {
	BaseName: PropTypes.string.isRequired,
	BaseValue: PropTypes.number.isRequired,
	Currency: PropTypes.object.isRequired,
	handleValueUpdate: PropTypes.func.isRequired,
	handleDeleteCurrency: PropTypes.func.isRequired,
};

export default CurrencyView;
