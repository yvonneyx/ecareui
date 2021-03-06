import React from 'react';
// import PropTypes from 'prop-types';
import { Form, Input, Row, Col } from 'antd';
import { showSimpleDateInline, showOnlyDate, showOnlyTime } from '../../common/constants';
import _ from 'lodash';

export default function VsDetailForm(props) {
  const { data, type } = props;
  const [form] = Form.useForm();

  const renderOnlyDate = v => {
    return !_.isEmpty(v) ? showOnlyDate(v) : '--';
  };

  const renderOnlyTime = v => {
    return !_.isEmpty(v) ? showOnlyTime(v) : '--';
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

  const formProps = [
    { type: Input, label: 'Date de visite', value: renderOnlyDate(data.visiteDate), span: 8 },
    { type: Input, label: 'Heure de début', value: renderOnlyTime(data.visiteHeureDebut), span: 8 },
    {
      type: Input,
      label: 'Heure de fin',
      value: renderOnlyTime(data.visiteHeureFin),
      span: 8,
    },
    { type: Input, label: 'État', value: renderEtat(data.visiteEtat), span: 8 },
    {
      type: Input,
      label: 'Obversation',
      value: data.visiteObservation || '--',
      span: 16,
    },
    {
      type: Input,
      label: 'Heure mise à jour',
      value: showSimpleDateInline(data.updatedTime),
      span: 8,
    },
    { type: Input, label: 'Dernière modification par', value: data.modificateurRecentNom, span: 8 },
  ];

  if (type === 'simple') {
    _.pullAt(formProps, [5, 6]);
  }

  return (
    <div className="home-vs-detail-form">
      <Form layout="horizontal" form={form}>
        <Row gutter={24}>
          {formProps.map(item => {
            return (
              <Col span={item.span} key={item.label}>
                <Form.Item label={item.label}>
                  {/* <item.type value={item.value} /> */}
                  {item.value}
                </Form.Item>
              </Col>
            );
          })}
        </Row>
        {/* <Form.Item {...buttonItemLayout}>
          <Button type="primary">Submit</Button>
        </Form.Item> */}
      </Form>
    </div>
  );
}

VsDetailForm.propTypes = {};
VsDetailForm.defaultProps = {};
