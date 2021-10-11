import React from 'react';
import { shallow } from 'enzyme';
import { VsDetailTable } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<VsDetailTable />);
  expect(renderedComponent.find('.home-vs-detail-table').length).toBe(1);
});
