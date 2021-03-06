import React from 'react';
import { shallow } from 'enzyme';
import { VsDetailForm } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<VsDetailForm />);
  expect(renderedComponent.find('.home-vs-detail-form').length).toBe(1);
});
