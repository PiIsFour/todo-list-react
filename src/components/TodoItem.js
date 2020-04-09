import React, { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { useDispatch } from 'react-redux'
import './TodoItem.css'

import { DragItemType } from '../actions/dndActions'
import { checkTodo } from '../actions/todoActions'
import { reorderTodo } from '../actions/dndActions'

const TodoItemView = ({id, name, done, dragRef, isDragging, dispatchCheckTodo}) => {
	return <div className="todo" ref={dragRef}
		style={{
			opacity: isDragging ? 0 : 1,
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

const TodoItem = ({id, name, done}) => {
	const dragRef = useRef()
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
	const dispatch = useDispatch()
	const dispatchCheckTodo = (id, name, done) => dispatch(checkTodo(id, name, done))
	const dispatchReorderTodo = (item, to) => dispatch(reorderTodo(item, to))
	drag(drop(dragRef)) //STUDY: combining refs? not sure how this works
	return <TodoItemView id={id} name={name} done={done}
		dragRef={dragRef} isDragging={isDragging}
		dispatchCheckTodo={dispatchCheckTodo}
	/>
}

export default TodoItem
