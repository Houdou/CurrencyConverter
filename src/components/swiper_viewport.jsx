import React, { Component } from 'react';
import Swiper from 'react-id-swiper';

class SwiperViewport extends Component {
	constructor(props) {
		super(props);
		this.Swiper = null;
	}

	componentDidMount() {
		this.Swiper.update();
	}

	componentDidUpdate() {
		this.Swiper.update();
	}

	render() {
		const params = {
			containerClass: 'SwiperViewport-container',
			wrapperClass: 'SwiperViewport-wrapper',
			slideClass: 'SwiperViewport-row',
			direction: 'vertical',
			freeMode: true,
			slidesPerView: 'auto'
		};
		return (
			<Swiper {...params}
				ref={node => { if (node) this.Swiper = node.swiper; }}>
				{this.props.children}
			</Swiper>
		);
	}
};

export default SwiperViewport;
