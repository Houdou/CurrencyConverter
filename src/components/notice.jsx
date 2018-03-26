import React, {Component} from 'react';
import PropTypes from 'prop-types';

import '../styles/notice.css';

class Notice extends Component {
	constructor(props) {
		super(props);
		this.clear = this.clear.bind(this);
		this.state = {
			Show: false,
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.Popup) {
			this.setState((_state, _props) => {
				setTimeout(() => {
					this.clear();
				}, nextProps.PopupTime);
				return {
					Show: true,
				};
			});
		}
		return true;
	}

	clear() {
		this.setState((_state, props) => {
			setTimeout(() => {
				props.handleNoticeClear(props.IsError);
			}, 1000);
			return {
				Show: false,
			};
		});
	}

	render() {
		return (
			<div
				role="presentation"
				className={(this.state.Show ? '' : ' Notice-hidden') + (this.props.IsError ? ' Error' : '') + ' Notice'}
				onClick={this.clear}
			>
				<span>{this.props.Message}</span>
			</div>
		);
	}
}
Notice.propTypes = {
	Popup: PropTypes.bool.isRequired,
	PopupTime: PropTypes.number.isRequired,
	IsError: PropTypes.bool.isRequired,
	Message: PropTypes.string.isRequired,
};

export default Notice;
