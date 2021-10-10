import React from 'react';
import { shallow } from 'enzyme';
import { NouvelleOrdonnance } from '../../../src/features/coordinateur';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<NouvelleOrdonnance />);
  expect(renderedComponent.find('.coordinateur-nouvelle-ordonnance').length).toBe(1);
});
