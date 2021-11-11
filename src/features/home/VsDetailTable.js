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
import { GetColumnSearchProps as getColumnSearchProps } from '../common';
import { VsPatientPeForm, VsPatientEmForm } from '../home';

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
    columnsDisplayStatus,
    target,
    setShowRdv,
    setPrevCoorId,
    needExpand,
  } = props;
  const { findVssByOrdId, findVssByOrdIdPending, findVssByOrdIdError } = useFindVssByOrdId();
  const [dataToShow, setDataToShow] = useState(null);

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

  const filterOptions = [
    { text: 'Pas commencé', value: 0 },
    { text: 'En cours', value: 1 },
    {
      text: 'Fini',
      value: 2,
    },
  ];

  const getColumnFilterProps = dataIndex => ({
    filters: filterOptions,
    onFilter: (value, record) => record[dataIndex] === value,
  });

  const columns = [
    {
      title: 'VID',
      dataIndex: 'visiteId',
      key: 'visiteId',
      width: 40,
      sorter: (a, b) => a.visiteId - b.visiteId,
      defaultSortOrder: 'ascend',
    },
    {
      title: 'infirmiere',
      dataIndex: 'infirmiereNom',
      key: 'infirmiereNom',
      width: 200,
      ...getColumnSearchProps('infirmiereNom'),
    },
    {
      title: 'patient',
      dataIndex: 'patientNom',
      key: 'patientNom',
      width: 120,
      ...getColumnSearchProps('patientNom'),
    },
    {
      title: 'État',
      dataIndex: 'visiteEtat',
      key: 'visiteEtat',
      width: 140,
      render: text => {
        return text === 0 ? 'Pas commencé' : text === 1 ? 'En cours' : 'Fini';
      },
      ...getColumnFilterProps('visiteEtat'),
    },
    {
      title: 'Examen médical',
      dataIndex: 'examNom',
      key: 'examNom',
      width: 240,
      ...getColumnSearchProps('examNom'),
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
      sorter: (a, b) => moment(a.visiteHeureDebut) - moment(b.visiteHeureDebut),
    },
    {
      title: 'coordinateur',
      dataIndex: 'coordinateurNom',
      key: 'coordinateurNom',
      width: 120,
      ...getColumnSearchProps('coordinateurNom'),
    },
    {
      title: 'Dernière modification par',
      dataIndex: 'modificateurRecentNom',
      key: 'modificateurRecentNom',
      width: 180,
      ...getColumnSearchProps('modificateurRecentNom'),
    },
    {
      title: 'Opération',
      dataIndex: 'operation',
      key: 'operation',
      width: 180,
      render: (text, record) => {
        return (
          <Space size="middle">
            <Typography.Link
              href={`/${target}/ordonnance/${record.ordonnanceId}/visite/${record.visiteId}`}
            >
              Voir les détails
            </Typography.Link>
          </Space>
        );
      },
    },
  ];

  if (target === 'infirmiere' && columnsDisplayStatus === 'simple') {
    _.pullAt(columns, [0, 1, 3, 5, 8]);
  }

  if (!showQuickStartAndDetail) {
    _.pullAt(columns, [9]);
  }

  const paginationProps = {
    pageSize: pageSize || 8,
    total: (dataSource && dataSource.length) || 0,
  };

  const expandable = {
    expandedRowRender: record => (
      <div className="expanded-container">
        <VsPatientPeForm foundVs={record} />
        <VsPatientEmForm foundVs={record} />
      </div>
    ),
  };

  return (
    <div className="home-vs-detail-table">
      <Table
        rowKey="visiteId"
        size={size || 'middle'}
        columns={columns}
        dataSource={dataToShow || dataSource}
        pagination={paginationProps}
        expandable={needExpand && expandable}
      />
    </div>
  );
}

VsDetailTable.propTypes = {};
VsDetailTable.defaultProps = {};
