import React from 'react';
import { shallow } from 'enzyme';
import { OrdMngPage } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<OrdMngPage />);
  expect(renderedComponent.find('.home-ord-mng-page').length).toBe(1);
});
