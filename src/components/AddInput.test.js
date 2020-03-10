import React from 'react'
import { shallow } from 'enzyme'

import AddInput from './AddInput'

describe('AddInput', () => {
	it('snapshot matches', () => {
		const wrapper = shallow(<AddInput lable="placeholder text here" />)
		expect(wrapper).toMatchSnapshot()
	})

	it('calles onAdd handler with input', () => {
		const onAdd = jest.fn()
		const mockSubmitEvent = {
			preventDefault: jest.fn(),
		}
		const wrapper = shallow(<AddInput lable="placeholder text here" onAdd={onAdd} />)
		wrapper.find('input').simulate('change', { target: { value: 'test input' } })
		wrapper.find('form').simulate('submit', mockSubmitEvent)
		expect(onAdd).toHaveBeenCalledWith('test input')
		expect(mockSubmitEvent.preventDefault).toHaveBeenCalled()
		expect(wrapper.find('input')).toHaveProp('value', '')
	})
})
