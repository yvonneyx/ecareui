import React, { useEffect, useState, useMemo } from 'react';
// import PropTypes from 'prop-types';
import { Input, Button, Popconfirm, message, Spin, Card } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import _ from 'lodash';
import { antIcon } from '../../common/constants';
import ModalWrapper from '../common/ModalWrapper';
import { useGetDptsList, useDeleteDpt } from './redux/hooks';

const { Meta } = Card;
const { Search } = Input;

export default function DptMngPage(props) {
  const [searchKey, setSearchKey] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentLine, setCurrentLine] = useState({});
  const [version, setVersion] = useState('');
  const { dptsList, getDptsList, getDptsListPending, getDptsListError } = useGetDptsList();
  const { deleteDpt } = useDeleteDpt();
  
  useEffect(() => {
    getDptsList();
  }, [getDptsList, version]);

  const dptToShow = useMemo(() => {
    let temp;
    if (_.isEmpty(dptsList)) return null;
    temp = dptsList.filter(data => data.isDeleted === 'N');
    if (!_.isEmpty(searchKey)) {
      temp = temp.filter(data =>
        _.includes(_.lowerCase(data.departementNom), _.lowerCase(searchKey)),
      );
    }
    return temp;
  }, [dptsList, searchKey]);

  const handleVersionUpdate = () => {
    setVersion(new Date());
  };

  const onSearch = value => {
    setSearchKey(value);
  };

  const deleteConfirm = rc => {
    deleteDpt({
      departementId: rc.departementId,
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
  };

  const onModalVisibleChange = visible => {
    setIsModalVisible(visible);
  };

  return (
    <div className="admin-dpt-mng-page">
      <div className="admin-dpt-mng-page-header">
        <h1>Départements médicaux</h1>
        <Button
          type="primary"
          onClick={() => {
            setIsModalVisible(true);
            setCurrentLine({});
          }}
        >
          Ajouter un département médical
        </Button>
      </div>
      <ModalWrapper
        name="dpt"
        visible={isModalVisible}
        onModalVisibleChange={onModalVisibleChange}
        data={currentLine}
        handleVersionUpdate={handleVersionUpdate}
      />

      <div className="admin-dpt-mng-page-table-header">
        <div className="admin-dpt-mng-page-table-header-left">
          <Search
            className="search-bar"
            placeholder="Rechercher par nom du département.."
            onSearch={onSearch}
            enterButton
          />
        </div>
        <div className="admin-dpt-mng-page-table-header-right">
          <Button className="reset-btn" onClick={onResetClick}>
            Réinitialiser
          </Button>
        </div>
      </div>
      <Spin tip="Chargement en cours..." spinning={getDptsListPending} indicator={antIcon}>
        <div className="admin-dpt-mng-page-card-container">
          {!_.isEmpty(dptToShow) &&
            dptToShow.map(data => {
              return (
                <Card
                  className="admin-dpt-mng-page-card-one"
                  actions={[
                    <EditOutlined
                      key="editOne"
                      onClick={() => {
                        setIsModalVisible(true);
                        setCurrentLine(data);
                      }}
                    />,
                    <Popconfirm
                      icon={<ExclamationCircleFilled style={{ color: 'var(--first-color)' }} />}
                      title="Êtes-vous sûr de supprimer cet département médical?"
                      onConfirm={() => deleteConfirm(data)}
                      okText="Oui, je confirme"
                      cancelText="Non"
                    >
                      <DeleteOutlined key="deleteOne" />
                    </Popconfirm>,
                  ]}
                  bordered={false}
                  loading={getDptsListPending}
                  key={`card-${data.departementId}`}
                >
                  <Meta title={data.departementNom} description={data.departementDescription} />
                </Card>
              );
            })}
        </div>

        <div className="admin-dpt-mng-page-footer">
          {!getDptsListError ? (
            _.isEmpty(dptToShow) ? (
              'Pas de résultat répond aux critères de recherche'
            ) : dptToShow.length === 1 ? (
              'Seul 1 département médical répond aux critères de recherche'
            ) : (
              `${dptToShow.length} départements médicaux répondent aux critères de recherche`
            )
          ) : (
            <div className="error">Échec du chargement des données</div>
          )}
        </div>
      </Spin>
    </div>
  );
}

DptMngPage.propTypes = {};
DptMngPage.defaultProps = {};
