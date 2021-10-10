import React from 'react';
import { shallow } from 'enzyme';
import { Layout } from '../../../src/features/coordinateur';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<Layout />);
  expect(renderedComponent.find('.coordinateur-layout').length).toBe(1);
});
