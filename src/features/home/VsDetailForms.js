import React, { useEffect, useState } from 'react';
import { useFindVssByOrdId } from './redux/hooks';
import _ from 'lodash';
import { VsDetailForm } from './';
import { Spin, Divider } from 'antd';
import { antIcon } from '../../common/constants';
import { numFr } from '../../common/constants';

export default function VsDetailForms(props) {
  const { ordRecord } = props;
  const { findVssByOrdId, findVssByOrdIdPending, findVssByOrdIdError } = useFindVssByOrdId();
  const [dataToShow, setDataToShow] = useState(null);

  useEffect(() => {
    if (!_.isEmpty(ordRecord)) {
      findVssByOrdId({
        ordonnanceId: ordRecord.ordonnanceId,
      }).then(res => {
        res.data.success && setDataToShow(res.data.ext.visites);
      });
    }
  }, [findVssByOrdId, ordRecord]);

  return (
    <div className="home-vs-detail-forms">
      <Spin tip="Chargement en cours..." spinning={findVssByOrdIdPending} indicator={antIcon}>
        {!findVssByOrdIdError ? (
          !_.isEmpty(dataToShow) &&
          dataToShow.map(data => {
            return (
              <>
                <div className="nested-form-title">{`Enregistrement de la ${
                  numFr[dataToShow.indexOf(data)]
                } visite`}</div>
                <VsDetailForm data={data} />
                {dataToShow.indexOf(data) + 1 !== dataToShow.length && <Divider />}
              </>
            );
          })
        ) : (
          <div className="error">Échec du chargement des données</div>
        )}
      </Spin>
    </div>
  );
}

VsDetailForms.propTypes = {};
VsDetailForms.defaultProps = {};
