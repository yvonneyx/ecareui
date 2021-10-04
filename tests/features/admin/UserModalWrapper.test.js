import React from 'react';
import { shallow } from 'enzyme';
import { UserModalWrapper } from '../../../src/features/admin';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<UserModalWrapper />);
  expect(renderedComponent.find('.admin-user-modal-wrapper').length).toBe(1);
});
