import React from 'react';
import { shallow } from 'enzyme';
import { DptMngPage } from '../../../src/features/admin';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<DptMngPage />);
  expect(renderedComponent.find('.admin-dpt-mng-page').length).toBe(1);
});
