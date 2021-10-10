import React from 'react';
import { shallow } from 'enzyme';
import { PatientMngWrapper } from '../../../src/features/coordinateur';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<PatientMngWrapper />);
  expect(renderedComponent.find('.coordinateur-patient-mng-page').length).toBe(1);
});
