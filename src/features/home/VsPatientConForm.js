import React, { useImperativeHandle, forwardRef, useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import { Form, Input } from 'antd';
import _ from 'lodash';
const { TextArea } = Input;

var VsPatientConForm = function(props, ref) {
  const { visiteObservation, editable } = props;
  const [form] = Form.useForm();
  const [data, setData] = useState(null);

  useEffect(() => {
    setData({
      observation: visiteObservation,
    });
  }, [visiteObservation]);

  useImperativeHandle(ref, () => ({
    getFieldsValue: () => form.getFieldsValue(),
    setConData: e => {
      setData(e);
    },
  }));

  const wideLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 16,
    },
  };

  useEffect(()=>{
    form.setFieldsValue(data)
  }, [form, data])

  return (
    <div className="home-vs-patient-con-form">
      <div className="form-title">En conclusion</div>
      {!_.isEmpty(data) && (
        <Form layout="horizontal" form={form}>
          <Form.Item label="Conclusion de l'observation" name="observation" {...wideLayout}>
            {editable ? <TextArea /> : <span>{data.observation || '--'}</span>}
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default VsPatientConForm = forwardRef(VsPatientConForm);

VsPatientConForm.propTypes = {};
VsPatientConForm.defaultProps = {};
