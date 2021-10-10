import React from 'react';
import { shallow } from 'enzyme';
import { ModalWrapper } from '../../../src/features/common';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<ModalWrapper />);
  expect(renderedComponent.find('.common-modal-container').length).toBe(1);
});
