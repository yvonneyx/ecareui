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
import { UserModalWrapper } from './';
import { UserDeleteOutlined, EditOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { roles } from '../../common/constants';
import moment from 'moment';
import 'moment/locale/fr';
import { useDeleteUser, useGetUsersList } from './redux/hooks';

const { Option } = Select;
const { Search } = Input;

export default function UserMngPage() {
  const [selectedRole, setSelectedRole] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentLine, setCurrentLine] = useState({});
  const { deleteUser, deleteUserPending } = useDeleteUser();
  const { usersList, getUsersList, getUsersListPending, getUsersListError } = useGetUsersList();
  const [version, setVersion] = useState('');

  useEffect(() => {
    debugger;
    getUsersList();
  }, [getUsersList, version]);

  const handleVersionUpdate = () => {
    debugger;
    setVersion(new Date());
  };

  const handleRoleChange = value => {
    setSelectedRole(value);
  };

  const onSearch = value => {
    setSearchKey(value);
  };

  const usersToShow = useMemo(() => {
    if (!usersList) return null;
    let temp = usersList.filter(data => data.isDeleted === 'N');
    if (selectedRole && selectedRole !== 'Tous') {
      temp = temp.filter(data => {
        return data.userType === roles.indexOf(selectedRole);
      });
    }
    if (searchKey) {
      temp = temp.filter(data => {
        return data.userNom.includes(searchKey);
      });
    }
    return temp;
  }, [usersList, searchKey, selectedRole]);

  const deleteConfirm = rc => {
    deleteUser({
      userId: rc.userId,
    })
      .then(() => {
        handleVersionUpdate();
        message.success('Supprimé avec succès', 5);
      })
      .catch(() => {
        message.error('Echec de la suppression', 5);
      });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 80,
    },
    {
      title: 'Nom',
      dataIndex: 'userNom',
      key: 'userNom',
      width: 160,
    },
    {
      title: 'Mot de passe',
      dataIndex: 'userPassword',
      key: 'userPassword',
      width: 240,
      ellipsis: true,
    },
    {
      title: 'Heure de création',
      dataIndex: 'createdTime',
      key: 'createdTime',
      width: 180,
      render: time => (
        <>
          <div>
            {moment(time)
              .locale('fr')
              .format('MMMM Do YYYY')}
          </div>
          <div>
            {moment(time)
              .locale('fr')
              .format('h:mm:ss a')}
          </div>
        </>
      ),
    },
    {
      title: 'Heure mise à jour',
      dataIndex: 'updatedTime',
      key: 'updatedTime',
      width: 180,
      render: time => (
        <>
          <div>
            {moment(time)
              .locale('fr')
              .format('MMMM Do YYYY')}
          </div>
          <div>
            {moment(time)
              .locale('fr')
              .format('h:mm:ss a')}
          </div>
        </>
      ),
    },
    {
      title: 'Rôle',
      dataIndex: 'userType',
      key: 'userType',
      render: role => {
        let color = role === 0 ? 'geekblue' : role === 1 ? 'cyan' : 'gold';
        return <Tag color={color}>{roles[role]}</Tag>;
      },
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
                title="Êtes-vous sûr de supprimer cet utilisateur?"
                onConfirm={() => {
                  deleteConfirm(record);
                }}
                okText="Oui, je confirme"
                cancelText="Non"
              >
                <UserDeleteOutlined />
              </Popconfirm>
            </Typography.Link>
          </Space>
        );
      },
    },
  ];

  const onResetClick = () => {
    setSearchKey('');
    setSelectedRole('');
  };

  const onModalVisibleChange = visible => {
    setIsModalVisible(visible);
  };

  const paginationProps = {
    pageSize: 8,
    // current: this.state.pageNum,
    total: usersToShow && usersToShow.length,
    // onChange: (current) => this.changePage(current),
  };

  return (
    <div className="admin-user-mng-page">
      <div className="admin-user-mng-page-header">
        <h1>Utilisateurs</h1>
        <Button
          type="primary"
          onClick={() => {
            setIsModalVisible(true);
            setCurrentLine({});
          }}
        >
          Créer un nouvel utilisateur
        </Button>
      </div>
      <UserModalWrapper
        visible={isModalVisible}
        onModalVisibleChange={onModalVisibleChange}
        data={currentLine}
        handleVersionUpdate={handleVersionUpdate}
      />

      <div className="admin-user-mng-page-table-header">
        <div className="admin-user-mng-page-table-header-left">
          <Select className="role-selector" onChange={handleRoleChange} placeholder="Choisir rôle">
            {roles.map(role => {
              return (
                <Option value={role} key={roles.indexOf(role)}>
                  {role}
                </Option>
              );
            })}
          </Select>
          <Search
            className="search-bar"
            placeholder="Rechercher nom d'utilisateur.."
            onSearch={onSearch}
            enterButton
          />
        </div>
        <div className="admin-user-mng-page-table-header-right">
          <Button className="reset-btn" onClick={onResetClick}>
            Réinitialiser
          </Button>
        </div>
      </div>
      <Spin tip="Loading..." spinning={getUsersListPending || deleteUserPending}>
        <Table
          size="middle"
          columns={columns}
          dataSource={usersToShow}
          pagination={paginationProps}
        />
        <div className="admin-user-mng-page-footer">
          {!getUsersListError
            ? `${(usersToShow || {}).length} utilisateurs répondent aux critères de
          recherche`
            : 'Échec du chargement des données'}
        </div>
      </Spin>
    </div>
  );
}

UserMngPage.propTypes = {};
UserMngPage.defaultProps = {};
