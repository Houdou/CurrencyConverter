import React from 'react';
import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';
import DatePicker from 'react-datepicker';

import '../styles/react-datepicker.css';
import '../styles/header.css';
import '../styles/nav_buttons.css';

import calendarSvg from '../icons/calendar.svg';
import refreshSvg from '../icons/refresh.svg';

const Calendar = (props) => {
	return (
		<button className="DatePicker" onClick={props.onClick}><img src={calendarSvg} alt="history" /></button>
	);
};
Calendar.propTypes = {
	onClick: PropTypes.func.isRequired,
};

const Update = (props) => {
	return (
		<button className="Update" onClick={props.handleUpdate}><img src={refreshSvg} alt="update" /></button>
	);
};
Update.propTypes = {
	handleUpdate: PropTypes.func.isRequired,
};

const Header = (props) => {
	return (
		<div className="Header">
			<div className="nav-button left-nav-button">
				<DatePicker
					customInput={<Calendar />}
					selected={props.Date}
					onChange={props.handleDatePicker}
				/>
			</div>
			<span className="title">{props.Title}</span>
			<div className="nav-button right-nav-button">
				<Update handleUpdate={props.handleUpdate} />
			</div>
		</div>
	);
};
Header.propTypes = {
	Date: momentPropTypes.momentObj.isRequired,
	Title: PropTypes.string.isRequired,
	handleDatePicker: PropTypes.func.isRequired,
	handleUpdate: PropTypes.func.isRequired,
};

export default Header;
