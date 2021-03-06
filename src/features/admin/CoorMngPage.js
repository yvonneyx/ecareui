import React, { useState, useMemo, useEffect } from 'react';
// import PropTypes from 'prop-types';
import { Table, Input, Button, Typography, Space, Popconfirm, message, Spin } from 'antd';
import { ModalWrapper } from '../common';
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { showDate, antIcon } from '../../common/constants';
import { useDeleteCoor, useGetCoorsList } from './redux/hooks';
import { useLocation } from 'react-router-dom';
import _ from 'lodash';

const { Search } = Input;

export default function CoorMngPage(param) {
  const location = useLocation();
  const searchUserId = location.pathname.split('/')[3];
  const [searchKey, setSearchKey] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentLine, setCurrentLine] = useState({});
  const [version, setVersion] = useState('');
  const { coorsList, getCoorsList, getCoorsListPending, getCoorsListError } = useGetCoorsList();
  const { deleteCoor } = useDeleteCoor();
  const searchInput = React.useRef();

  useEffect(() => {
    getCoorsList();
  }, [getCoorsList, version]);

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
    if (_.isEmpty(coorsList)) return null;
    let temp = coorsList.filter(data => data.isDeleted === 'N');
    if (searchKey) {
      debugger;
      temp = temp.filter(
        data =>
          _.includes(_.lowerCase(data.coordinateurNom), _.lowerCase(searchKey)) ||
          _.includes(_.lowerCase(data.coordinateurId), _.lowerCase(searchKey)) ||
          _.includes(_.lowerCase(data.userId), _.lowerCase(searchKey)),
      );
    }
    return temp;
  }, [coorsList, searchKey]);

  const deleteConfirm = rc => {
    deleteCoor({
      coordinateurId: rc.coordinateurId,
    })
      .then(() => {
        handleVersionUpdate();
        message.success('Supprim?? avec succ??s', 5);
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
      title: 'CID',
      dataIndex: 'coordinateurId',
      key: 'coordinateurId',
      width: 25,
    },
    {
      title: 'Nom et Pr??nom',
      dataIndex: 'coordinateurNom',
      key: 'coordinateurNom',
    },
    {
      title: 'T??l??phone',
      dataIndex: 'coordinateurTelephone',
      key: 'coordinateurTelephone',
    },
    // {
    //   title: 'Heure de cr??ation',
    //   dataIndex: 'createdTime',
    //   key: 'createdTime',
    //   width: 180,
    //   render: time => showDate(time),
    // },
    {
      title: 'Heure mise ?? jour',
      dataIndex: 'updatedTime',
      key: 'updatedTime',
      width: 180,
      render: time => showDate(time),
    },
    {
      title: 'Op??ration',
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
                title="??tes-vous s??r de supprimer cet coordinateur?"
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
    <div className="admin-coor-mng-page">
      <div className="admin-coor-mng-page-header">
        <h1>Coordinateurs</h1>
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
            placeholder="Rechercher nom du coordinateur ou UID.."
            onSearch={onSearch}
            enterButton
            ref={searchInput}
          />
        </div>
        <div className="admin-coor-mng-page-table-header-right">
          <Button className="reset-btn" onClick={onResetClick}>
            R??initialiser
          </Button>
        </div>
      </div>
      <Spin tip="Chargement en cours..." spinning={getCoorsListPending} indicator={antIcon}>
        <Table
          size="middle"
          columns={columns}
          dataSource={usersToShow}
          pagination={paginationProps}
          rowKey={record => record.userId}
        />
        <div className="admin-coor-mng-page-footer">
          {!getCoorsListError ? (
            _.isEmpty(usersToShow) ? (
              'Pas de r??sultat r??pond aux crit??res de recherche'
            ) : usersToShow.length === 1 ? (
              'Seul 1 coordinateur r??pond r??pond aux crit??res de recherche'
            ) : (
              `${usersToShow.length} coordinateurs r??pondent aux crit??res de recherche`
            )
          ) : (
            <div className="error">??chec du chargement des donn??es</div>
          )}
        </div>
      </Spin>
    </div>
  );
}

CoorMngPage.propTypes = {};
CoorMngPage.defaultProps = {};
