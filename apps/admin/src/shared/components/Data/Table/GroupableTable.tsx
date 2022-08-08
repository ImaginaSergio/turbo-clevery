import { useState } from 'react';

import { Flex, Spinner } from '@chakra-ui/react';
import { DataTable } from 'primereact/datatable';

import './LazyTable.scss';

type TableProps = {
  data: any[];
  columns: any;
  loading: boolean;
  style?: React.CSSProperties;
  expandedRows?: any;
  rowGroupMode?: string;
  noDataMessage?: string;
  expandableRowGroups?: any;
  rowGroupHeaderTemplate?: any;
  rowGroupFooterTemplate?: any;
  onRowClick?: (e: any) => void;
  onRowToggle?: (e: any) => void;
  rowClassName?: (e: any) => any;
};
export const GroupableTable = ({
  data,
  columns,
  loading,
  style,
  rowClassName,
  rowGroupMode = undefined,
  noDataMessage = 'Sin datos',
  onRowClick = (e: any) => {},
  rowGroupHeaderTemplate = (e: any) => {},
  rowGroupFooterTemplate = (e: any) => {},
}: TableProps) => {
  const [expandedRows, setExpandedRows] = useState([]);

  return (
    <Flex w="100%" align="center" justify="center" overflowY="auto">
      {loading ? (
        <Spinner
          size="lg"
          position="absolute"
          top="42%"
          right="50%"
          zIndex="2000"
        />
      ) : data && data?.length > 0 ? (
        <DataTable
          scrollable
          value={data}
          style={style}
          onRowClick={onRowClick}
          expandableRowGroups={false}
          expandedRows={expandedRows}
          rowGroupMode={rowGroupMode}
          rowClassName={rowClassName}
          rowGroupHeaderTemplate={rowGroupHeaderTemplate}
          rowGroupFooterTemplate={rowGroupFooterTemplate}
          onRowToggle={(e: any) => {
            setExpandedRows(e.data);
          }}
        >
          {columns}
        </DataTable>
      ) : (
        <div className="notFound">
          <div className="notFound_text">{noDataMessage}</div>
        </div>
      )}
    </Flex>
  );
};
