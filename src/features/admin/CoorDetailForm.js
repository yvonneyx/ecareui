import React, { useImperativeHandle, forwardRef } from 'react';
// import PropTypes from 'prop-types';
import { Form, Input, message, notification, InputNumber } from 'antd';
import _ from 'lodash';
import { useAddDpt, useUpdateDpt } from './redux/hooks';
import TextArea from 'antd/lib/input/TextArea';

var CoorDetailForm = function(props, ref) {
  const { data, onModalVisibleChange, handleVersionUpdate } = props;
  const [form] = Form.useForm();
  const mode = _.isEmpty(data) ? 'new' : 'update';
  // const { addDpt } = useAddDpt();
  // const { updateDpt } = useUpdateDpt();

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
      console.log(typeof Number(values.coordinateurTelephone))
      debugger;
      // addDpt({
      //   departementNom: values.name,
      //   departementDescription: values.desc,
      // })
      //   .then(() => {
      //     onModalVisibleChange(false);
      //     message.success('Ajouté avec succès', 5);
      //     handleVersionUpdate();
      //   })
      //   .catch(() => {
      //     onModalVisibleChange(false);
      //     message.error('Échec de la création', 5);
      //   });
    }
    if (mode === 'update') {
      // updateDpt({
      //   departementId: values.id,
      //   departementNom: values.name,
      //   departementDescription: values.desc,
      // })
      //   .then(() => {
      //     onModalVisibleChange(false);
      //     message.success('Mise à jour terminée', 5);
      //     handleVersionUpdate();
      //   })
      //   .catch(() => {
      //     onModalVisibleChange(false);
      //     message.error('Mise à jour a échoué', 5);
      //   });
    }
  };

  const initialValues = {
    id: data.departementId,
    name: data.departementNom,
    desc: data.departementDescription,
  };

  return (
    <div className="admin-coor-detail-form">
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
          <Form.Item label="User ID" name="userId">
            <span className="ant-form-text">{data.userId}</span>
            <span className="ant-form-text inline-label">Coordinateur ID:</span>
            <span className="ant-form-text">{data.coordinateurId}</span>
          </Form.Item>
        )}

        <Form.Item
          label="Nom"
          name="coordinateurNom"
          rules={[
            {
              required: true,
              message: 'Veuillez saisir le nom du coordinateur!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Téléphone"
          name="coordinateurTelephone"
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                const regex = new RegExp('^[0-9]{1,10}$');
                if (regex.test(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('Veuillez saisir votre numéro de téléphone portable à huit chiffres!'),
                );
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
