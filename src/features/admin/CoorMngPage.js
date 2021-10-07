import React, { useState, useMemo, useEffect } from 'react';
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
import { ModalWrapper } from './';
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { roles, showDate, antIcon } from '../../common/constants';
import { useDeleteUser, useGetmockData } from './redux/hooks';
import _ from 'lodash';

const { Option } = Select;
const { Search } = Input;

export default function CoorMngPage() {
  const [selectedRole, setSelectedRole] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentLine, setCurrentLine] = useState({});
  const [version, setVersion] = useState('');

  const mockData = [
    {
      coordinateurId: 1,
      coordinateurNom: 'chole',
      coordinateurTelephone: 698267199,
      userId: 6,
      updatedTime: '2021-10-04T08:47:47.000+00:00',
      isDeleted: 'N',
      createdTime: '2021-10-04T08:47:44.000+00:00',
    },
    {
      coordinateurId: 2,
      coordinateurNom: 'alice',
      coordinateurTelephone: 698267179,
      userId: 7,
      updatedTime: '2021-10-04T09:09:29.000+00:00',
      isDeleted: 'N',
      createdTime: '2021-10-04T09:09:29.000+00:00',
    },
  ];

  // useEffect(() => {
  //   getmockData();
  // }, [getmockData, version]);

  const handleVersionUpdate = () => {
    setVersion(new Date());
  };

  const handleRoleChange = value => {
    setSelectedRole(value);
  };

  const onSearch = value => {
    setSearchKey(value);
  };

  const usersToShow = useMemo(() => {
    if (_.isEmpty(mockData)) return null;
    let temp = mockData.filter(data => data.isDeleted === 'N');
    if (selectedRole && selectedRole !== 'Tous') {
      temp = temp.filter(data => {
        return data.userType === roles.indexOf(selectedRole);
      });
    }
    if (searchKey) {
      temp = temp.filter(data => _.includes(_.lowerCase(data.userNom), _.lowerCase(searchKey)));
    }
    return temp;
  }, [mockData, searchKey, selectedRole]);

  // const deleteConfirm = rc => {
  //   deleteUser({
  //     userId: rc.userId,
  //   })
  //     .then(() => {
  //       handleVersionUpdate();
  //       message.success('Supprimé avec succès', 5);
  //     })
  //     .catch(() => {
  //       message.error('Echec de la suppression', 5);
  //     });
  // };

  const onResetClick = () => {
    setSearchKey('');
    setSelectedRole('');
  };

  const onModalVisibleChange = visible => {
    setIsModalVisible(visible);
  };

  const columns = [
    {
      title: 'Coordinateur-ID',
      dataIndex: 'coordinateurId',
      key: 'coordinateurId',
      width: 80,
      render: (text, record) => {
        return (
          <div>
            {text}
            <div className="table-column-extra">User-ID: {record.userId}</div>
          </div>
        );
      },
    },
    {
      title: 'Nom',
      dataIndex: 'coordinateurNom',
      key: 'coordinateurNom',
      width: 160,
    },
    {
      title: 'Téléphone',
      dataIndex: 'coordinateurTelephone',
      key: 'coordinateurTelephone',
      width: 240,
      render: text => {
        let textStr = text.toString();
        return <span>(+33){textStr.length === 10 ? textStr.substring(0, 2) : 0}</span>;
      },
    },
    {
      title: 'Heure de création',
      dataIndex: 'createdTime',
      key: 'createdTime',
      width: 180,
      render: time => showDate(time),
    },
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
                  // deleteConfirm(record);
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
    <div className="admin-coor-mng-page">
      <div className="admin-coor-mng-page-header">
        <h1>Coordinateurs</h1>
        <Button
          type="primary"
          onClick={() => {
            setIsModalVisible(true);
            setCurrentLine({});
          }}
        >
          Créer un nouvel coordinateur
        </Button>
      </div>
      <ModalWrapper
        name="coordinateur"
        visible={isModalVisible}
        onModalVisibleChange={onModalVisibleChange}
        data={currentLine}
        handleVersionUpdate={handleVersionUpdate}
      />

      <div className="admin-coor-mng-page-table-header">
        <div className="admin-coor-mng-page-table-header-left">
          <Search
            className="search-bar"
            placeholder="Rechercher nom du coordinateur.."
            onSearch={onSearch}
            enterButton
          />
        </div>
        <div className="admin-coor-mng-page-table-header-right">
          <Button className="reset-btn" onClick={onResetClick}>
            Réinitialiser
          </Button>
        </div>
      </div>
      <Spin tip="Chargement en cours..." spinning={false} indicator={antIcon}>
        <Table
          size="middle"
          columns={columns}
          dataSource={usersToShow}
          pagination={paginationProps}
          rowKey={record => record.userId}
        />
        <div className="admin-coor-mng-page-footer">
          {!false ? (
            _.isEmpty(usersToShow) ? (
              'Pas de résultat répond aux critères de recherche'
            ) : usersToShow.length === 1 ? (
              'Seul 1 coordinateur répond répond aux critères de recherche'
            ) : (
              `${usersToShow.length} coordinateurs répondent aux critères de recherche`
            )
          ) : (
            <div className="error">Échec du chargement des données</div>
          )}
        </div>
      </Spin>
    </div>
  );
}

CoorMngPage.propTypes = {};
CoorMngPage.defaultProps = {};
