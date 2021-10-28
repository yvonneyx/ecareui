import React from 'react';
import { shallow } from 'enzyme';
import { SidePanel } from '../../../src/features/infirmiere';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<SidePanel />);
  expect(renderedComponent.find('.infirmiere-side-panel').length).toBe(1);
});
