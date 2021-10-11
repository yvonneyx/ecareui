import React from 'react';
import { shallow } from 'enzyme';
import { VsMngWrapper } from '../../../src/features/coordinateur';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<VsMngWrapper />);
  expect(renderedComponent.find('.coordinateur-vs-mng-wrapper').length).toBe(1);
});
