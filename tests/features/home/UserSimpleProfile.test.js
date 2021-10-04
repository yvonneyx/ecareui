import React from 'react';
import { shallow } from 'enzyme';
import { UserSimpleProfile } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<UserSimpleProfile />);
  expect(renderedComponent.find('.home-user-simple-profile').length).toBe(1);
});
