import React from 'react';
import moment from 'moment';
import 'moment/locale/fr';
import _ from 'lodash';
import { LoadingOutlined } from '@ant-design/icons';

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

export const showDateInline = time => {
  return (
    <span>
      {_.upperFirst(
        moment(time)
          .locale('fr')
          .format('MMMM Do YYYY h:mm:ss a'),
      )}
    </span>
  );
};

export const showOnlyDate = time => {
  return (
    <span>
      {_.upperFirst(
        moment(time)
          .locale('fr')
          .format('MMMM Do YYYY'),
      )}
    </span>
  );
};

export const showOnlyTime = time => {
  return (
    <span>
      {moment(time)
        .locale('fr')
        .format('h:mm:ss a')}
    </span>
  );
};

export const antIcon = <LoadingOutlined style={{ color: 'var(--first-color)' }} spin />;
