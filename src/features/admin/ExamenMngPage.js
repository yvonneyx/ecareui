import React, { useEffect, useState, useMemo } from 'react';
// import PropTypes from 'prop-types';
import {
  Table,
  Tag,
  Select,
  Input,
  Button,
  Typography,
  Space,
  Popconfirm,
  message,
  Spin,
} from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import _ from 'lodash';
import { showDate } from '../../common/constants';
import ModalWrapper from './ModalWrapper';
import { useGetExamensList, useDeleteExamen } from './redux/hooks';

const { Search } = Input;

export default function ExamenMngPage(props) {
  const [searchKey, setSearchKey] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentLine, setCurrentLine] = useState({});
  const [version, setVersion] = useState('');
  const {
    examensList,
    getExamensList,
    getExamensListPending,
    getExamensListError,
  } = useGetExamensList();
  const { deleteExamen } = useDeleteExamen();

  useEffect(() => {
    getExamensList();
  }, [getExamensList, version]);

  const emToShow = useMemo(() => {
    let temp;
    if (_.isEmpty(examensList)) return null;
    temp = examensList.filter(data => data.isDeleted === 'N');
    if (!_.isEmpty(searchKey)) {
      temp = temp.filter(data =>
        _.includes(_.lowerCase(data.examenMedicalNom), _.lowerCase(searchKey)),
      );
    }
    return temp;
  }, [examensList, searchKey]);

  const handleVersionUpdate = () => {
    setVersion(new Date());
  };

  const onSearch = value => {
    setSearchKey(value);
  };

  const deleteConfirm = rc => {
    deleteExamen({
      examenMedicalId: rc.examenMedicalId,
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
  };

  const onModalVisibleChange = visible => {
    setIsModalVisible(visible);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'examenMedicalId',
      key: 'examenMedicalId',
      width: 80,
    },
    {
      title: 'Nom',
      dataIndex: 'examenMedicalNom',
      key: 'examenMedicalNom',
      ellipsis: true,
    },
    {
      title: 'Prix',
      dataIndex: 'examenMedicalPrix',
      key: 'examenMedicalPrix',
      width: 120,
      render: text => <span>{text}€</span>,
    },
    {
      title: 'Heure de création',
      dataIndex: 'createdTime',
      key: 'createdTime',
      width: 220,
      render: time => showDate(time),
    },
    {
      title: 'Heure mise à jour',
      dataIndex: 'updatedTime',
      key: 'updatedTime',
      width: 220,
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
    <div className="admin-examen-mng-page">
      <div className="admin-examen-mng-page-header">
        <h1>Examens médicaux</h1>
        <Button
          type="primary"
          onClick={() => {
            setIsModalVisible(true);
            setCurrentLine({});
          }}
        >
          Ajouter un nouvel examen medical
        </Button>
      </div>
      <ModalWrapper
        name="examen"
        visible={isModalVisible}
        onModalVisibleChange={onModalVisibleChange}
        data={currentLine}
        handleVersionUpdate={handleVersionUpdate}
      />

      <div className="admin-examen-mng-page-table-header">
        <div className="admin-examen-mng-page-table-header-left">
          <Search
            className="search-bar"
            placeholder="Rechercher par nom d'examen medical.."
            onSearch={onSearch}
            enterButton
          />
        </div>
        <div className="admin-examen-mng-page-table-header-right">
          <Button className="reset-btn" onClick={onResetClick}>
            Réinitialiser
          </Button>
        </div>
      </div>
      <Spin tip="Chargement en cours..." spinning={getExamensListPending}>
        <Table size="middle" columns={columns} dataSource={emToShow} pagination={paginationProps} />
        <div className="admin-examen-mng-page-footer">
          {!getExamensListError ? (
            (emToShow || {}).length > 1 ? (
              `${emToShow.length} examens medicaux répondent aux critères de
          recherche`
            ) : (
              `${(emToShow || {}).length} examen medical répondent aux critères de
          recherche`
            )
          ) : (
            <div className="error">Échec du chargement des données</div>
          )}
        </div>
      </Spin>
    </div>
  );
}

ExamenMngPage.propTypes = {};
ExamenMngPage.defaultProps = {};