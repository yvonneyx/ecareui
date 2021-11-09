import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
import { Select } from 'antd';
import { Form, Input, message, notification, Radio, DatePicker } from 'antd';
import moment from 'moment';

const { Option } = Select;
export default function Test() {
  return (
    <div className="common-test">
      <DatePicker
        format={'DD-MM-YYYY'}
        placeholder="DD-MM-YYYY"
        defaultValue={moment('1973-08-30', 'DD-MM-YYYY')}
      />
    </div>
  );
}

Test.propTypes = {};
Test.defaultProps = {};
