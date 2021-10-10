import React, { useState, useImperativeHandle, forwardRef } from 'react';
// import PropTypes from 'prop-types';
import { Form, Input, message, notification, Radio, DatePicker } from 'antd';
import _ from 'lodash';
import { useAddPatient, useUpdatePatient } from './redux/hooks';

var PatientDetailForm = function(props, ref) {
  const { data, onModalVisibleChange, handleVersionUpdate } = props;
  const [selectedSexe, setSelectedSexe] = useState(0);
  const [form] = Form.useForm();
  const mode = _.isEmpty(data) ? 'new' : 'update';
  const { addPatient } = useAddPatient();
  const { updatePatient } = useUpdatePatient();

  useImperativeHandle(ref, () => ({
    onFinish: () => {
      const values = form.getFieldsValue();
      form
        .validateFields()
        .then(() => {
          return onFinish(values);
        })
        .catch(() => {
          notification.error({
            message: 'Error',
            description: 'Veuillez remplir si nécessaire.',
          });
        });
    },
  }));

  const onFinish = values => {
    if (mode === 'new') {
      addPatient({
        ...values,
        patientNaissance: new Date(values.patientNaissance),
      })
        .then(() => {
          onModalVisibleChange(false);
          message.success('Ajouté avec succès', 5);
          handleVersionUpdate();
        })
        .catch(() => {
          onModalVisibleChange(false);
          message.error('Échec de la création', 5);
        });
    }
    if (mode === 'update') {
      updatePatient({
        ...values,
        patientId: data.patientId,
        patientNaissance: new Date(values.patientNaissance),
      })
        .then(() => {
          onModalVisibleChange(false);
          message.success('Mise à jour terminée', 5);
          handleVersionUpdate();
        })
        .catch(() => {
          onModalVisibleChange(false);
          message.error('Mise à jour a échoué', 5);
        });
    }
  };

  const onSexeChange = e => {
    setSelectedSexe(e.target.value);
  };

  return (
    <div className="home-patient-detail-form">
      <Form
        name="dpt-detail-form"
        form={form}
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={data}
      >
        {mode === 'update' && (
          <Form.Item label="ID" name="patientId">
            <span className="ant-form-text">{data.patientId}</span>
          </Form.Item>
        )}


        <Form.Item
          label="Nom"
          name="patientNom"
          rules={[
            {
              required: true,
              message: 'Veuillez saisir le nom du patient!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Sexe"
          name="patientSexe"
          rules={[
            {
              required: true,
              message: "Veuillez saisir l'adresse du patient!",
            },
          ]}
        >
          <Radio.Group onChange={onSexeChange} value={selectedSexe} defaultValue="0">
            <Radio value={0}>Male</Radio>
            <Radio value={1}>Female</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Date de naissance"
          name="patientNaissance"
          rules={[
            {
              required: true,
              message: "Veuillez saisir l'adresse du patient!",
            },
          ]}
        >
          <DatePicker format={'DD-MM-YYYY'} placeholder="DD-MM-YYYY" />
        </Form.Item>
        <Form.Item
          label="Téléphone"
          name="patientTelephone"
          rules={[
            {
              required: true,
              message: 'Veuillez saisir le numéro de téléphone du patient!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const regex = new RegExp('^[0-9]{1,10}$');
                if (regex.test(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('Veuillez saisir le numéro de téléphone correctement!'),
                );
              },
            }),
          ]}
        >
          <Input addonBefore={<span>+33</span>} />
        </Form.Item>
        <Form.Item
          label="Addresse"
          name="patientAddresse"
          rules={[
            {
              required: true,
              message: "Veuillez saisir l'adresse du patient!",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </div>
  );
};

export default PatientDetailForm = forwardRef(PatientDetailForm);

PatientDetailForm.propTypes = {};
PatientDetailForm.defaultProps = {};
