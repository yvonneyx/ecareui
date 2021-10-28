import React from 'react';
import { shallow } from 'enzyme';
import { VsSummaryPage } from '../../../src/features/infirmiere';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<VsSummaryPage />);
  expect(renderedComponent.find('.infirmiere-vs-summary-tbl').length).toBe(1);
});
