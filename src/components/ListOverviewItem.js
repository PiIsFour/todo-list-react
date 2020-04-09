import React from 'react'

const ListOverviewItem = ({id, name, isSelected, onSelect}) => {
	return <li
		className={isSelected ? 'active' : ''}
		onClick={() => onSelect(id, name)}
	>{name}</li>
}

export default ListOverviewItem
