import React from 'react';
import { shallow } from 'enzyme';
import { ModalContainer } from '../../../src/features/admin';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<ModalContainer />);
  expect(renderedComponent.find('.admin-new-user-modal').length).toBe(1);
});
