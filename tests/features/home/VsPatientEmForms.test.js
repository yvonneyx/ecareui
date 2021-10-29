import React from 'react';
import { shallow } from 'enzyme';
import { VsPatientEmForms } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<VsPatientEmForms />);
  expect(renderedComponent.find('.home-vs-patient-em-forms').length).toBe(1);
});
