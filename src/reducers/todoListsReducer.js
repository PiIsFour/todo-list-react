import * as R from 'ramda'
import actionType from '../actions/type'
import { keepRefIfNoChange, adjustObjectProp, adjustOnCondition } from './util'

const initialState = []

const addList = (id, name) => R.append({
	id,
	name,
	todos: [],
})

const deleteList = id => R.filter(todo => todo.id !== id)

const addTodoInTodos = (id, name) => R.append({id, name, done: false})

const addTodoInList = (id, name) =>
	adjustObjectProp('todos', addTodoInTodos(id, name))

const addTodo = (listId, id, name) => adjustOnCondition(
	({id}) => id === listId,
	addTodoInList(id, name),
)

const checkTodoWithId = (id, done) => adjustOnCondition(
	todo => todo.id === id,
	R.assoc('done', done),
)

const checkTodoInList = (id, done) =>
	adjustObjectProp('todos', checkTodoWithId(id, done))

const checkTodo = (id, done) => keepRefIfNoChange(R.map(
	checkTodoInList(id, done),
))

const clearCompletedTodosInTodos = R.filter(({done}) => !done)

const clearCompletedTodosInList =
	adjustObjectProp('todos', clearCompletedTodosInTodos)

const clearCompletedTodos = fromListId => adjustOnCondition(
	({id}) => id === fromListId,
	clearCompletedTodosInList,
)

const todoListsReducer = (rootState = {}, action = {}) => {
	const { todoLists: state = initialState } = rootState
	const { type, id, name, toList, done, fromList } = action
	switch(type){
	case actionType.addList:
		return addList(id, name)(state)
	case actionType.deleteList:
		return deleteList(id)(state)
	case actionType.addTodo:
		return addTodo(toList.id, id, name)(state)
	case actionType.checkTodo:
		return checkTodo(id, done)(state)
	case actionType.clearCompletedTodos:
		return clearCompletedTodos(fromList.id)(state)
	default:
		return state
	}
}

export default todoListsReducer
