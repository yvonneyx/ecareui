import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
import { Form, Input, Row, Col, InputNumber } from 'antd';
import { showSimpleDateInline, showOnlyDate, showOnlyTime } from '../../common/constants';
import _ from 'lodash';

const { TextArea } = Input;

export default function VsPatientConForm(props) {
  const { editable } = props;
  const [form] = Form.useForm();

  const wideLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 16,
    },
  };

  return (
    <div className="home-vs-patient-con-form">
      <div className="form-title">En conclusion</div>
      <Form layout="horizontal">
        <Form.Item label="Conclusion de l'observation" name="observation" {...wideLayout}>
          {editable ? <TextArea /> : 'text'}
        </Form.Item>
      </Form>
    </div>
  );
}

VsPatientConForm.propTypes = {};
VsPatientConForm.defaultProps = {};
