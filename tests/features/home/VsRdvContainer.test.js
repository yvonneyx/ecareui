import React from 'react';
import { shallow } from 'enzyme';
import { VsRdvContainer } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<VsRdvContainer />);
  expect(renderedComponent.find('.home-vs-rdv-container').length).toBe(1);
});
