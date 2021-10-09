import React from 'react';
import { shallow } from 'enzyme';
import { PatientDetailForm } from '../../../src/features/admin';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<PatientDetailForm />);
  expect(renderedComponent.find('.admin-patient-detail-form').length).toBe(1);
});
