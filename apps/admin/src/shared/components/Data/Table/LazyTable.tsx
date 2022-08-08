import React, { useState, forwardRef, useImperativeHandle } from 'react';

import { DataTable } from 'primereact/datatable';

import './LazyTable.scss';

type TableProps = {
  columns: any;
  getData: any;
  query?: string;

  frozenWidth?: string;
  rowGroupMode?: string;
  expandableRowGroups?: any;
  style?: React.CSSProperties;
  onRowClick?: (e: any) => void;
  rowClassName?: (e: any) => any;

  selection?: any;
  selectionMode?: 'single' | 'multiple' | 'checkbox' | 'radiobutton';
  onSelectionChange?: any;

  rowGroupHeaderTemplate?: any;
  rowGroupFooterTemplate?: any;

  expandedRows?: any;
  onRowToggle?: (e: any) => void;
  onRowExpand?: (e: any) => void;
  onRowCollapse?: (e: any) => void;
  rowExpansionTemplate?: any;
};

export const LazyTable = forwardRef(({ getData, query, columns, style, ...props }: TableProps, ref) => {
  const [data, setData] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [lazyParams, setLazyParams] = useState({
    page: undefined,
    rows: 10,
    first: 0,
    sortField: undefined,
    sortOrder: undefined,
  });

  useImperativeHandle(ref, () => ({
    refreshData() {
      loadLazyData();
    },
  }));

  const loadLazyData = async () => {
    setIsLoading(true);
    const data = await getData(lazyParams, query);

    setTotalRecords(+data?.meta?.total);

    setData(data?.data);

    setIsLoading(false);
  };

  const onPage = (event: any) => {
    const _lazyParams = { ...lazyParams, ...event };

    setLazyParams(_lazyParams);
  };

  const onSort = (event: any) => {
    const _lazyParams = { ...lazyParams, ...event };

    setLazyParams(_lazyParams);
  };

  React.useEffect(() => {
    if (data) loadLazyData();
  }, [lazyParams]);

  return (
    <DataTable
      {...props}
      lazy
      rows={10}
      paginator
      scrollable
      value={data}
      onPage={onPage}
      onSort={onSort}
      first={lazyParams.first}
      className="my-lazy-table"
      totalRecords={totalRecords}
      sortField={lazyParams.sortField}
      sortOrder={lazyParams.sortOrder}
      loading={isLoading}
      style={{ overflow: 'hidden', ...style }}
      currentPageReportTemplate="{first} de {totalRecords}"
      paginatorTemplate="PrevPageLink CurrentPageReport NextPageLink"
    >
      {columns}
    </DataTable>
  );
});
