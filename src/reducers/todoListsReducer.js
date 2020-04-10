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

const reorderTodo = (from, to) => adjustOnCondition(
	list => R.any(todo => todo.id === from.id, list.todos),
	adjustObjectProp('todos', todos => {
		const toIndex = R.findIndex(todo => todo.id === to.id, todos)
		const movingItem = R.find(todo => todo.id === from.id, todos)
		return R.pipe(
			R.always(todos),
			R.without([movingItem]),
			R.insert(toIndex, movingItem),
		)()
	}),
)

const findTodoById = id => R.pipe(
	R.map(R.pipe(
		R.prop('todos'),
		R.find(todo => todo.id === id),
	)),
	R.find(todo => !!todo),
)

const removeTodoFromList = todo => adjustObjectProp('todos',
	R.filter(({id}) => id !== todo.id),
)

const addExistingTodoToList = (todo, toListId) => adjustOnCondition(
	list => list.id === toListId,
	adjustObjectProp('todos',
		R.append(todo),
	),
)

const moveTodoToList = (item, toList) => (state) => {
	const todo = findTodoById(item.id)(state)
	if(!todo){
		return state
	}
	return R.pipe(
		R.always(state),
		R.map(removeTodoFromList(todo)),
		addExistingTodoToList(todo, toList.id),
	)()
}

const reorderTodoList = (from, to) => todoLists => {
	const toIndex = R.findIndex(list => list.id === to.id, todoLists)
	const movingList = R.find(list => list.id === from.id, todoLists)
	return R.pipe(
		R.always(todoLists),
		R.without([movingList]),
		R.insert(toIndex, movingList),
	)()
}

const todoListsReducer = (rootState = {}, action = {}) => {
	const { todoLists: state = initialState } = rootState
	const { type, id, name, toList, done, fromList, item, to, list } = action
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
	case actionType.reorderTodo:
		return reorderTodo(item, to)(state)
	case actionType.moveTodoToList:
		return moveTodoToList(item, toList)(state)
	case actionType.reorderTodoList:
		return reorderTodoList(list, to)(state)
	default:
		return state
	}
}

export default todoListsReducer
