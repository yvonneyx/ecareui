import React from 'react';
import { shallow } from 'enzyme';
import { OrdMngWrapper } from '../../../src/features/admin';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<OrdMngWrapper />);
  expect(renderedComponent.find('.admin-ord-mng-wrapper').length).toBe(1);
});
