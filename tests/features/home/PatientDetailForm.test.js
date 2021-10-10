import React from 'react';
import { shallow } from 'enzyme';
import { PatientDetailForm } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<PatientDetailForm />);
  expect(renderedComponent.find('.home-patient-detail-form').length).toBe(1);
});
