import React, { useEffect, useMemo } from 'react';
import { useFindVssByInfirmId } from './redux/hooks';
// import PropTypes from 'prop-types';
import { VsDetailTable } from '../home';
import { showDate, antIcon } from '../../common/constants';
import { Spin } from 'antd';

export default function VsSummaryPage() {
  let loggedId = '1'; // todo: infirmiereId

  const {
    vssByInfirmId,
    findVssByInfirmId,
    findVssByInfirmIdPending,
    findVssByInfirmIdError,
  } = useFindVssByInfirmId();

  useEffect(() => {
    findVssByInfirmId({ infirmiereId: loggedId });
  }, [findVssByInfirmId, loggedId]);

  const vssToDoList = useMemo(() => {
    return vssByInfirmId && vssByInfirmId.filter(vs => vs.visiteEtat === 0);
  }, [vssByInfirmId]);

  const vssDoingList = useMemo(() => {
    return vssByInfirmId && vssByInfirmId.filter(vs => vs.visiteEtat === 1);
  }, [vssByInfirmId]);

  const vssDoneList = useMemo(() => {
    return vssByInfirmId && vssByInfirmId.filter(vs => vs.visiteEtat === 2);
  }, [vssByInfirmId]);

  return (
    <div className="infirmiere-vs-summary-page">
      <div className="infirmiere-vs-summary-page-header">
        <h1>Liste des visites liées à moi</h1>
      </div>
      <Spin tip="Chargement en cours..." spinning={findVssByInfirmIdPending} indicator={antIcon}>
        {!findVssByInfirmIdError ? (
          <div className="infirmiere-vs-summary-page-content">
            <h2>Pas commencé</h2>
            <VsDetailTable
              target="infirmiere"
              dataSource={vssToDoList}
              size="small"
              pageSize={5}
              showQuickStartAndDetail={true}
            />
            <h2>En cours</h2>
            <VsDetailTable
              target="infirmiere"
              dataSource={vssDoingList}
              size="small"
              pageSize={5}
              showQuickStartAndDetail={true}
            />
            <h2>Fini</h2>
            <VsDetailTable
              target="infirmiere"
              dataSource={vssDoneList}
              size="small"
              pageSize={5}
              showQuickStartAndDetail={true}
            />
          </div>
        ) : (
          <div className="error">Échec du chargement des données</div>
        )}
      </Spin>
    </div>
  );
}

VsSummaryPage.propTypes = {};
VsSummaryPage.defaultProps = {};
