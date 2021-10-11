import React from 'react';
import { shallow } from 'enzyme';
import { SingleVsDtlPage } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<SingleVsDtlPage />);
  expect(renderedComponent.find('.home-single-vs-dtl-page').length).toBe(1);
});
