import React from 'react';
import { shallow } from 'enzyme';
import { SidePanel } from '../../../src/features/coordinateur';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<SidePanel />);
  expect(renderedComponent.find('.coordinateur-side-panel').length).toBe(1);
});
