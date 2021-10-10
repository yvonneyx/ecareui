import React from 'react';
import { shallow } from 'enzyme';
import { VsMngPage } from '../../../src/features/admin';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<VsMngPage />);
  expect(renderedComponent.find('.admin-vs-mng-page').length).toBe(1);
});
