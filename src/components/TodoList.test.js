import React from 'react'
import { shallow } from 'enzyme'

import { deleteList } from '../actions/listActions'
import { addTodoWithId, checkTodo, clearCompletedTodos } from '../actions/todoActions'

import { TodoListView, getSelectedList } from './TodoList'

describe('ListsOverview', () => {
	it('snapshot matches', () => {
		const selectedList = {
			id: '12345',
			name: 'test list name',
			todos: [{
				id: '42',
				name: 'hello world',
				done: false,
			}],
		}
		const wrapper = shallow(<TodoListView selectedList={selectedList} />)
		expect(wrapper).toMatchSnapshot()
	})

	it('shows nothing if no selected List', () => {
		const selectedList = undefined
		const wrapper = shallow(<TodoListView selectedList={selectedList} />)
		expect(wrapper).toBeEmptyRender()
	})

	it('shows name of selected list', () => {
		const selectedList = {
			id: '42',
			name: 'test list name',
			todos: [],
		}
		const wrapper = shallow(<TodoListView selectedList={selectedList} />)
		expect(wrapper.find('header h2')).toHaveText('test list name')
	})

	it('shows # of remaining todos if 0', () => {
		const selectedList = {
			id: 'some id',
			name: 'some name',
			todos: [],
		}
		const wrapper = shallow(<TodoListView selectedList={selectedList} />)
		expect(wrapper.find('header p')).toHaveText('0 tasks remaining')
	})

	it('shows # of remaining todos if 1', () => {
		const selectedList = {
			id: 'some id',
			name: 'some name',
			todos: [
				{done: true, id: '1', name: 'test'},
				{done: true, id: '2', name: 'test'},
				{done: false, id: '3', name: 'test'},
			],
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

	it('dispatches a addTodo action', () => {
		const selectedList = {
			id: '12345',
			name: 'test list',
			todos: [],
		}
		const dispatch = jest.fn()
		const wrapper = shallow(<TodoListView selectedList={selectedList} dispatch={dispatch} />)
		wrapper.find('AddInput').simulate('add', 'new todo name')
		expect(dispatch).toHaveBeenCalledWith(
			addTodoWithId('new todo name', {id: '12345', name: 'test list'}, expect.toBeAUuid()),
		)
	})

	it('shows the todos in list', () => {
		const selectedList = {
			id: '12345',
			name: 'test list',
			todos: [{
				id: '42',
				name: 'hello world',
				done: false,
			}],
		}
		const wrapper = shallow(<TodoListView selectedList={selectedList} />)
		const firstTask = wrapper.find('.todos').childAt(0)
		expect(firstTask).toHaveClassName('todo')
		expect(firstTask.find('label')).toHaveText('hello world')
	})

	it('dispatches a checkTodo action', () => {
		const selectedList = {
			id: '12345',
			name: 'test list',
			todos: [{
				id: '42',
				name: 'hello world',
				done: false,
			}],
		}
		const dispatch = jest.fn()
		const wrapper = shallow(<TodoListView selectedList={selectedList} dispatch={dispatch} />)
		const firstTask = wrapper.find('.todos').childAt(0)
		firstTask.find('input').simulate('change', {target: {checked: true}})
		expect(dispatch).toHaveBeenCalledWith(checkTodo('42', 'hello world', true))
	})

	it('dispatches a clearCompletedTodos action', () => {
		const selectedList = {
			id: '12345',
			name: 'test list',
			todos: [{
				id: '42',
				name: 'hello world',
				done: false,
			}],
		}
		const dispatch = jest.fn()
		const wrapper = shallow(<TodoListView selectedList={selectedList} dispatch={dispatch} />)
		const clearButton = wrapper.find('footer').childAt(0)
		clearButton.simulate('click')
		expect(dispatch).toHaveBeenCalledWith(clearCompletedTodos({id: '12345', name: 'test list'}))
	})

	it('getSelectedList returns the selected list', () => {
		const state = {
			todoLists: [
				{id: '12'},
				{id: '42'},
				{id: '152'},
			],
			selectedList: {id: '42'},
		}
		expect(getSelectedList(state)).toBe(state.todoLists[1])
	})
})
