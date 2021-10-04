import React from 'react';
import { shallow } from 'enzyme';
import { UserDetailForm } from '../../../src/features/admin';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<UserDetailForm />);
  expect(renderedComponent.find('.admin-user-detail-form').length).toBe(1);
});
