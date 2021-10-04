import React from 'react';
import { shallow } from 'enzyme';
import { SidePanel } from '../../../src/features/admin';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<SidePanel />);
  expect(renderedComponent.find('.admin-admin-menu').length).toBe(1);
});
