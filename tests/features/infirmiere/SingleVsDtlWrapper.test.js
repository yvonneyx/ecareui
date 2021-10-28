import React from 'react';
import { shallow } from 'enzyme';
import { SingleVsDtlWrapper } from '../../../src/features/infirmiere';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<SingleVsDtlWrapper />);
  expect(renderedComponent.find('.infirmiere-single-vs-dtl-wrapper').length).toBe(1);
});
