import React from 'react';
import { shallow } from 'enzyme';
import { OrdMngWrapper } from '../../../src/features/coordinateur';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<OrdMngWrapper />);
  expect(renderedComponent.find('.coordinateur-ord-mng-wrapper').length).toBe(1);
});
