import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import ReactDOM from 'react-dom';
import Form from './form';

test('Check to see that form can respond to enter key', () => {
	const form = shallow(
		<Form />
		);
	expect()
});
