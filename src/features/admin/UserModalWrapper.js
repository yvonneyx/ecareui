import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
import { UserModal } from './';

export default function UserModalWrapper({ visible, ...rest }) {
  if (!visible) return null;
  return <UserModal visible {...rest}/>;
}

UserModalWrapper.propTypes = {};
UserModalWrapper.defaultProps = {};
