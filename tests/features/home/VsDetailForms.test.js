import React from 'react';
import { shallow } from 'enzyme';
import { VsDetailForms } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<VsDetailForms />);
  expect(renderedComponent.find('.home-vs-detail-form-wrapper').length).toBe(1);
});
