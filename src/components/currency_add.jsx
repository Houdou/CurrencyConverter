import React from 'react';
import PropTypes from 'prop-types';

import '../styles/currency_add.css';

const CurrencyAdd = (props) => {
	return (
		<div
			role="button"
			tabIndex="-1"
			className="CurrencyAdd"
			onClick={props.handleAddCurrency}
		>
			<span className="CurrencyAdd-button">+</span>
		</div>
	);
};
CurrencyAdd.propTypes = {
	handleAddCurrency: PropTypes.func.isRequired,
};

export default CurrencyAdd;
