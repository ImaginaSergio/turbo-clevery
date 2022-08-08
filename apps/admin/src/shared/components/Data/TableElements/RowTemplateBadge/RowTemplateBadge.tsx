import { Badge, Box, Stack, Tooltip } from '@chakra-ui/react';

import './RowTemplateBadge.scss';

interface badgeRowTemplateProps {
  badges: {
    tooltip?: string;
    style?: React.CSSProperties;
    content: {
      text: string | React.ReactNode;
      style?: React.CSSProperties;
    };
  }[];
}

const badgeRowTemplate = ({ badges }: badgeRowTemplateProps) => {
  if (badges.length === 0)
    return (
      <Stack direction="row">
        <Box color="#A3A3B4">---</Box>
      </Stack>
    );

  const TooltipWrapper = ({ tooltip, ...props }: any) =>
    tooltip ? (
      <Tooltip aria-label="A tooltip" className="content-tooltip" label={tooltip}>
        {props.children}
      </Tooltip>
    ) : (
      props.children
    );

  return (
    <Stack direction="row" overflow="auto">
      {badges.map((badge, index) => (
        <TooltipWrapper key={'tooltip-wrapper-' + index} tooltip={badge.tooltip}>
          <Badge
            p="4px 8px"
            rounded="6px"
            color="white"
            fontSize="14px"
            fontWeight="bold"
            lineHeight="16px"
            style={badge.style}
          >
            <div style={badge.content.style}>{badge.content.text}</div>
          </Badge>
        </TooltipWrapper>
      ))}
    </Stack>
  );
};

export { badgeRowTemplate };
