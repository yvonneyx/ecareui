import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { OrdDetailTable } from '../home';
import _ from 'lodash';
import { DatePicker, Tag, Button, notification, Spin, Typography } from 'antd';
import { useFindInfirmieresByDptId } from './redux/hooks';
import { useAddVisite, useUpdateOrdonnance } from '../home/redux/hooks';
import { antIcon } from '../../common/constants';
import { Link } from 'react-router-dom';

export default function NouvelleVisite() {
  const [selectedOrd, setSelectedOrd] = useState({});
  const [visiteDate, setVisiteDate] = useState(null);
  const [selectedInfirm, setSelectedInfirm] = useState('');
  const [newVisiteId, setNewVisiteId] = useState('1');
  const [version, setVersion] = useState(null);
  const [needReset, setNeedReset] = useState(false)
  const {
    infirmieres,
    findInfirmieresByDptId,
    findInfirmieresByDptIdPending,
    findInfirmieresByDptIdError,
  } = useFindInfirmieresByDptId();
  const { addVisite, addVisitePending, addVisiteError } = useAddVisite();
  const {
    updateOrdonnance,
    updateOrdonnancePending,
    updateOrdonnanceError,
  } = useUpdateOrdonnance();

  useEffect(() => {
    !_.isEmpty(selectedOrd) &&
      findInfirmieresByDptId({
        departementId: selectedOrd[0].departementId,
      });
  }, [findInfirmieresByDptId, selectedOrd]);

  const handleSelectedOrdChange = values => {
    setSelectedOrd(values);
  };

  const handleInfirmChange = (tag, checked) => {
    checked ? setSelectedInfirm(tag.infirmiereId) : setSelectedInfirm('');
  };

  const onDateChange = (value, dateString) => {
    setVisiteDate(value);
  };

  const triggerAddVsEvent = () => {
    addVisite({
      visiteDate: new Date(visiteDate),
      visiteHeureDebut: new Date(visiteDate),
      visiteEtat: 0,
      coordinateurId: 1, // todo: login
      patientId: selectedOrd[0].patientId,
      infirmiereId: selectedInfirm,
      modificateurRecent: 1, //todo: pass userId
    }).then(res => {
      setNewVisiteId(res.data.ext.newVisite.visiteId);
      // notification['success']({
      //   message: 'En a créé un avec succès',
      //   description: (
      //     <Typography.Link type="text" href="/1">
      //       Cliquez ici pour accéder à la page de détails.
      //     </Typography.Link>
      //   ),
      //   duration: 3,
      // });
      setNeedReset(true);
      updateOrdonnance({
        ...selectedOrd[0],
        ordonnanceEtat: 1,
      }).then(() => {
        setVersion(new Date());
      });
    });
  };

  return (
    <div className="coordinateur-nouvelle-visite">
      <div className="coordinateur-nouvelle-visite-header">
        <h1>Organiser une nouvelle visite</h1>
      </div>
      <h2>Ordonnance à traiter</h2>
      <OrdDetailTable
        handleSelectedOrdChange={handleSelectedOrdChange}
        needRadio={true}
        showNotStarted={true}
        defaultpageSize={5}
        version={version}
        needShowDtl={false}
      />
      <h2>
        Infirmières dans les services correspondants de l'examen médical: [
        {!_.isEmpty(selectedOrd) ? selectedOrd[0].examenMedicalNom : 'Sélectionnez une ordonnance'}]
      </h2>

      <Spin
        tip="Chargement en cours..."
        spinning={findInfirmieresByDptIdPending}
        indicator={antIcon}
      >
        <div className="infirmiere-part classic-part">
          Les infirmières suivantes peuvent prendre des dispositions:{' '}
          {!_.isEmpty(infirmieres)
            ? infirmieres.map(infirm => (
                <Tag.CheckableTag
                  key={infirm.infirmiereId}
                  checked={selectedInfirm === infirm.infirmiereId}
                  onChange={checked => handleInfirmChange(infirm, checked)}
                >
                  {infirm.infirmiereNom}
                </Tag.CheckableTag>
              ))
            : 'Aucune infirmière ne peut être choisie'}
        </div>
      </Spin>

      <h2>Date et heure de la première visite</h2>
      <div className="datepicker-part classic-part">
        <DatePicker showTime onChange={onDateChange} bordered={false} showToday={false} />
      </div>

      <Button
        type="primary"
        className="coordinateur-nouvelle-visite-confirm-btn slide-btn"
        onClick={triggerAddVsEvent}
        disabled={addVisitePending || needReset}
      >
        {!addVisitePending ? 'Confirmer et créer une nouvelle visite' : 'En cours'}
      </Button>

      {true && (
        <div>
          En a créé un avec succès. <a>Cliquez ici pour accéder à la page de détails.</a>
        </div>
      )}
    </div>
  );
}

NouvelleVisite.propTypes = {};
NouvelleVisite.defaultProps = {};
