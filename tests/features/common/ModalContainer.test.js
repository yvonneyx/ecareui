import React from 'react';
import { shallow } from 'enzyme';
import { ModalContainer } from '../../../src/features/common';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<ModalContainer />);
  expect(renderedComponent.find('.common-modal-container').length).toBe(1);
});
