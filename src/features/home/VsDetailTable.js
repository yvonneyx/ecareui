import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { Table, Typography, Space, Popconfirm, message, Spin } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import _ from 'lodash';
import { showOnlyDate, showOnlyTime, showDate } from '../../common/constants';
import ModalWrapper from '../common/ModalWrapper';
import { useGetPatientsList, useDeletePatient } from '../home/redux/hooks';
import { useFindVssByOrdId } from './redux/hooks';
import moment from 'moment';

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
    showSimpleColumns,
    target,
    setShowRdv,
    setPrevCoorId,
  } = props;
  const { findVssByOrdId, findVssByOrdIdPending, findVssByOrdIdError } = useFindVssByOrdId();
  const [dataToShow, setDataToShow] = useState(null);
  const [allVssFinished, setAllVssFinished] = useState(false);

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
        let visites = res.data.ext && res.data.ext.visites;
        setDataToShow(visites);
      });
    }
  }, [findVssByOrdId, ordRecord]);

  useEffect(() => {
    if (!_.isEmpty(dataToShow)) {
      setShowRdv(
        _.isEqual(
          _.filter(dataToShow, vs => vs.visiteEtat === 2),
          dataToShow,
        ),
      );
      setPrevCoorId(dataToShow[0].coordinateurId);
    }
  }, [dataToShow, setShowRdv, setPrevCoorId]);

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
      width: 200,
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
      title: 'Examen médical',
      dataIndex: 'examNom',
      key: 'examNom',
      width: 240,
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
      dataIndex: 'visiteHeureDebut',
      key: 'visiteHeureDebut',
      width: 280,
      render: (text, record) =>
        _.upperFirst(
          moment(text)
            .locale('fr')
            .format('lll'),
        ),
    },
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

  if (target === 'infirmiere' && showSimpleColumns) {
    _.pullAt(columns, [0, 1, 3, 5, 8]);
  }

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
