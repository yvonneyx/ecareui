import React from 'react';
import { shallow } from 'enzyme';
import { Unauthorized } from '../../../src/features/common';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<Unauthorized />);
  expect(renderedComponent.find('.common-unauthorized').length).toBe(1);
});
