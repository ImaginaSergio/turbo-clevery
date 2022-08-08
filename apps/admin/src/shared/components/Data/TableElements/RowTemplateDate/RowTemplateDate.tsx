import { Stack, Box } from '@chakra-ui/react';
import { es } from 'date-fns/locale';
import { differenceInDays, format, formatDistance } from 'date-fns';

import './RowTemplateDate.scss';

interface dateRowTemplateProps {
  content: {
    date: string;
    format?: string;
    isDatetime?: boolean;
    style?: React.CSSProperties;

    isDistance?: boolean;
    maxDistanceInDays?: number;
  };
}

export const dateRowTemplate = ({ content }: dateRowTemplateProps) => {
  if (!content || !content.date || content.date.startsWith('1970')) return <Box color="#A3A3B4">---</Box>;

  const dateFormatted =
    content.isDistance && differenceInDays(new Date(), new Date(content?.date)) < (content?.maxDistanceInDays || 10)
      ? formatDistance(new Date(), new Date(content?.date), { locale: es })
      : content?.isDatetime
      ? format(new Date(content.date), content.format || "dd 'de' LLLL 'del' yyyy',' HH:mm", { locale: es })
      : format(new Date(content.date), content.format || "dd 'de' LLLL 'del' yyyy", {
          locale: es,
        });

  return (
    <Stack direction="row">
      <Box>{dateFormatted}</Box>
    </Stack>
  );
};

export default dateRowTemplate;
