import React, { useState, useMemo, useEffect } from 'react';
// import PropTypes from 'prop-types';
import { Table, Input, Button, Typography, Space, Popconfirm, message, Spin } from 'antd';
import { ModalWrapper } from '../common';
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { showDate, antIcon } from '../../common/constants';
import { useGetInfirmieresList, useDeleteInfirmiere, useGetDptsList } from './redux/hooks';
import { useLocation } from 'react-router-dom';
import _ from 'lodash';

const { Search } = Input;

export default function InfirMngPage() {
  const location = useLocation();
  const searchUserId = location.pathname.split('/')[3];
  const [searchKey, setSearchKey] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentLine, setCurrentLine] = useState({});
  const [version, setVersion] = useState('');
  const {
    infirmieresList,
    getInfirmieresList,
    getInfirmieresListPending,
    getInfirmieresListError,
  } = useGetInfirmieresList();
  const { deleteInfirmiere } = useDeleteInfirmiere();
  const searchInput = React.useRef();
  const { dptsList, getDptsList, getDptsListPending } = useGetDptsList();

  useEffect(() => {
    getInfirmieresList();
  }, [getInfirmieresList, version]);

  useEffect(() => {
    // if (_.isEmpty(dptsList)) {
    getDptsList();
    // }
  }, [getDptsList]);

  useEffect(() => {
    if (!_.isEmpty(searchUserId)) {
      setSearchKey(searchUserId);
      if (searchInput.current) {
        searchInput.current.state.value = searchUserId;
      }
    }
  }, [searchUserId]);

  const handleVersionUpdate = () => {
    setVersion(new Date());
  };

  const onSearch = value => {
    setSearchKey(value);
  };

  const usersToShow = useMemo(() => {
    if (_.isEmpty(infirmieresList)) return null;
    let temp = infirmieresList.filter(data => data.isDeleted === 'N');
    if (searchKey) {
      temp = temp.filter(
        data =>
          _.includes(_.lowerCase(data.infirmiereNom), _.lowerCase(searchKey)) ||
          _.includes(_.lowerCase(data.userId), _.lowerCase(searchKey)),
      );
    }
    return temp;
  }, [infirmieresList, searchKey]);

  const deleteConfirm = rc => {
    deleteInfirmiere({
      coordinateurId: rc.coordinateurId,
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
      title: 'UID',
      dataIndex: 'userId',
      key: 'userId',
      width: 25,
    },
    {
      title: 'IID',
      dataIndex: 'infirmiereId',
      key: 'infirmiereId',
      width: 25,
    },
    {
      title: 'Nom et Prénom',
      dataIndex: 'infirmiereNom',
      key: 'infirmiereNom',
    },
    {
      title: 'Téléphone',
      dataIndex: 'infirmiereTelephone',
      key: 'infirmiereTelephone',
    },
    {
      title: 'Département concerné',
      dataIndex: 'departementId',
      key: 'departementId',
      render: dptId => (
        <span>
          {dptsList && dptsList.filter(dpt => dpt.departementId === dptId)[0].departementNom}
        </span>
      ),
    },
    // {
    //   title: 'Heure de création',
    //   dataIndex: 'createdTime',
    //   key: 'createdTime',
    //   width: 180,
    //   render: time => showDate(time),
    // },
    {
      title: 'Heure mise à jour',
      dataIndex: 'updatedTime',
      key: 'updatedTime',
      width: 180,
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
                title="Êtes-vous sûr de supprimer cet coordinateur?"
                onConfirm={() => {
                  deleteConfirm(record);
                }}
                okText="Oui, je confirme"
                cancelText="Non"
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
    total: usersToShow && usersToShow.length,
  };

  return (
    <div className="admin-infir-mng-page">
      <div className="admin-infir-mng-page-header">
        <h1>Infirmières</h1>
      </div>
      <ModalWrapper
        name="infirmiere"
        visible={isModalVisible}
        onModalVisibleChange={onModalVisibleChange}
        data={currentLine}
        handleVersionUpdate={handleVersionUpdate}
        dptsList={dptsList}
      />

      <div className="admin-infir-mng-page-table-header">
        <div className="admin-infir-mng-page-table-header-left">
          <Search
            className="search-bar"
            placeholder="Rechercher par nom d'infirmière ou UID.."
            onSearch={onSearch}
            enterButton
            ref={searchInput}
          />
        </div>
        <div className="admin-infir-mng-page-table-header-right">
          <Button className="reset-btn" onClick={onResetClick}>
            Réinitialiser
          </Button>
        </div>
      </div>
      <Spin
        tip="Chargement en cours..."
        spinning={getInfirmieresListPending || getDptsListPending}
        indicator={antIcon}
      >
        <Table
          size="middle"
          columns={columns}
          dataSource={usersToShow}
          pagination={paginationProps}
          rowKey={record => record.userId}
        />
        <div className="admin-infir-mng-page-footer">
          {!getInfirmieresListError ? (
            _.isEmpty(usersToShow) ? (
              'Pas de résultat répond aux critères de recherche'
            ) : usersToShow.length === 1 ? (
              'Seul 1 infirmière répond répond aux critères de recherche'
            ) : (
              `${usersToShow.length} infirmières répondent aux critères de recherche`
            )
          ) : (
            <div className="error">Échec du chargement des données</div>
          )}
        </div>
      </Spin>
    </div>
  );
}

InfirMngPage.propTypes = {};
InfirMngPage.defaultProps = {};
