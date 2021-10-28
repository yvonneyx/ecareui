import React from 'react';
import { shallow } from 'enzyme';
import { OrdWithVsDtlWrapper } from '../../../src/features/infirmiere';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<OrdWithVsDtlWrapper />);
  expect(renderedComponent.find('.infirmiere-ord-with-vs-dtl-wrapper').length).toBe(1);
});
