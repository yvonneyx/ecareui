import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { Table, Spin, Input, Space, Button, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useGetOrdonnancesList } from './redux/hooks';
import { showSimpleDateInline, antIcon } from '../../common/constants';
import { VsDetailTable, VsDetailForm, VsDetailForms } from '../home';

export default function OrdDetailTable(props, ref) {
  const { needRadio, showNotStarted, defaultpageSize, version, needExpand, needShowDtl } = props;
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = React.useRef(null);
  const { handleSelectedOrdChange } = props;
  const [pageSize, setPageSize] = useState(defaultpageSize);
  const {
    ordonnancesList,
    getOrdonnancesList,
    getOrdonnancesListPending,
    getOrdonnancesListError,
  } = useGetOrdonnancesList();

  useEffect(() => {
    getOrdonnancesList();
  }, [getOrdonnancesList, version]);

  const ordsNotStarted = React.useMemo(() => {
    return ordonnancesList && ordonnancesList.filter(ord => ord.ordonnanceEtat === 0);
  }, [ordonnancesList]);

  const rowSelection = {
    type: 'radio',
    onChange: (selectedRowKeys, selectedRows) => {
      handleSelectedOrdChange(selectedRows);
    },
  };

  const onShowSizeChange = (current, pageSize) => {
    setPageSize(pageSize);
  };

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Rechercher par nom`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 120 }}
          >
            Rechercher
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 100 }}>
            Réinitialiser
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filtre
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => {
          searchInput.current.focus();
        }, 100);
      }
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('');
  };

  const filterOptions = [
    { text: 'Pas commencé', value: 0 },
    { text: 'En cours', value: 1 },
    {
      text: 'Fini',
      value: 2,
    },
  ];

  const getColumnFilterProps = dataIndex => ({
    filters: filterOptions,
    onFilter: (value, record) => record[dataIndex] === value,
  });

  const columns = [
    {
      title: 'ID',
      dataIndex: 'ordonnanceId',
      key: 'ordonnanceId',
      width: 35,
    },
    {
      title: 'Patient',
      dataIndex: 'patientNom',
      key: 'patientNom',
      ...getColumnSearchProps('patientNom'),
    },
    {
      title: 'Examen médical',
      dataIndex: 'examenMedicalNom',
      key: 'examenMedicalNom',
      ...getColumnSearchProps('examenMedicalNom'),
    },
    {
      title: 'état',
      dataIndex: 'ordonnanceEtat',
      key: 'ordonnanceEtat',
      width: 150,
      render: text => {
        return text === 0 ? 'Pas commencé' : text === 1 ? 'En cours' : 'Fini';
      },
      ...getColumnFilterProps('ordonnanceEtat'),
    },
    {
      title: 'fois restantes',
      dataIndex: 'ordonnanceCount',
      key: 'ordonnanceCount',
      width: 100,
      render: text => <span>{text} fois</span>,
    },
    {
      title: 'Intervalle suggéré',
      dataIndex: 'ordonnanceIntervalle',
      key: 'ordonnanceIntervalle',
      width: 160,
      render: text => <span>{text} jours</span>,
    },
    {
      title: 'Heure de création',
      dataIndex: 'createdTime',
      key: 'createdTime',
      width: 180,
      render: time => showSimpleDateInline(time),
    },
  ];

  if (needShowDtl) {
    columns.push({
      title: '',
      dataIndex: 'operation',
      key: 'operation',
      width: 120,
      render: (text, record) => {
        return (
          <Space size="middle">
            <Typography.Link href={`/ordonnance/${record.ordonnanceId}`}>
              Voir les détails
            </Typography.Link>
          </Space>
        );
      },
    });
  }

  const expandable = {
    expandedRowRender: record => <VsDetailForms ordRecord={record} size="small" />,
    rowExpandable: record => record.ordonnanceEtat !== 0,
  };

  const paginationProps = {
    pageSize: pageSize,
    total: ordsNotStarted && ordsNotStarted.length,
    showSizeChanger: true,
    onShowSizeChange: onShowSizeChange,
    pageSizeOptions: [2, 5, 10],
  };

  return (
    <div className="home-ord-detail-table">
      <Spin tip="Chargement en cours..." spinning={getOrdonnancesListPending} indicator={antIcon}>
        <Table
          rowSelection={needRadio && rowSelection}
          columns={columns}
          dataSource={showNotStarted ? ordsNotStarted : ordonnancesList}
          size={showNotStarted ? 'small' : 'middle'}
          rowKey="ordonnanceId"
          pagination={paginationProps}
          expandable={needExpand && expandable}
        />
      </Spin>
      <div className="home-ord-detail-table-footer">
        {getOrdonnancesListError && <div className="error">Échec du chargement des données</div>}
      </div>
    </div>
  );
}

OrdDetailTable.propTypes = {};
OrdDetailTable.defaultProps = {};
