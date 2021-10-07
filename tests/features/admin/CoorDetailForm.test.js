import React from 'react';
import { shallow } from 'enzyme';
import { CoorDetailForm } from '../../../src/features/admin';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<CoorDetailForm />);
  expect(renderedComponent.find('.admin-coor-detail-form').length).toBe(1);
});
