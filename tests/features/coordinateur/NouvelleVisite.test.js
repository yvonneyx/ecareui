import React from 'react';
import { shallow } from 'enzyme';
import { NouvelleVisite } from '../../../src/features/coordinateur';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<NouvelleVisite />);
  expect(renderedComponent.find('.coordinateur-nouvelle-visite').length).toBe(1);
});
