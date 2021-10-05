import React from 'react';
import { shallow } from 'enzyme';
import { ExamenDetailForm } from '../../../src/features/admin';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<ExamenDetailForm />);
  expect(renderedComponent.find('.admin-examen-detail-form').length).toBe(1);
});
