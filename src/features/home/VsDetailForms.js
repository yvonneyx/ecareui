import React, { useEffect, useState } from 'react';
import { useFindVssByOrdId } from './redux/hooks';
import _ from 'lodash';
import { VsDetailForm } from './';
import { Spin, Divider, Button } from 'antd';
import { antIcon, numFr } from '../../common/constants';
import { useCookies } from 'react-cookie';
import { AlignLeftOutlined } from '@ant-design/icons';

export default function VsDetailForms(props) {
  const { ordRecord } = props;
  const { findVssByOrdId, findVssByOrdIdPending, findVssByOrdIdError } = useFindVssByOrdId();
  const [dataToShow, setDataToShow] = useState(null);
  const [cookies, setCookie] = useCookies(['UID', 'UCID', 'UNAME', 'UROLE']);
  let roles = ['admin', 'infirmiere', 'coordinateur'];
  let role = !_.isEmpty(cookies) && roles[cookies.UROLE];

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
              <div>
                <div className="nested-form-header-container">
                  <div className="nested-form-title">
                    {`Enregistrement de la ${numFr[dataToShow.indexOf(data)]} visite`}
                  </div>
                  <a
                    href={
                      role === 'infirmiere'
                        ? `/${role}/ordonnance/${data.ordonnanceId}/visite/${data.visiteId}`
                        : `/${role}/gestion-des-visites/${data.visiteId}`
                    }
                    className="nested-form-link"
                  >
                    <AlignLeftOutlined />
                    &nbsp;Voir les détails
                  </a>
                </div>
                <VsDetailForm data={data} type="simple" />
                {dataToShow.indexOf(data) + 1 !== dataToShow.length && <Divider />}
              </div>
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
