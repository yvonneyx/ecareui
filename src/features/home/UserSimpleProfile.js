import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';

export default function UserSimpleProfile({ props }) {
  return (
    <div className="home-user-simple-profile">
      <div className="home-user-simple-profile-type">Administrateur</div>
      <div className="home-user-simple-profile-name">Krystal Jung</div>
    </div>
  );
}

UserSimpleProfile.propTypes = {};
UserSimpleProfile.defaultProps = {};
