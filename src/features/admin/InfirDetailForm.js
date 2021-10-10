import React, { useImperativeHandle, forwardRef, useMemo } from 'react';
// import PropTypes from 'prop-types';
import { Form, Input, message, notification, Select } from 'antd';
import { useUpdateInfirmiere } from './redux/hooks';

var InfirDetailForm = function(props, ref) {
  const { data, onModalVisibleChange, handleVersionUpdate, dptsList } = props;
  const [form] = Form.useForm();
  const { updateInfirmiere } = useUpdateInfirmiere();

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

  const dptsOption = useMemo(() => {
    return (dptsList || []).map(dpt => {
      return {
        value: dpt.departementId,
        name: dpt.departementNom,
      };
    });
  }, [dptsList]);

  const onFinish = values => {
    updateInfirmiere({
      infirmiereId: data.infirmiereId,
      infirmiereNom: values.infirmiereNom,
      infirmiereTelephone: values.infirmiereTelephone,
      departementId: values.departementId,
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

  return (
    <div className="admin-infir-detail-form">
      <Form
        name="infir-detail-form"
        form={form}
        labelCol={{
          span: 9,
        }}
        wrapperCol={{
          span: 15,
        }}
        initialValues={data}
      >
        <Form.Item label="Nom et prénom" name="infirmiereNom">
          <Input />
        </Form.Item>

        <Form.Item
          label="Téléphone"
          name="infirmiereTelephone"
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

        <Form.Item label="Département concerné" name="departementId">
          <Select
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            initialValues={data.departementId}
          >
            {dptsOption.map(dpt => {
              return (
                <Select.Option value={dpt.value} key={dpt.value}>
                  {dpt.name}
                </Select.Option>
              );
            })}
            }
          </Select>
        </Form.Item>
      </Form>
    </div>
  );
};

export default InfirDetailForm = forwardRef(InfirDetailForm);

InfirDetailForm.propTypes = {};
InfirDetailForm.defaultProps = {};
