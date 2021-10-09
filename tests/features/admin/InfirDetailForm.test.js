import React from 'react';
import { shallow } from 'enzyme';
import { InfirDetailForm } from '../../../src/features/admin';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<InfirDetailForm />);
  expect(renderedComponent.find('.admin-infir-detail-form').length).toBe(1);
});
