import { BiPlus } from 'react-icons/bi';
import { Box, Button, Flex, Icon } from '@chakra-ui/react';

import { OpenColumn, OpenTable } from 'ui';

type InformationTableProps = {
  label?: string;
  noDataMessage?: string;
  data: any[] | undefined;
  style?: React.CSSProperties;
  onRowClick?: (e: any) => void;
  isLoading?: boolean;

  selection?: any;
  onSelectionChange?: any;
  selectionMode?: 'single' | 'multiple' | 'checkbox' | 'radiobutton';

  addButton?: {
    title?: string;
    onClick?: (e?: any) => void | any;
  };

  columns: OpenColumn[];

  isExpandable?: boolean;
  rowExpansionTemplate?: any;
  onPageChange?: (page: number) => void;
  onQueryChange?: (string: string) => void;
  total?: number;
  maxPages?: number;
  currentPage?: number;
};

const InformationTable = ({
  label,
  data,
  columns,
  isLoading = true,
  addButton,
  onRowClick,
  noDataMessage = '',
  style,
}: InformationTableProps) => {
  // const getColumns = () =>
  //   columns.map((item) => <Column key={item.field || null} {...item} />);

  return (
    <>
      <Flex align="center" justify="space-between" boxSize="100%">
        {label && (
          <label className="information-block-label" style={{ marginBottom: '0px' }}>
            {label}
          </label>
        )}

        {addButton && (
          <Button
            h="auto"
            color="#fff"
            bg="#3182FC"
            rounded="8px"
            p="10px 15px"
            w="fit-content"
            onClick={addButton.onClick}
            rightIcon={<Icon as={BiPlus} boxSize="21px" opacity="0.6" />}
          >
            {addButton.title}
          </Button>
        )}
      </Flex>

      {data?.length === 0 ? (
        noDataMessage && (
          <Box w="100%" color="gray_4" fontSize="14px" fontWeight="medium">
            {noDataMessage}
          </Box>
        )
      ) : (
        <Flex style={style}>
          <OpenTable data={data} columns={columns} isPaginable={false} isLoading={isLoading} onRowClick={onRowClick} />
        </Flex>
      )}
    </>
  );
};

export { InformationTable };
