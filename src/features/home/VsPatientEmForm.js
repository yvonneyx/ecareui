import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
// import PropTypes from 'prop-types';
import { Form, Input, Row, Col, Checkbox, Spin, Select } from 'antd';
import { showSimpleDateInline, showOnlyDate, showOnlyTime } from '../../common/constants';
import _ from 'lodash';
import { useFindVsDtlByVsId } from './redux/hooks';

const { TextArea } = Input;
const { Option } = Select;

var VsPatientEmForm = function(props, ref) {
  const { foundVs, editable } = props;
  const [data, setData] = useState(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [visiteDetailId, setVisiteDetailId] = useState(null);
  const [form] = Form.useForm();

  const { findVsDtlByVsId, findVsDtlByVsIdPending, findVsDtlByVsIdError } = useFindVsDtlByVsId();

  useImperativeHandle(ref, () => ({
    getFieldsValue: () => form.getFieldsValue(),
    setEmData: e => {
      setData(e);
    },
    hasPaid: hasPaid,
    visiteDetailId: visiteDetailId,
  }));

  useEffect(() => {
    findVsDtlByVsId({
      visiteId: foundVs.visiteId,
    }).then(res => {
      let dtls = res.data.ext.visiteDetails;
      if (!_.isEmpty(dtls)) {
        setVisiteDetailId(dtls[0].visiteDetailId);
        setData({
          ...dtls[0],
          examenMedicalStatus: _.toString(dtls[0].examenMedicalStatus),
          examenMedicalPayee: dtls[0].examenMedicalPayee === 'Y' ? true : false,
        });
        if (dtls[0].examenMedicalPayee === 'Y') {
          setHasPaid(true);
        }
      } else {
        setData({
          examenMedicalId: foundVs.examId,
          examenMedicalNom: foundVs.examNom,
          examenMedicalStatus: '0',
          examenMedicalPayee: false,
          examenMedicalResult: null,
        });
      }
    });
  }, [findVsDtlByVsId, foundVs]);

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
    return v === '0' ? (
      <span style={{ color: '#D57E7E', fontWeight: '700' }}>Pas commencé</span>
    ) : v === '1' ? (
      <span style={{ color: '#5B8A72', fontWeight: '700' }}>En cours</span>
    ) : (
      <span style={{ color: '#5E454B', fontWeight: '700' }}>Fini</span>
    );
  };

  const renderPayStatus = v => {
    return !v ? (
      <span style={{ color: '#D57E7E', fontWeight: '700' }}>En attente</span>
    ) : (
      <span style={{ color: '#5B8A72', fontWeight: '700' }}>Payé</span>
    );
  };

  const handlePayStatusChange = e => {
    setHasPaid(e.target.checked);
  };

  useEffect(() => {
    form.setFieldsValue(data);
  }, [form, data]);

  return (
    <div className="home-vs-patient-em-form">
      <div className="form-title">Examen médical spécifique</div>
      <Spin spinning={findVsDtlByVsIdPending}>
        {!_.isEmpty(data) && (
          <Form layout="horizontal" form={form} initialValues={data}>
            <Row gutter={24}>
              <Col span={12} key="examenMedicalNom">
                <Form.Item
                  name="examenMedicalNom"
                  label="Examen médical"
                  {...normalLayout}
                  wrapperCol={{ span: 14 }}
                >
                  {editable ? <Input disabled={true} /> : <span>{data.examenMedicalNom}</span>}
                </Form.Item>
              </Col>
              <Col span={12} key="status">
                <Form.Item label="Statut" {...normalLayout} name="examenMedicalStatus">
                  {editable ? (
                    <Select>
                      <Option value="0">Pas commencé</Option>
                      <Option value="1">En cours</Option>
                      <Option value="2">Fini</Option>
                    </Select>
                  ) : (
                    renderEtat(data.examenMedicalStatus)
                  )}
                </Form.Item>
              </Col>
              <Col span={24} key="result">
                <Form.Item
                  label="Résultat de examen médical"
                  {...wideLayout}
                  name="examenMedicalResult"
                >
                  {editable ? <TextArea /> : <span>{data.examenMedicalResult || '--'}</span>}
                </Form.Item>
              </Col>
              <Col span={12} key="hasPaid">
                <Form.Item label="Statut du paiement" {...normalLayout}>
                  {editable ? (
                    <Checkbox
                      defaultChecked={data.examenMedicalPayee}
                      onChange={handlePayStatusChange}
                    />
                  ) : (
                    renderPayStatus(data.examenMedicalPayee)
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}
      </Spin>
    </div>
  );
};

export default VsPatientEmForm = forwardRef(VsPatientEmForm);

VsPatientEmForm.propTypes = {};
VsPatientEmForm.defaultProps = {};

{
  /* <Row gutter={24} className="readonly-row">
{readonlyFormProps &&
  readonlyFormProps.map(item => {
    return (
      <Col span={item.span} key={item.label}>
        <Form.Item label={item.label} {...item.layout}>
          {item.value}
        </Form.Item>
      </Col>
    );
  })}
</Row> */
}
