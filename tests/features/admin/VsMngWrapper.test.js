import React from 'react';
import { shallow } from 'enzyme';
import { VsMngWrapper } from '../../../src/features/admin';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<VsMngWrapper />);
  expect(renderedComponent.find('.admin-vs-mng-wrapper').length).toBe(1);
});
