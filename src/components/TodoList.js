import React from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import './TodoList.css'

import AddInput from './AddInput'
import { deleteList } from '../actions/listActions'
import { addTodo, clearCompletedTodos } from '../actions/todoActions'
import TodoItem from './TodoItem'

export const TodoListView = ({selectedList, dispatch}) => {
	if(!selectedList) return null
	const { id, name, todos } = selectedList
	const remainingTodos = todos.filter(({done}) => !done).length
	const dispatchDeleteList = () => dispatch(deleteList(id, name))
	const dispatchAddTodo = (name) => dispatch(addTodo(name, selectedList))
	const dispatchClearCompletedTodos = () => dispatch(clearCompletedTodos(selectedList))
	return <section className="todo-list">
		<header>
			<h2>{name}</h2>
			<p>{`${remainingTodos} ${remainingTodos===1 ? 'task' : 'tasks'} remaining`}</p>
		</header>
		<main>
			<div className="todos">
				{todos.map(({id, name, done}) =>
					<TodoItem id={id} key={id} name={name} done={done} />)}
			</div>
			<AddInput lable="new task name" onAdd={dispatchAddTodo} />
		</main>
		<footer>
			<button onClick={dispatchClearCompletedTodos}>Clear completed tasks</button>
			<button onClick={dispatchDeleteList}>Delete list</button>
		</footer>
	</section>
}

TodoListView.propTypes = {
	selectedList: PropTypes.shape({
		id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		todos: PropTypes.arrayOf(PropTypes.shape({
			id: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
			done: PropTypes.bool.isRequired,
		})).isRequired,
	}),
	dispatch: PropTypes.func,
}

export const getSelectedList = ({todoLists, selectedList}) => todoLists.find(({id}) => id === selectedList.id)

const TodoList = () => {
	const selectedList = useSelector(getSelectedList)
	const dispatch = useDispatch()
	return <TodoListView selectedList={selectedList} dispatch={dispatch} />
}

export default TodoList
