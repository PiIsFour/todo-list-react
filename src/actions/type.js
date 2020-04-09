const actionType = Object.freeze({
	addList: 'ADD_LIST',
	selectList: 'SELECT_LIST',
	deleteList: 'DELETE_LIST',

	addTodo: 'ADD_TODO',
	checkTodo: 'CHECK_TODO',
	clearCompletedTodos: 'CLEAR_COMPLETED_TODOS',

	reorderTodo: 'REORDER_TODO',
	moveTodoToList: 'MOVE_TODO_TO_LIST',
})

export default actionType
