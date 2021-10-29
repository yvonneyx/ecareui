import React from 'react';
import { shallow } from 'enzyme';
import { VsPatientEmForm } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<VsPatientEmForm />);
  expect(renderedComponent.find('.home-vs-patient-em-rcd-form').length).toBe(1);
});
