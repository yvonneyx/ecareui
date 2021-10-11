import React, { useEffect, useState, useMemo, useRef } from 'react';
// import PropTypes from 'prop-types';
import { Table, Input, Button, Typography, Space, Popconfirm, message, Spin } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import _ from 'lodash';
import { showDate, antIcon } from '../../common/constants';
import ModalWrapper from '../common/ModalWrapper';
import { useGetVisitesList, useDeletePatient } from '../home/redux/hooks';
import { VsDetailTable } from './';

const { Search } = Input;

export default function VsMngPage(props) {
  const [searchKey, setSearchKey] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentLine, setCurrentLine] = useState({});
  const [version, setVersion] = useState('');
  const {
    // visitesList,
    // getVisitesList,
    getVisitesListPending,
    getVisitesListError,
  } = useGetVisitesList();
  // const { deletePatient } = useDeletePatient();
  const searchInput = useRef();

  // useEffect(() => {
  //   getVisitesList();
  // }, [getVisitesList, version]);

  const visitesList= [
    {
      "visiteId": 1,
      "visiteDate": "2021-10-03T22:00:00.000+00:00",
      "visiteHeureDebut": "2021-10-04T13:28:36.000+00:00",
      "visiteHeureFin": "2021-10-04T16:28:53.000+00:00",
      "visiteObservation": "ok",
      "visiteEtat": 0,
      "coordinateurId": 1,
      "patientId": 1,
      "infirmiereId": 1,
      "modificateurRecent": 6,
      "updatedTime": "2021-10-04T13:30:43.000+00:00",
      "isDeleted": "N",
      "createdTime": "2021-10-04T13:30:43.000+00:00"
    },
    {
      "visiteId": 2,
      "visiteDate": "2021-10-03T22:00:00.000+00:00",
      "visiteHeureDebut": "2021-10-04T19:20:35.000+00:00",
      "visiteHeureFin": "2021-10-04T20:20:40.000+00:00",
      "visiteObservation": "ok",
      "visiteEtat": 0,
      "coordinateurId": 1,
      "patientId": 1,
      "infirmiereId": 1,
      "modificateurRecent": 6,
      "updatedTime": "2021-10-04T19:21:11.000+00:00",
      "isDeleted": "N",
      "createdTime": "2021-10-04T19:21:07.000+00:00"
    },
    {
      "visiteId": 3,
      "visiteDate": "2021-10-04T22:00:00.000+00:00",
      "visiteHeureDebut": "2021-10-05T19:20:35.000+00:00",
      "visiteHeureFin": "2021-10-05T20:20:40.000+00:00",
      "visiteObservation": "ok",
      "visiteEtat": 0,
      "coordinateurId": 1,
      "patientId": 1,
      "infirmiereId": 1,
      "modificateurRecent": 6,
      "updatedTime": "2021-10-04T19:27:39.000+00:00",
      "isDeleted": "N",
      "createdTime": "2021-10-04T19:27:39.000+00:00"
    },
    {
      "visiteId": 4,
      "visiteDate": "2021-10-05T22:00:00.000+00:00",
      "visiteHeureDebut": "2021-10-06T19:20:35.000+00:00",
      "visiteHeureFin": "2021-10-06T20:20:40.000+00:00",
      "visiteObservation": "ok",
      "visiteEtat": 0,
      "coordinateurId": 1,
      "patientId": 1,
      "infirmiereId": 1,
      "modificateurRecent": 6,
      "updatedTime": "2021-10-04T19:27:45.000+00:00",
      "isDeleted": "N",
      "createdTime": "2021-10-04T19:27:45.000+00:00"
    },
    {
      "visiteId": 5,
      "visiteDate": "2021-10-08T22:00:00.000+00:00",
      "visiteHeureDebut": "2021-10-08T19:20:35.000+00:00",
      "visiteHeureFin": "2021-10-08T20:20:40.000+00:00",
      "visiteObservation": "very good",
      "visiteEtat": 0,
      "coordinateurId": 1,
      "patientId": 1,
      "infirmiereId": 1,
      "modificateurRecent": 6,
      "updatedTime": "2021-10-04T19:32:29.000+00:00",
      "isDeleted": "N",
      "createdTime": "2021-10-04T19:32:29.000+00:00"
    },
    {
      "visiteId": 6,
      "visiteDate": "2021-10-23T22:00:00.000+00:00",
      "visiteHeureDebut": "2021-10-10T18:04:23.000+00:00",
      "visiteHeureFin": null,
      "visiteObservation": null,
      "visiteEtat": 0,
      "coordinateurId": 1,
      "patientId": null,
      "infirmiereId": 1,
      "modificateurRecent": null,
      "updatedTime": "2021-10-10T18:04:25.000+00:00",
      "isDeleted": "N",
      "createdTime": "2021-10-10T18:04:25.000+00:00"
    },
    {
      "visiteId": 7,
      "visiteDate": "2021-10-09T22:00:00.000+00:00",
      "visiteHeureDebut": "2021-10-10T19:03:20.000+00:00",
      "visiteHeureFin": null,
      "visiteObservation": null,
      "visiteEtat": 0,
      "coordinateurId": 1,
      "patientId": 1,
      "infirmiereId": 5,
      "modificateurRecent": 1,
      "updatedTime": "2021-10-10T19:03:20.000+00:00",
      "isDeleted": "N",
      "createdTime": "2021-10-10T19:03:20.000+00:00"
    },
    {
      "visiteId": 8,
      "visiteDate": "2021-10-09T22:00:00.000+00:00",
      "visiteHeureDebut": "2021-10-10T19:09:23.000+00:00",
      "visiteHeureFin": null,
      "visiteObservation": null,
      "visiteEtat": 0,
      "coordinateurId": 1,
      "patientId": 1,
      "infirmiereId": 1,
      "modificateurRecent": 1,
      "updatedTime": "2021-10-10T19:09:23.000+00:00",
      "isDeleted": "N",
      "createdTime": "2021-10-10T19:09:23.000+00:00"
    },
    {
      "visiteId": 9,
      "visiteDate": "2021-10-09T22:00:00.000+00:00",
      "visiteHeureDebut": "2021-10-10T19:09:48.000+00:00",
      "visiteHeureFin": null,
      "visiteObservation": null,
      "visiteEtat": 0,
      "coordinateurId": 1,
      "patientId": 1,
      "infirmiereId": 1,
      "modificateurRecent": 1,
      "updatedTime": "2021-10-10T19:09:47.000+00:00",
      "isDeleted": "N",
      "createdTime": "2021-10-10T19:09:47.000+00:00"
    },
    {
      "visiteId": 10,
      "visiteDate": "2021-10-09T22:00:00.000+00:00",
      "visiteHeureDebut": "2021-10-10T19:09:58.000+00:00",
      "visiteHeureFin": null,
      "visiteObservation": null,
      "visiteEtat": 0,
      "coordinateurId": 1,
      "patientId": 1,
      "infirmiereId": 1,
      "modificateurRecent": 1,
      "updatedTime": "2021-10-10T19:09:58.000+00:00",
      "isDeleted": "N",
      "createdTime": "2021-10-10T19:09:58.000+00:00"
    },
    {
      "visiteId": 11,
      "visiteDate": "2021-10-09T22:00:00.000+00:00",
      "visiteHeureDebut": "2021-10-10T19:10:26.000+00:00",
      "visiteHeureFin": null,
      "visiteObservation": null,
      "visiteEtat": 0,
      "coordinateurId": 1,
      "patientId": 1,
      "infirmiereId": 1,
      "modificateurRecent": 1,
      "updatedTime": "2021-10-10T19:10:27.000+00:00",
      "isDeleted": "N",
      "createdTime": "2021-10-10T19:10:27.000+00:00"
    },
    {
      "visiteId": 12,
      "visiteDate": "2021-10-09T22:00:00.000+00:00",
      "visiteHeureDebut": "2021-10-10T19:10:39.000+00:00",
      "visiteHeureFin": null,
      "visiteObservation": null,
      "visiteEtat": 0,
      "coordinateurId": 1,
      "patientId": 1,
      "infirmiereId": 1,
      "modificateurRecent": 1,
      "updatedTime": "2021-10-10T19:10:39.000+00:00",
      "isDeleted": "N",
      "createdTime": "2021-10-10T19:10:39.000+00:00"
    }
  ];

  const vsToShow = useMemo(() => {
    let temp;
    if (_.isEmpty(visitesList)) return null;
    temp = visitesList.filter(data => data.isDeleted === 'N');
    if (!_.isEmpty(searchKey)) {
      temp = temp.filter(data => _.includes(_.lowerCase(data.patientNom), _.lowerCase(searchKey)));
    }
    return temp;
  }, [visitesList, searchKey]);

  const handleVersionUpdate = () => {
    setVersion(new Date());
  };

  const onSearch = value => {
    setSearchKey(value);
  };

  const onResetClick = () => {
    setSearchKey('');
    if (searchInput.current) searchInput.current.state.value = '';
  };

  const onModalVisibleChange = v => {
    setIsModalVisible(v);
  };

  const onCurrentLineChange = value => {
    setCurrentLine(value);
  };

  return (
    <div className="home-vs-mng-page">
      <div className="home-vs-mng-page-header">
        <h1>Visites</h1>
      </div>
      <ModalWrapper
        name="visite"
        visible={isModalVisible}
        onModalVisibleChange={onModalVisibleChange}
        data={currentLine}
        handleVersionUpdate={handleVersionUpdate}
      />

      <div className="home-vs-mng-page-table-header">
        <div className="home-vs-mng-page-table-header-left">
          <Search
            className="search-bar"
            placeholder="Rechercher par id.."
            onSearch={onSearch}
            enterButton
            ref={searchInput}
          />
        </div>
        <div className="home-vs-mng-page-table-header-right">
          <Button className="reset-btn" onClick={onResetClick}>
            Réinitialiser
          </Button>
        </div>
      </div>
      <Spin tip="Chargement en cours..." spinning={getVisitesListPending} indicator={antIcon}>
        <VsDetailTable
          dataSource={vsToShow}
          handleVersionUpdate={handleVersionUpdate}
          onModalVisibleChange={onModalVisibleChange}
          onCurrentLineChange={onCurrentLineChange}
        />
        <div className="home-vs-mng-page-footer">
          {!getVisitesListError ? (
            _.isEmpty(vsToShow) ? (
              'Pas de résultat répond aux critères de recherche'
            ) : vsToShow.length === 1 ? (
              'Seul 1 visite répond aux critères de recherche'
            ) : (
              `${vsToShow.length} visites répondent aux critères de recherche`
            )
          ) : (
            <div className="error">Échec du chargement des données</div>
          )}
        </div>
      </Spin>
    </div>
  );
}

VsMngPage.propTypes = {};
VsMngPage.defaultProps = {};
