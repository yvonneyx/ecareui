export default function GetColumnFilterProps(dataIndex, filterOptions) {
  return {
    filters: filterOptions,
    onFilter: (value, record) => record[dataIndex] === value,
  };
}
