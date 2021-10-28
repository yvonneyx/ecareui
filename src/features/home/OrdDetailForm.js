import React, { useEffect } from 'react';
// import PropTypes from 'prop-types';
import { Form, Input, Button, Radio, DatePicker, Row, Col } from 'antd';
import { showDateInline, showOnlyDate, showOnlyTime } from '../../common/constants';
import _ from 'lodash';

export default function OrdDetailForm(props) {
  const { data } = props;
  const [form] = Form.useForm();

  const renderEtat = v => {
    return v === 0 ? (
      <span style={{ color: '#D57E7E', fontWeight: '700' }}>Pas commencé</span>
    ) : v === 1 ? (
      <span style={{ color: '#5B8A72', fontWeight: '700' }}>En cours</span>
    ) : (
      <span style={{ color: '#5E454B', fontWeight: '700' }}>Fini</span>
    );
  };

  const formProps = [
    { type: Input, label: 'État', value: renderEtat(data.ordonnanceEtat), span: 8 },
    {
      type: Input,
      label: 'Intervalle suggéré',
      value: `${data.ordonnanceIntervalle} jours`,
      span: 8,
    },
    {
      type: Input,
      label: 'Nombre de visites total',
      value: `${data.ordonnanceCount} fois`,
      span: 8,
    },
    { type: Input, label: 'Heure de création', value: showDateInline(data.createdTime), span: 8 },
    { type: Input, label: 'Heure mise à jour', value: showDateInline(data.updatedTime), span: 16 },
  ];

  return (
    <div className="home-ord-detail-form">
      <Form layout="horizontal" form={form}>
        <Row gutter={24}>
          {formProps.map(item => {
            return (
              <Col span={item.span} key={item.label}>
                <Form.Item label={item.label}>{item.value}</Form.Item>
              </Col>
            );
          })}
        </Row>
      </Form>
    </div>
  );
}

OrdDetailForm.propTypes = {};
OrdDetailForm.defaultProps = {};
