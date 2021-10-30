import React from 'react';
import { shallow } from 'enzyme';
import { Test } from '../../../src/features/common';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<Test />);
  expect(renderedComponent.find('.common-test').length).toBe(1);
});
