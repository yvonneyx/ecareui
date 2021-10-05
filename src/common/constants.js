import React from 'react';
import moment from 'moment';
import 'moment/locale/fr';
import _ from 'lodash';

export const roles = ['Administrateur', 'Infirmière', 'Coordinateur', 'Tous'];

export const showDate = time => {
  return (
    <>
      <div>
        {_.upperFirst(
          moment(time)
            .locale('fr')
            .format('MMMM Do YYYY'),
        )}
      </div>
      <div>
        {moment(time)
          .locale('fr')
          .format('h:mm:ss a')}
      </div>
    </>
  );
};
