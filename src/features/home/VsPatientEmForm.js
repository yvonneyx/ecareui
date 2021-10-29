import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
import { Form, Input, Row, Col } from 'antd';
import { showSimpleDateInline, showOnlyDate, showOnlyTime } from '../../common/constants';
import _ from 'lodash';

const { TextArea } = Input;

const data = {
  visiteId: 4,
  examenMedicalId: 4,
  examenMedicalStatus: 0,
  examenMedicalPayee: 'N',
  examenMedicalResult: null,
};

export default function VsPatientEmForm(props) {
  const { editable } = props;
  const [form] = Form.useForm();

  const normalLayout = {
    labelCol: {
      span: 12,
    },
    wrapperCol: {
      span: 8,
    },
  };

  const wideLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const renderEtat = v => {
    return v === 0 ? (
      <span style={{ color: '#D57E7E', fontWeight: '700' }}>Pas commencé</span>
    ) : v === 1 ? (
      <span style={{ color: '#5B8A72', fontWeight: '700' }}>En cours</span>
    ) : (
      <span style={{ color: '#5E454B', fontWeight: '700' }}>Fini</span>
    );
  };

  const renderPayStatus = v => {
    return v === 'N' ? (
      <span style={{ color: '#D57E7E', fontWeight: '700' }}>En attente</span>
    ) : (
      <span style={{ color: '#5B8A72', fontWeight: '700' }}>Payé</span>
    );
  };

  const editableFormProps = [
    {
      type: Input,
      label: 'Examen médical',
      value: data.examenMedicalId,
      span: 12,
      layout: normalLayout,
    },
    {
      type: Input,
      label: 'Status',
      value: renderEtat(data.examenMedicalStatus),
      span: 12,
      layout: normalLayout,
    },
    {
      type: TextArea,
      label: 'Résultat de examen médical',
      value: data.pressionArterielleDiastolique,
      span: 24,
      layout: wideLayout,
    },
    {
      type: Input,
      label: 'Statut du paiement',
      value: data.examenMedicalPayee,
      span: 12,
      layout: normalLayout,
    },
  ];

  const readonlyFormProps = [
    {
      label: 'Examen médical',
      value: data.examenMedicalId,
      span: 12,
      layout: normalLayout,
    },
    {
      label: 'Status',
      value: renderEtat(data.examenMedicalStatus),
      span: 12,
      layout: normalLayout,
    },
    {
      label: 'Résultat de examen médical',
      value: data.examenMedicalResult || '--',
      span: 24,
      layout: wideLayout,
    },
    {
      label: 'Statut du paiement',
      value: renderPayStatus(data.examenMedicalPayee),
      span: 12,
      layout: normalLayout,
    },
  ];

  return (
    <div className="home-vs-patient-em-form">
      <div className="form-title">Examens médicaux spécifiques</div>
      <Form layout="horizontal" form={form}>
        {editable ? (
          <Row gutter={24}>
            {editableFormProps.map(item => {
              return (
                <Col span={item.span} key={item.label}>
                  <Form.Item label={item.label} {...item.layout}>
                    <item.type {...item} />
                  </Form.Item>
                </Col>
              );
            })}
          </Row>
        ) : (
          <Row gutter={24} className="readonly-row" >
            {readonlyFormProps.map(item => {
              return (
                <Col span={item.span} key={item.label} >
                  <Form.Item label={item.label} {...item.layout}>
                    {item.value}
                  </Form.Item>
                </Col>
              );
            })}
          </Row>
        )}
      </Form>
    </div>
  );
}

VsPatientEmForm.propTypes = {};
VsPatientEmForm.defaultProps = {};
