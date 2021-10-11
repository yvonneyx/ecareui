import React from 'react';
import { shallow } from 'enzyme';
import { OrdWithVsDtlWrapper } from '../../../src/features/coordinateur';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<OrdWithVsDtlWrapper />);
  expect(renderedComponent.find('.coordinateur-ord-with-vs-dtl-wrapper').length).toBe(1);
});
