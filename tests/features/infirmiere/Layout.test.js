import React from 'react';
import { shallow } from 'enzyme';
import { Layout } from '../../../src/features/infirmiere';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<Layout />);
  expect(renderedComponent.find('.infirmiere-layout').length).toBe(1);
});
