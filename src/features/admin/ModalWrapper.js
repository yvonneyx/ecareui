import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
import { ModalContainer } from './';

export default function ModalWrapper({ visible, ...rest }) {
  if (!visible) return null;
  return <ModalContainer visible {...rest} />;
}

ModalWrapper.propTypes = {};
ModalWrapper.defaultProps = {};
