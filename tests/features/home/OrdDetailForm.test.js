import React from 'react';
import { shallow } from 'enzyme';
import { OrdDetailForm } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<OrdDetailForm />);
  expect(renderedComponent.find('.home-ord-detail-form').length).toBe(1);
});
