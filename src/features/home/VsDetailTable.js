import React, { useEffect, useState, useMemo, useRef } from 'react';
// import PropTypes from 'prop-types';
import { Table, Input, Button, Typography, Space, Popconfirm, message, Spin } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import _ from 'lodash';
import { showDate, antIcon } from '../../common/constants';
import ModalWrapper from '../common/ModalWrapper';
import { useGetPatientsList, useDeletePatient } from '../home/redux/hooks';
import { useFindVssByOrdId } from './redux/hooks';

export default function VsDetailTable(props) {
  const {
    dataSource,
    handleVersionUpdate,
    onCurrentLineChange,
    onModalVisibleChange,
    size,
    ordRecord,
  } = props;
  const { findVssByOrdId, findVssByOrdIdPending, findVssByOrdIdError } = useFindVssByOrdId();
  const [dataToShow, setDataToShow] = useState(null);
  const deleteConfirm = rc => {
    // deletePatient({
    //   patientId: rc.patientId,
    // })
    //   .then(() => {
    //     handleVersionUpdate();
    //     message.success('Supprimé avec succès', 5);
    //   })
    //   .catch(() => {
    //     message.error('Echec de la suppression', 5);
    //   });
  };

  useEffect(() => {
    if (!_.isEmpty(ordRecord)) {
      findVssByOrdId({
        ordonnanceId: ordRecord.ordonnanceId,
      }).then(res => {
        setDataToShow(res.data.ext.visites);
      });
    }
  }, [findVssByOrdId, ordRecord]);

  const columns = [
    {
      title: 'VID',
      dataIndex: 'visiteId',
      key: 'visiteId',
      width: 25,
    },
    {
      title: 'infirmiereId',
      dataIndex: 'infirmiereId',
      key: 'infirmiereId',
      width: 140,
    },
    {
      title: 'patientId',
      dataIndex: 'patientId',
      key: 'patientId',
    },
    {
      title: 'Date',
      dataIndex: 'visiteDate',
      key: 'visiteDate',
      width: 180,
      render: time => showDate(time),
    },
    {
      title: 'Heure de début',
      dataIndex: 'visiteHeureDebut',
      key: 'visiteHeureDebut',
      width: 180,
      render: time => showDate(time),
    },
    {
      title: 'Heure de fin',
      dataIndex: 'visiteHeureFin',
      key: 'visiteHeureFin',
      width: 180,
      render: time => showDate(time),
    },
    {
      title: 'Observation',
      dataIndex: 'visiteObservation',
      key: 'visiteObservation',
      width: 120,
    },
    {
      title: 'Etat',
      dataIndex: 'visiteEtat',
      key: 'visiteEtat',
      width: 120,
      render: text => {
        return text === 0 ? 'Pas commencé' : text === 1 ? 'En cours' : 'Fini';
      },
    },
    {
      title: 'coordinateurId',
      dataIndex: 'coordinateurId',
      key: 'coordinateurId',
      width: 120,
    },
    {
      title: 'modificateurRecent',
      dataIndex: 'modificateurRecent',
      key: 'modificateurRecent',
      width: 140,
    },
    // {
    //   title: 'Heure de création',
    //   dataIndex: 'createdTime',
    //   key: 'createdTime',
    //   width: 160,
    //   render: time => showDate(time),
    // },
    // {
    //   title: 'Heure mise à jour',
    //   dataIndex: 'updatedTime',
    //   key: 'updatedTime',
    //   width: 160,
    //   render: time => showDate(time),
    // },
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
                onModalVisibleChange(true);
                onCurrentLineChange(record);
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
    total: (dataSource && dataSource.length) || 0,
  };

  return (
    <div className="home-vs-detail-table">
      <Table
        size={size || 'middle'}
        columns={columns}
        dataSource={dataToShow || dataSource}
        pagination={paginationProps}
      />
    </div>
  );
}

VsDetailTable.propTypes = {};
VsDetailTable.defaultProps = {};
