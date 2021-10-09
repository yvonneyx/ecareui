import React, { useEffect, useState, useMemo, useRef } from 'react';
// import PropTypes from 'prop-types';
import { Table, Input, Button, Typography, Space, Popconfirm, message, Spin } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import _ from 'lodash';
import { showDate, antIcon } from '../../common/constants';
import ModalWrapper from './ModalWrapper';
import { useGetPatientsList, useDeletePatient } from './redux/hooks';

const { Search } = Input;

export default function PatientMngPage(props) {
  const [searchKey, setSearchKey] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentLine, setCurrentLine] = useState({});
  const [version, setVersion] = useState('');
  const {
    patientsList,
    getPatientsList,
    getPatientsListPending,
    getPatientsListError,
  } = useGetPatientsList();
  const { deletePatient } = useDeletePatient();
  const searchInput = useRef();

  useEffect(() => {
    getPatientsList();
  }, [getPatientsList, version]);

  const emToShow = useMemo(() => {
    let temp;
    if (_.isEmpty(patientsList)) return null;
    temp = patientsList.filter(data => data.isDeleted === 'N');
    if (!_.isEmpty(searchKey)) {
      temp = temp.filter(data => _.includes(_.lowerCase(data.patientNom), _.lowerCase(searchKey)));
    }
    return temp;
  }, [patientsList, searchKey]);

  const handleVersionUpdate = () => {
    setVersion(new Date());
  };

  const onSearch = value => {
    setSearchKey(value);
  };

  const deleteConfirm = rc => {
    deletePatient({
      patientId: rc.patientId,
    })
      .then(() => {
        handleVersionUpdate();
        message.success('Supprimé avec succès', 5);
      })
      .catch(() => {
        message.error('Echec de la suppression', 5);
      });
  };

  const onResetClick = () => {
    setSearchKey('');
    if (searchInput.current) searchInput.current.state.value = '';
  };

  const onModalVisibleChange = visible => {
    setIsModalVisible(visible);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'patientId',
      key: 'patientId',
      width: 25,
    },
    {
      title: 'Nom et prénom',
      dataIndex: 'patientNom',
      key: 'patientNom',
      width: 120,
    },
    {
      title: 'Téléphone',
      dataIndex: 'patientTelephone',
      key: 'patientTelephone',
      width: 120,
    },
    {
      title: 'Addresse',
      dataIndex: 'patientAddresse',
      key: 'patientAddresse',
    },
    {
      title: 'Date de naissance',
      dataIndex: 'patientNaissance',
      key: 'patientNaissance',
      width: 140,
    },
    {
      title: 'Sexe',
      dataIndex: 'patientSexe',
      key: 'patientSexe',
      width: 80,
      render: text => <span>{text === 0 ? 'Male' : 'Female'}</span>,
    },
    {
      title: 'Heure de création',
      dataIndex: 'createdTime',
      key: 'createdTime',
      width: 160,
      render: time => showDate(time),
    },
    {
      title: 'Heure mise à jour',
      dataIndex: 'updatedTime',
      key: 'updatedTime',
      width: 160,
      render: time => showDate(time),
    },
    {
      title: 'Opération',
      dataIndex: 'operation',
      key: 'operation',
      width: 120,
      render: (text, record) => {
        return (
          <Space size="middle">
            <Typography.Link
              onClick={() => {
                setIsModalVisible(true);
                setCurrentLine(record);
              }}
            >
              <EditOutlined />
            </Typography.Link>
            <Typography.Link>
              <Popconfirm
                icon={<ExclamationCircleFilled style={{ color: 'var(--first-color)' }} />}
                title="Êtes-vous sûr de supprimer cet examen medical?"
                onConfirm={() => {
                  deleteConfirm(record);
                }}
                okText="Oui, je confirme"
                cancelText="Non"
                placement="left"
              >
                <DeleteOutlined />
              </Popconfirm>
            </Typography.Link>
          </Space>
        );
      },
    },
  ];

  const paginationProps = {
    pageSize: 8,
    total: (emToShow && emToShow.length) || 0,
  };

  return (
    <div className="admin-patient-mng-page">
      <div className="admin-patient-mng-page-header">
        <h1>Patients</h1>
        <Button
          type="primary"
          onClick={() => {
            setIsModalVisible(true);
            setCurrentLine({});
          }}
        >
          Ajouter un nouvel patient
        </Button>
      </div>
      <ModalWrapper
        name="patient"
        visible={isModalVisible}
        onModalVisibleChange={onModalVisibleChange}
        data={currentLine}
        handleVersionUpdate={handleVersionUpdate}
      />

      <div className="admin-patient-mng-page-table-header">
        <div className="admin-patient-mng-page-table-header-left">
          <Search
            className="search-bar"
            placeholder="Rechercher par nom de patient.."
            onSearch={onSearch}
            enterButton
            ref={searchInput}
          />
        </div>
        <div className="admin-patient-mng-page-table-header-right">
          <Button className="reset-btn" onClick={onResetClick}>
            Réinitialiser
          </Button>
        </div>
      </div>
      <Spin tip="Chargement en cours..." spinning={getPatientsListPending} indicator={antIcon}>
        <Table size="middle" columns={columns} dataSource={emToShow} pagination={paginationProps} />
        <div className="admin-patient-mng-page-footer">
          {!getPatientsListError ? (
            _.isEmpty(emToShow) ? (
              'Pas de résultat répond aux critères de recherche'
            ) : emToShow.length === 1 ? (
              'Seul 1 examen medical répond aux critères de recherche'
            ) : (
              `${emToShow.length} patients répondent aux critères de recherche`
            )
          ) : (
            <div className="error">Échec du chargement des données</div>
          )}
        </div>
      </Spin>
    </div>
  );
}

PatientMngPage.propTypes = {};
PatientMngPage.defaultProps = {};
