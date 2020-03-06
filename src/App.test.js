import React from 'react'
import { shallow } from 'enzyme'

import App from './App'

describe('App', () => {
	it('snapshot matches', () => {
		const wrapper = shallow(<App />)
		expect(wrapper).toMatchSnapshot()
	})

	it('renders header', () => {
		const wrapper = shallow(<App />)
		expect(wrapper.find('.App-header')).toHaveText('Stuff I need to do')
	})

	it('renders ListsOverview', () => {
		const wrapper = shallow(<App />)
		expect(wrapper.find('ListsOverview')).toExist()
	})

	it('renders TodoList', () => {
		const wrapper = shallow(<App />)
		expect(wrapper.find('TodoList')).toExist()
	})

	it('renders footer', () => {
		const wrapper = shallow(<App />)
		expect(wrapper.find('footer')).toContainMatchingElement('a[href="https://github.com/kevin-powell/todo-list-collab"]')
	})
})
