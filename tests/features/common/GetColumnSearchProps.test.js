import React from 'react';
import { shallow } from 'enzyme';
import { GetColumnSearchProps } from '../../../src/features/common';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<GetColumnSearchProps />);
  expect(renderedComponent.find('.common-get-column-search-props').length).toBe(1);
});
