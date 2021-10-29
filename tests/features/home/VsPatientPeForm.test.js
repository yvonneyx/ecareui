import React from 'react';
import { shallow } from 'enzyme';
import { VsPatientPeForm } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<VsPatientPeForm />);
  expect(renderedComponent.find('.home-vs-patient-pe-rcd-form').length).toBe(1);
});
