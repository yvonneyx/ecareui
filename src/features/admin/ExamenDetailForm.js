import React, { useImperativeHandle, forwardRef } from 'react';
// import PropTypes from 'prop-types';
import { Form, Input, message, notification } from 'antd';
import _ from 'lodash';
import { useAddExamen, useUpdateExamen } from './redux/hooks';

var ExamenDetailForm = function(props, ref) {
  const { data, onModalVisibleChange, handleVersionUpdate } = props;
  const [form] = Form.useForm();
  const mode = _.isEmpty(data) ? 'new' : 'update';
  const { addExamen } = useAddExamen();
  const { updateExamen } = useUpdateExamen();

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
      addExamen({
        examenMedicalNom: values.name,
        examenMedicalPrix: values.price,
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
      updateExamen({
        examenMedicalId: values.id,
        examenMedicalNom: values.name,
        examenMedicalPrix: values.price,
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

  const initialValues = {
    id: data.examenMedicalId,
    name: data.examenMedicalNom,
    price: data.examenMedicalPrix,
  };

  return (
    <div className="admin-examen-detail-form">
      <Form
        name="examen-detail-form"
        form={form}
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={initialValues}
      >
        {mode === 'update' && (
          <Form.Item label="ID" name="id">
            <span className="ant-form-text">{data.examenMedicalId}</span>
          </Form.Item>
        )}

        <Form.Item
          label="Nom"
          name="name"
          rules={[
            {
              required: true,
              message: "Veuillez saisir le nom de l'examen medical!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Prix"
          name="price"
          rules={[
            {
              required: true,
              message: "Veuillez créer un mot de passe d'initialisation pour cela.",
            },
          ]}
        >
          <Input suffix="€" />
        </Form.Item>
      </Form>
    </div>
  );
};

export default ExamenDetailForm = forwardRef(ExamenDetailForm);

ExamenDetailForm.propTypes = {};
ExamenDetailForm.defaultProps = {};
