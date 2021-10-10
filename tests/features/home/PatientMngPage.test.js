import React from 'react';
import { shallow } from 'enzyme';
import { PatientMngPage } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<PatientMngPage />);
  expect(renderedComponent.find('.home-patient-mng-page').length).toBe(1);
});
