import React from 'react';
import { shallow } from 'enzyme';
import { UserMngPage } from '../../../src/features/admin';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<UserMngPage />);
  expect(renderedComponent.find('.admin-user-mng-page').length).toBe(1);
});
