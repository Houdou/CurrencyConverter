import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Swiper from 'react-id-swiper';

import '../styles/currency_new.css';

class CurrencyNew extends Component {
	constructor(props) {
		super(props);
		this.Swiper = null;
	}

	componentDidMount() {
		// Prevent nested touchmove propagation
		this.Swiper.on('touchMove', (evt) => {
			evt.stopPropagation();
			return true;
		});
		this.Swiper.update();
	}

	componentDidUpdate() {
		this.Swiper.update();
	}

	render() {
		const params = {
			containerClass: 'CurrencyNew-wrapper',
			slideClass: 'CurrencyNew-option',
			direction: 'vertical',
			slidesPerView: 'auto',
			freeMode: true,
			mousewheel: true,
			nested: true,
		};
		return (
			<Swiper {...params} ref={node => { if (node) this.Swiper = node.swiper; }}>
				{
					this.props.Currencies.map(v => {
						return (
							<div
								role="button"
								tabIndex="-1"
								className="CurrencyNew-option"
								onClick={() => { this.props.handleNewCurrency(v.abbr); }}
								key={`cn-${v.abbr}`}
							>
								<span className="CurrencyNew-full">{v.full}</span>
								<span className="CurrencyNew-abbr">{v.abbr}</span>
							</div>
						);
					})
				}
			</Swiper>
		);
	}
}
CurrencyNew.propTypes = {
	Currencies: PropTypes.arrayOf(PropTypes.object).isRequired,
	handleNewCurrency: PropTypes.func.isRequired,
};

export default CurrencyNew;
