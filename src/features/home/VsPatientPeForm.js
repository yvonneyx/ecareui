import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
import { Form, Input, Row, Col, InputNumber } from 'antd';
import { showSimpleDateInline, showOnlyDate, showOnlyTime } from '../../common/constants';
import _ from 'lodash';

const data = {
  patientId: 2,
  temperatureCorporelle: 36.0,
  rythmeCardiaque: 80,
  pressionArterielleSystolique: 90,
  pressionArterielleDiastolique: 130,
};

export default function VsPatientPeForm(props) {
  const { editable } = props;
  const [form] = Form.useForm();

  const formProps = [
    {
      type: Input,
      label: 'Température corporelle',
      value: data.temperatureCorporelle,
      addonAfter: '℃',
    },
    {
      type: Input,
      label: 'Fréquence cardiaque',
      value: data.rythmeCardiaque,
      addonAfter: 'bpm',
    },
    {
      type: Input,
      label: 'Pression artérielle systolique',
      value: data.pressionArterielleSystolique,
      addonAfter: 'mmHg',
    },
    {
      type: Input,
      label: 'Pression artérielle diastolique',
      value: data.pressionArterielleDiastolique,
      addonAfter: 'mmHg',
    },
  ];

  return (
    <div className="home-vs-patient-pe-form">
      <div className="form-title">Examen de routine</div>
      <Form layout="horizontal" form={form} labelCol={{ span: 12 }} wrapperCol={{ span: 8 }}>
        <Row gutter={24} className={!editable && 'readonly-row'}>
          {formProps.map(item => {
            return (
              <Col span={12} key={item.label}>
                <Form.Item label={item.label}>
                  {editable ? (
                    <item.type {...item} />
                  ) : (
                    <span>{`${item.value} ${item.addonAfter}`}</span>
                  )}
                </Form.Item>
              </Col>
            );
          })}
        </Row>
      </Form>
    </div>
  );
}

VsPatientPeForm.propTypes = {};
VsPatientPeForm.defaultProps = {};
