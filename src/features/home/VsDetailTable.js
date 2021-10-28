import React, { useEffect, useState, useMemo, useRef } from 'react';
// import PropTypes from 'prop-types';
import { Table, Input, Button, Typography, Space, Popconfirm, message, Spin } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import _ from 'lodash';
import {
  showDate,
  antIcon,
  showOnlyDate,
  showOnlyTime,
  showOnlySimpleDate,
  showOnlySimpleTime,
} from '../../common/constants';
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
    pageSize,
    showQuickStartAndDetail,
    target,
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
      title: 'infirmiere',
      dataIndex: 'infirmiereNom',
      key: 'infirmiereNom',
      width: 120,
    },
    {
      title: 'patient',
      dataIndex: 'patientNom',
      key: 'patientNom',
      width: 120,
    },
    {
      title: 'État',
      dataIndex: 'visiteEtat',
      key: 'visiteEtat',
      width: 140,
      render: text => {
        return text === 0 ? 'Pas commencé' : text === 1 ? 'En cours' : 'Fini';
      },
    },
    {
      title: 'Observation',
      dataIndex: 'visiteObservation',
      key: 'visiteObservation',
      width: 240,
      render: text => (!_.isEmpty(text) ? text : '--'),
    },
    {
      title: 'Date',
      dataIndex: 'visiteDate',
      key: 'visiteDate',
      width: 280,
      render: (text, record) => {
        return (
          <div>
            {showOnlyDate(text)}{' '}
            <div>
              {' '}
              {!_.isEmpty(record.visiteHeureDebut) ? showOnlyTime(record.visiteHeureDebut) : '--'}
              {' ~ '}
              {!_.isEmpty(record.visiteHeureFin) ? showOnlyTime(record.visiteHeureFin) : '--'}
            </div>
          </div>
        );
      },
    },
    // {
    //   title: 'Heure de début',
    //   dataIndex: 'visiteHeureDebut',
    //   key: 'visiteHeureDebut',
    //   width: 180,
    //   render: time => (!_.isEmpty(time) ? showOnlySimpleTime(time) : '--'),
    // },
    // {
    //   title: 'Heure de fin',
    //   dataIndex: 'visiteHeureFin',
    //   key: 'visiteHeureFin',
    //   width: 180,
    //   render: time => (!_.isEmpty(time) ? showOnlySimpleTime(time) : '--'),
    // },

    {
      title: 'coordinateur',
      dataIndex: 'coordinateurNom',
      key: 'coordinateurNom',
      width: 120,
    },
    {
      title: 'Dernière modification par',
      dataIndex: 'modificateurRecentNom',
      key: 'modificateurRecentNom',
      width: 180,
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
      width: 180,
      render: (text, record) => {
        if (showQuickStartAndDetail) {
          return (
            <Space size="middle">
              <Typography.Link
                href={`/${target}/ordonnance/${record.ordonnanceId}/visite/${record.visiteId}`}
              >
                Voir les détails
              </Typography.Link>
            </Space>
          );
        } else {
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
        }
      },
    },
  ];

  // if(target === 'infirmiere'){
  //   columns
  // }

  const paginationProps = {
    pageSize: pageSize || 8,
    total: (dataSource && dataSource.length) || 0,
  };

  return (
    <div className="home-vs-detail-table">
      <Table
        rowKey="visiteId"
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
