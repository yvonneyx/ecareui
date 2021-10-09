import React, { useImperativeHandle, forwardRef } from 'react';
// import PropTypes from 'prop-types';
import { Form, Input, message, notification, InputNumber } from 'antd';
import _ from 'lodash';
import { useUpdateCoor } from './redux/hooks';

var CoorDetailForm = function(props, ref) {
  const { data, onModalVisibleChange, handleVersionUpdate } = props;
  const [form] = Form.useForm();
  const { updateCoor } = useUpdateCoor();

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
    updateCoor({
      coordinateurId: data.coordinateurId,
      coordinateurNom: values.coordinateurNom,
      coordinateurTelephone: values.coordinateurTelephone,
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
  };

  const initialValues = {
    coordinateurNom: data.coordinateurNom,
    coordinateurTelephone: data.coordinateurTelephone,
  };

  return (
    <div className="admin-coor-detail-form">
      <Form
        name="coor-detail-form"
        form={form}
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={initialValues}
      >
        <Form.Item label="Nom et prénom" name="coordinateurNom">
          <Input />
        </Form.Item>

        <Form.Item
          label="Téléphone"
          name="coordinateurTelephone"
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                const regex = new RegExp('^[0-9]{1,10}$');
                if (!value || regex.test(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Veuillez saisir un numéro de téléphone exact!'));
              },
            }),
          ]}
        >
          <Input addonBefore={<span>+33</span>} />
        </Form.Item>
      </Form>
    </div>
  );
};

export default CoorDetailForm = forwardRef(CoorDetailForm);

CoorDetailForm.propTypes = {};
CoorDetailForm.defaultProps = {};
