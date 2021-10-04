import React from 'react';
import { shallow } from 'enzyme';
import { Layout } from '../../../src/features/admin';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<Layout />);
  expect(renderedComponent.find('.admin-admin-module').length).toBe(1);
});
