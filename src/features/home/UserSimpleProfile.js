import React from 'react';
// import PropTypes from 'prop-types';
import { roles } from '../../common/constants';
import { useCookies } from 'react-cookie';

export default function UserSimpleProfile({ props }) {
  const [cookies, ] = useCookies(['UID', 'UNAME', 'UROLE']);

  return (
    <div className="home-user-simple-profile">
      <div className="home-user-simple-profile-type">{roles[cookies.UROLE]}</div>
      <div className="home-user-simple-profile-name">{cookies.UNAME}</div>
    </div>
  );
}

UserSimpleProfile.propTypes = {};
UserSimpleProfile.defaultProps = {};
