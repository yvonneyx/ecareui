import React from 'react';
import { shallow } from 'enzyme';
import { OrdMngWrapper } from '../../../src/features/infirmiere';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<OrdMngWrapper />);
  expect(renderedComponent.find('.infirmiere-ord-mng-wrapper').length).toBe(1);
});
