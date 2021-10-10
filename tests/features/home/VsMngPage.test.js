import React from 'react';
import { shallow } from 'enzyme';
import { VsMngPage } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<VsMngPage />);
  expect(renderedComponent.find('.home-vs-mng-page').length).toBe(1);
});
