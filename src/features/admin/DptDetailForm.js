import React, { useImperativeHandle, forwardRef } from 'react';
// import PropTypes from 'prop-types';
import { Form, Input, message, notification } from 'antd';
import _ from 'lodash';
import { useAddDpt, useUpdateDpt } from './redux/hooks';
import TextArea from 'antd/lib/input/TextArea';

var DptDetailForm = function(props, ref) {
  const { data, onModalVisibleChange, handleVersionUpdate } = props;
  const [form] = Form.useForm();
  const mode = _.isEmpty(data) ? 'new' : 'update';
  const { addDpt } = useAddDpt();
  const { updateDpt } = useUpdateDpt();

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
      addDpt({
        departementNom: values.name,
        departementDescription: values.desc,
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
      updateDpt({
        departementId: values.id,
        departementNom: values.name,
        departementDescription: values.desc,
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
    id: data.departementId,
    name: data.departementNom,
    desc: data.departementDescription,
  };

  return (
    <div className="admin-dpt-detail-form">
      <Form
        name="dpt-detail-form"
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
            <span className="ant-form-text">{data.departementId}</span>
          </Form.Item>
        )}

        <Form.Item
          label="Nom"
          name="name"
          rules={[
            {
              required: true,
              message: 'Veuillez saisir le nom du département medical!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Description" name="desc">
          <TextArea maxLength={255} rows={4} showCount />
        </Form.Item>
      </Form>
    </div>
  );
};

export default DptDetailForm = forwardRef(DptDetailForm);

DptDetailForm.propTypes = {};
DptDetailForm.defaultProps = {};
