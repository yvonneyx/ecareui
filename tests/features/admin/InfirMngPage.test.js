import React from 'react';
import { shallow } from 'enzyme';
import { InfirMngPage } from '../../../src/features/admin';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<InfirMngPage />);
  expect(renderedComponent.find('.admin-infir-mng-page').length).toBe(1);
});
