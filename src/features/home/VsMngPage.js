import React, { useEffect, useState, useMemo, useRef } from 'react';
// import PropTypes from 'prop-types';
import { Input, Button, Spin } from 'antd';
import _ from 'lodash';
import { antIcon } from '../../common/constants';
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
    visitesList,
    getVisitesList,
    getVisitesListPending,
    getVisitesListError,
  } = useGetVisitesList();
  // const { deletePatient } = useDeletePatient();
  const searchInput = useRef();

  useEffect(() => {
    getVisitesList();
  }, [getVisitesList, version]);

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
