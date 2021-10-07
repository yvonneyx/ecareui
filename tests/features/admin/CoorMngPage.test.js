import React from 'react';
import { shallow } from 'enzyme';
import { CoorMngPage } from '../../../src/features/admin';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<CoorMngPage />);
  expect(renderedComponent.find('.admin-coor-mng-page').length).toBe(1);
});
