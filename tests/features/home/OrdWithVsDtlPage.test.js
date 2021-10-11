import React from 'react';
import { shallow } from 'enzyme';
import { OrdWithVsDtlPage } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<OrdWithVsDtlPage />);
  expect(renderedComponent.find('.home-ord-detail-page').length).toBe(1);
});
