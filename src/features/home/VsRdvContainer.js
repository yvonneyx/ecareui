import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import { BellOutlined, SmileOutlined } from '@ant-design/icons';
import { DatePicker, Button } from 'antd';
import { useAddVisite } from './redux/hooks';
import _ from 'lodash';
import { useCookies } from 'react-cookie';

export default function VsRdvContainer({ restVssCount, data, prevCoorId, setVersion }) {
  const [cookies] = useCookies(['UID', 'UIID', 'UNAME', 'UROLE']);
  const [visiteDate, setVisiteDate] = useState(null);
  const [rdvSuccess, setRdvSuccess] = useState(false);
  const { addVisite, addVisitePending } = useAddVisite();

  const onDateChange = (value, dateString) => {
    setVisiteDate(value);
  };

  const triggerAddVsEvent = () => {
    if (!_.isEmpty(visiteDate)) {
      addVisite({
        ordonnanceId: data.ordonnanceId,
        visiteDate: new Date(visiteDate),
        visiteHeureDebut: new Date(visiteDate),
        visiteEtat: 0,
        coordinateurId: prevCoorId || data.coordinateurId,
        patientId: data.patientId,
        infirmiereId: cookies.UIID,
        modificateurRecent: cookies.UID,
      }).then(() => {
        setRdvSuccess(true);
        setVersion && setVersion(new Date());
      });
    }
  };

  return (
    <div className="home-vs-rdv-container">
      <div>
        <BellOutlined />
        &nbsp; Ce patient doit revenir {restVssCount} fois, veuillez prendre rendez-vous pour la
        prochaine visite.
        <h3 className="home-vs-rdv-container-subtitle">Date et heure de la prochaine visite</h3>
        <div className="datepicker-part classic-part">
          <DatePicker showTime onChange={onDateChange} bordered={false} showToday={false} />
        </div>
        {!rdvSuccess ? (
          <Button
            type="primary"
            size="small"
            className="home-vs-rdv-container-btn slide-btn"
            onClick={triggerAddVsEvent}
            loading={addVisitePending}
          >
            Créer un rendez-vous rapidement
          </Button>
        ) : (
          <div className="home-vs-rdv-container-tip">
            Rendez-vous pris&nbsp;
            <SmileOutlined />
          </div>
        )}
      </div>
    </div>
  );
}

VsRdvContainer.propTypes = {};
VsRdvContainer.defaultProps = {};
