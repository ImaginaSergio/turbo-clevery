import { Flex, Box, Icon } from '@chakra-ui/react';

export const TabsSidebar = ({
  tabs,
}: {
  tabs: {
    icon: any;
    label: string;
    showDot?: boolean;
    isActive?: boolean;
    onClick: () => any;
  }[];
}) => {
  return (
    <Flex
      gap="10px"
      minW="275px"
      overflow="auto"
      w={{ base: '100%', md: '225px' }}
      maxW={{ base: '100%', md: '225px' }}
      direction={{ base: 'row', md: 'column' }}
      sx={{
        scrollbarWidth: 'none',
        '::-webkit-scrollbar': { opacity: '0' },
        '-webkit-overflow-scrolling': 'touch',
        border: 'none',
        paddingBottom: '8px',
      }}
    >
      {tabs?.map((tab, index) => (
        <Flex
          p="12px"
          gap="13px"
          align="center"
          fontSize="16px"
          color="gray_4"
          data-cy={`tab_${tab?.label}`}
          cursor="pointer"
          tabIndex={index}
          fontWeight="bold"
          onClick={tab.onClick}
          transition="all .125s"
          whiteSpace="nowrap"
          key={`tab-cuenta-${index}`}
          w={{ base: '100%', md: 'unset' }}
          _hover={{
            borderRadius: '8px',
            backgroundColor: 'var(--chakra-colors-gray_2)',
          }}
          style={
            tab.isActive
              ? {
                  borderRadius: '8px',
                  color: 'var(--chakra-colors-black)',
                  backgroundColor: 'var(--chakra-colors-gray_2)',
                }
              : {}
          }
        >
          <Box pos="relative" h="18px">
            {tab.showDot && (
              <Box
                top="-5px"
                right="-5px"
                rounded="50%"
                bg="primary"
                pos="absolute"
                boxSize="10px"
              />
            )}

            <Icon boxSize="18px" as={tab.icon} />
          </Box>

          <Box w="100%" textAlign="start">
            {tab.label}
          </Box>
        </Flex>
      ))}
    </Flex>
  );
};
