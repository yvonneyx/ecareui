import React from 'react';
import { shallow } from 'enzyme';
import { OrdDetailTable } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<OrdDetailTable />);
  expect(renderedComponent.find('.home-ord-detail-table').length).toBe(1);
});
