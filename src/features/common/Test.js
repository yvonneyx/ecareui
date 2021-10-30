import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
import { Select } from 'antd';

const { Option } = Select;
export default function Test() {
  return (
    <div className="common-test">
      <Select defaultValue="0">
        <Option value="0">Pas commencé</Option>
        <Option value="1">En cours</Option>
        <Option value="2">Fini</Option>
      </Select>
    </div>
  );
};

Test.propTypes = {};
Test.defaultProps = {};
