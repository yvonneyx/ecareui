import React from 'react';
import { shallow } from 'enzyme';
import { VsPatientConForm } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<VsPatientConForm />);
  expect(renderedComponent.find('.home-vs-patient-con-form').length).toBe(1);
});
