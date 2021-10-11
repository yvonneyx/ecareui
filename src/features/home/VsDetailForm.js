import React from 'react';
// import PropTypes from 'prop-types';
import { Form, Input, Button, Radio, DatePicker, Row, Col } from 'antd';
import { showDateInline, showOnlyDate, showOnlyTime } from '../../common/constants';
export default function VsDetailForm(props) {
  const { data } = props;
  const [form] = Form.useForm();
  console.log(data);

  // coordinateurId: 1
  // createdTime: "2021-10-10T20:25:53.000+00:00"
  // infirmiereId: 1
  // isDeleted: "N"
  // modificateurRecent: 1
  // ordonnanceId: 1
  // patientId: 1
  // updatedTime: "2021-10-10T20:25:53.000+00:00"
  // visiteDate: "2021-10-09T22:00:00.000+00:00"
  // visiteEtat: 0
  // visiteHeureDebut: "2021-10-10T19:09:23.000+00:00"
  // visiteHeureFin: null
  // visiteId: 8
  // visiteObservation: null

  const formProps = [
    {
      type: Input,
      label: 'Infirmière Id',
      value: data.infirmiereId,
      span: 8,
    },
    {
      type: Input,
      label: 'Coordinateur Id',
      value: data.coordinateurId,
      span: 16,
    },
    { type: Input, label: 'Date de visite', value: showOnlyDate(data.visiteDate), span: 8 },
    { type: Input, label: 'Heure de début', value: showOnlyTime(data.visiteHeureDebut), span: 8 },
    {
      type: Input,
      label: 'Heure de fin',
      value: showOnlyTime(data.visiteHeureFin) || '--',
      span: 8,
    },
    { type: Input, label: 'Etat', value: data.visiteEtat, span: 8 },
    {
      type: Input,
      label: 'Obersation',
      value: data.visiteObservation || '--',
      span: 16,
    },
    { type: Input, label: 'Heure de création', value: showDateInline(data.createdTime), span: 8 },
    { type: Input, label: 'Heure mise à jour', value: showDateInline(data.updatedTime), span: 8 },
    { type: Input, label: 'Dernière modification par', value: data.modificateurRecent, span: 8 },
  ];

  // const formItemLayout = {
  //   labelCol: {
  //     span: 10,
  //   },
  //   wrapperCol: {
  //     span: 14,
  //   },
  // };

  // const specialItemLayout = {
  //   labelCol: {
  //     span: 5,
  //   },
  //   wrapperCol: {
  //     span: 19,
  //   },
  // };


  // {...formItemLayout}
  // {...(item.span === 16 && specialItemLayout)}
  return (
    <div className="home-vs-detail-form">
      <Form layout="horizontal" form={form} >
        <Row gutter={24}>
          {formProps.map(item => {
            return (
              <Col span={item.span}>
                <Form.Item label={item.label} >
                  {/* <item.type value={item.value} /> */}
                  <span>{item.value}</span>
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
