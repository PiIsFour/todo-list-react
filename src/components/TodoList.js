import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { useDrag, useDrop } from 'react-dnd'
import './TodoList.css'

import AddInput from './AddInput'
import { deleteList } from '../actions/listActions'
import { addTodo, checkTodo, clearCompletedTodos } from '../actions/todoActions'
import { DragItemType, reorderTodo } from '../actions/dndActions'

const TodoItem = ({id, name, done, dispatchCheckTodo, dispatchReorderTodo}) => {
	const ref = useRef()
	const [{isDragging}, drag] = useDrag({
		item: {
			type: DragItemType.todoItem,
			id,
			name,
		},
		collect: monitor => ({
			isDragging: !!monitor.isDragging(),
		}),
	})
	const [, drop] = useDrop({
		accept: DragItemType.todoItem,
		hover: (item) => isDragging ? null : dispatchReorderTodo(item, {id, name}),
	})
	drag(drop(ref))
	return <div className="todo" ref={ref}
		style={{
			opacity: isDragging ? 0.3 : 1,
		}}
	>
		<input
			type="checkbox"
			id={id}
			checked={done}
			onChange={e => dispatchCheckTodo(id, name, e.target.checked)}
		/>
		<label htmlFor={id}>
			<span className="custom-checkbox"></span>
			{name}
		</label>
	</div>
}

const renderTodo = ({dispatchCheckTodo, dispatchReorderTodo}) => ({id, name, done}) =>
	<TodoItem id={id} key={id} name={name} done={done}
		dispatchCheckTodo={dispatchCheckTodo}
		dispatchReorderTodo={dispatchReorderTodo}
	/>

export const TodoListView = ({selectedList, dispatch}) => {
	if(!selectedList) return null
	const { id, name, todos } = selectedList
	const remainingTodos = todos.filter(({done}) => !done).length
	const dispatchDeleteList = () => dispatch(deleteList(id, name))
	const dispatchAddTodo = (name) => dispatch(addTodo(name, selectedList))
	const dispatchCheckTodo = (id, name, done) => dispatch(checkTodo(id, name, done))
	const dispatchClearCompletedTodos = () => dispatch(clearCompletedTodos(selectedList))
	const dispatchReorderTodo = (item, to) => dispatch(reorderTodo(item, to))
	return <section className="todo-list">
		<header>
			<h2>{name}</h2>
			<p>{`${remainingTodos} ${remainingTodos===1 ? 'task' : 'tasks'} remaining`}</p>
		</header>
		<main>
			<div className="todos">
				{todos.map(renderTodo({dispatchCheckTodo, dispatchReorderTodo}))}
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
