import React from 'react';
import { shallow } from 'enzyme';
import { OrdVsBreadcrumb } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<OrdVsBreadcrumb />);
  expect(renderedComponent.find('.home-breadcrumb').length).toBe(1);
});
