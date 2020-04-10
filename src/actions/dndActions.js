import ActionType from './type'

export const DragItemType = Object.freeze({
	todoItem: 'TODO_ITEM',
	todoList: 'TODO_LIST',
})

export const reorderTodo = (item, to) => ({
	type: ActionType.reorderTodo,
	item,
	to,
})

export const moveTodoToList = (item, toList) => ({
	type: ActionType.moveTodoToList,
	item,
	toList,
})

export const reorderTodoList = (list, to) => ({
	type: ActionType.reorderTodoList,
	list,
	to,
})

