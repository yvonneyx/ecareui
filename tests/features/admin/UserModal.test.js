import React from 'react';
import { shallow } from 'enzyme';
import { UserModal } from '../../../src/features/admin';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<UserModal />);
  expect(renderedComponent.find('.admin-new-user-modal').length).toBe(1);
});
