import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
// import PropTypes from 'prop-types';
import { Form, Input, Row, Col, Spin } from 'antd';
import _ from 'lodash';
import { useFindPatientDtlByVsId } from './redux/hooks';

var VsPatientPeForm = function(props, ref) {
  const { foundVs, editable, version } = props;
  const [data, setData] = useState(null);
  const [patientDetailId, setPatientDetailId] = useState(null);
  const [form] = Form.useForm();
  const {
    findPatientDtlByVsId,
    findPatientDtlByVsIdPending,
    findPatientDtlByVsIdError,
  } = useFindPatientDtlByVsId();

  useImperativeHandle(ref, () => ({
    getFieldsValue: () => form.getFieldsValue(),
    setPeData: e => {
      setData(e);
    },
    patientDetailId: patientDetailId,
  }));

  useEffect(() => {
    findPatientDtlByVsId({
      patientId: foundVs.patientId,
      visiteId: foundVs.visiteId,
    }).then(res => {
      let dtl = res.data.ext.patientDetails;
      if (!_.isEmpty(dtl)) {
        setData({
          pressionArterielleDiastolique: _.toString(dtl.pressionArterielleDiastolique),
          pressionArterielleSystolique: _.toString(dtl.pressionArterielleSystolique),
          rythmeCardiaque: _.toString(dtl.rythmeCardiaque),
          temperatureCorporelle: _.toString(dtl.temperatureCorporelle),
        });
        setPatientDetailId(dtl.patientDetailId);
      } else {
        setData({
          patientId: foundVs.patientId,
          temperatureCorporelle: null,
          rythmeCardiaque: null,
          pressionArterielleSystolique: null,
          pressionArterielleDiastolique: null,
        });
      }
    });
  }, [findPatientDtlByVsId, foundVs, version]);

  console.log('pe', {...data});
  console.log(form.getFieldsValue());

  const formProps = !_.isEmpty(data) && [
    {
      type: Input,
      name: 'temperatureCorporelle',
      label: 'Température corporelle',
      addonAfter: '℃',
    },
    {
      type: Input,
      name: 'rythmeCardiaque',
      label: 'Fréquence cardiaque',
      addonAfter: 'bpm',
    },
    {
      type: Input,
      name: 'pressionArterielleSystolique',
      label: 'Pression artérielle systolique',
      addonAfter: 'mmHg',
    },
    {
      type: Input,
      name: 'pressionArterielleDiastolique',
      label: 'Pression artérielle diastolique',
      addonAfter: 'mmHg',
    },
  ];

  useEffect(()=>{
    form.setFieldsValue(data)
  }, [form, data])

  return (
    <div className="home-vs-patient-pe-form">
      <div className="form-title">Examen de routine</div>
      <Spin spinning={findPatientDtlByVsIdPending}>
        <Form
          layout="horizontal"
          form={form}
          labelCol={{ span: 12 }}
          wrapperCol={{ span: 8 }}
        >
          <Row gutter={24} className={!editable && 'readonly-row'}>
            {!_.isEmpty(formProps) &&
              formProps.map(item => {
                return (
                  <Col span={12} key={item.name}>
                    <Form.Item label={item.label} name={item.name}>
                      {editable ? (
                        <item.type addonAfter={item.addonAfter} />
                      ) : (
                        <span>
                          {data[item.name] ? `${data[item.name]} ${item.addonAfter}` : '--'}
                        </span>
                      )}
                    </Form.Item>
                  </Col>
                );
              })}
          </Row>
        </Form>
      </Spin>
    </div>
  );
};

export default VsPatientPeForm = forwardRef(VsPatientPeForm);

VsPatientPeForm.propTypes = {};
VsPatientPeForm.defaultProps = {};
