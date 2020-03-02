import React from 'react'
import { shallow } from 'enzyme'

import { deleteList } from '../actions/listActions'

import { TodoListView } from './TodoList'

describe('ListsOverview', () => {
	it('snapshot matches', () => {
		const selectedList = {
			id: '12345',
			name: 'test list name',
			todos: [],
		}
		const wrapper = shallow(<TodoListView selectedList={selectedList} />)
		expect(wrapper).toMatchSnapshot()
	})

	it('shows name of selected list', () => {
		const selectedList = {
			name: 'test list name',
			todos: [],
		}
		const wrapper = shallow(<TodoListView selectedList={selectedList} />)
		expect(wrapper.find('header h2')).toHaveText('test list name')
	})

	it('shows # of remaining todos if 0', () => {
		const selectedList = {
			todos: [],
		}
		const wrapper = shallow(<TodoListView selectedList={selectedList} />)
		expect(wrapper.find('header p')).toHaveText('0 tasks remaining')
	})

	it('shows # of remaining todos if 1', () => {
		const selectedList = {
			todos: [{done: true}, {done: true}, {done: false}],
		}
		const wrapper = shallow(<TodoListView selectedList={selectedList} />)
		expect(wrapper.find('header p')).toHaveText('1 task remaining')
	})

	it('dispatches deleteList action', () => {
		const selectedList = {
			id: '12345',
			name: 'test list name',
			todos: [],
		}
		const dispatch = jest.fn()
		const wrapper = shallow(<TodoListView selectedList={selectedList} dispatch={dispatch} />)
		const deleteButton = wrapper.find('footer').childAt(1)
		expect(deleteButton).toHaveText('Delete list')
		deleteButton.simulate('click')
		expect(dispatch).toHaveBeenCalledWith(deleteList('12345', 'test list name'))
	})
})