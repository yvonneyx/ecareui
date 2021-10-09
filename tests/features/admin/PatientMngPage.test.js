import React from 'react';
import { shallow } from 'enzyme';
import { PatientMngPage } from '../../../src/features/admin';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<PatientMngPage />);
  expect(renderedComponent.find('.admin-patient-mng-page').length).toBe(1);
});
