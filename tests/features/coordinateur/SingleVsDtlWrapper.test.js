import React from 'react';
import { shallow } from 'enzyme';
import { SingleVsDtlWrapper } from '../../../src/features/coordinateur';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<SingleVsDtlWrapper />);
  expect(renderedComponent.find('.coordinateur-single-vs-dtl-wrapper').length).toBe(1);
});
