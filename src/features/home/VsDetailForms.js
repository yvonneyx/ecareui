import React, { useEffect, useState } from 'react';
import { useFindVssByOrdId } from './redux/hooks';
import _ from 'lodash';
import { VsDetailForm } from './';

export default function VsDetailForms(props) {
  // const { ordRecord } = props;
  // const { findVssByOrdId, findVssByOrdIdPending, findVssByOrdIdError } = useFindVssByOrdId();
  // const [dataToShow, setDataToShow] = useState(null);

  // useEffect(() => {
  //   if (!_.isEmpty(ordRecord)) {
  //     findVssByOrdId({
  //       ordonnanceId: ordRecord.ordonnanceId,
  //     }).then(res => {
  //       setDataToShow(res.data.ext.visites);
  //     });
  //   }
  // }, [findVssByOrdId, ordRecord]);

  const dataToShow=[
    {
      "visiteId": 8,
      "visiteDate": "2021-10-09T22:00:00.000+00:00",
      "visiteHeureDebut": "2021-10-10T19:09:23.000+00:00",
      "visiteHeureFin": null,
      "visiteObservation": null,
      "visiteEtat": 0,
      "coordinateurId": 1,
      "ordonnanceId": 1,
      "patientId": 1,
      "infirmiereId": 1,
      "modificateurRecent": 1,
      "updatedTime": "2021-10-10T20:25:53.000+00:00",
      "isDeleted": "N",
      "createdTime": "2021-10-10T20:25:53.000+00:00"
    },
    {
      "visiteId": 9,
      "visiteDate": "2021-10-09T22:00:00.000+00:00",
      "visiteHeureDebut": "2021-10-10T19:09:48.000+00:00",
      "visiteHeureFin": null,
      "visiteObservation": null,
      "visiteEtat": 0,
      "coordinateurId": 1,
      "ordonnanceId": 1,
      "patientId": 1,
      "infirmiereId": 1,
      "modificateurRecent": 1,
      "updatedTime": "2021-10-10T20:25:53.000+00:00",
      "isDeleted": "N",
      "createdTime": "2021-10-10T20:25:53.000+00:00"
    },
    {
      "visiteId": 10,
      "visiteDate": "2021-10-09T22:00:00.000+00:00",
      "visiteHeureDebut": "2021-10-10T19:09:58.000+00:00",
      "visiteHeureFin": null,
      "visiteObservation": null,
      "visiteEtat": 0,
      "coordinateurId": 1,
      "ordonnanceId": 1,
      "patientId": 1,
      "infirmiereId": 1,
      "modificateurRecent": 1,
      "updatedTime": "2021-10-10T20:25:54.000+00:00",
      "isDeleted": "N",
      "createdTime": "2021-10-10T20:25:54.000+00:00"
    },
    {
      "visiteId": 11,
      "visiteDate": "2021-10-09T22:00:00.000+00:00",
      "visiteHeureDebut": "2021-10-10T19:10:26.000+00:00",
      "visiteHeureFin": null,
      "visiteObservation": null,
      "visiteEtat": 0,
      "coordinateurId": 1,
      "ordonnanceId": 1,
      "patientId": 1,
      "infirmiereId": 1,
      "modificateurRecent": 1,
      "updatedTime": "2021-10-10T20:25:55.000+00:00",
      "isDeleted": "N",
      "createdTime": "2021-10-10T20:25:55.000+00:00"
    },
    {
      "visiteId": 12,
      "visiteDate": "2021-10-09T22:00:00.000+00:00",
      "visiteHeureDebut": "2021-10-10T19:10:39.000+00:00",
      "visiteHeureFin": null,
      "visiteObservation": null,
      "visiteEtat": 0,
      "coordinateurId": 1,
      "ordonnanceId": 1,
      "patientId": 1,
      "infirmiereId": 1,
      "modificateurRecent": 1,
      "updatedTime": "2021-10-10T20:25:57.000+00:00",
      "isDeleted": "N",
      "createdTime": "2021-10-10T20:25:57.000+00:00"
    }
  ]
  return (
    <div className="home-vs-detail-forms">
      {!_.isEmpty(dataToShow) &&
        dataToShow.map(data => {
          return <VsDetailForm data={data} />;
        })}
    </div>
  );
}

VsDetailForms.propTypes = {};
VsDetailForms.defaultProps = {};
