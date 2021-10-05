import React from 'react';
import { shallow } from 'enzyme';
import { DptDetailForm } from '../../../src/features/admin';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<DptDetailForm />);
  expect(renderedComponent.find('.admin-dpt-detail-form').length).toBe(1);
});
