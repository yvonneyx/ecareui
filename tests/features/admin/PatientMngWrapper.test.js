import React from 'react';
import { shallow } from 'enzyme';
import { PatientMngWrapper } from '../../../src/features/admin';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<PatientMngWrapper />);
  expect(renderedComponent.find('.admin-patient-mng-wrapper').length).toBe(1);
});
