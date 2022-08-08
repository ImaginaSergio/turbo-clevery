import { Stack, Icon } from '@chakra-ui/react';

import './RowTemplateImage.scss';

interface imageRowTemplateProps {
  content?: { svg: string };
}
const imageRowTemplate = ({ content }: imageRowTemplateProps) => {
  return (
    <Stack direction="row">
      {content?.svg ? (
        <img
          src={`data:image/svg+xml;utf8,${setColorTo(content?.svg)}`}
          alt="NA"
          style={{
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
          }}
        />
      ) : (
        <Icon as={undefined} color={'#3182FC'} w={'40px'} h={'40px'} />
      )}
    </Stack>
  );
};

export default imageRowTemplate;

const COLOR_REGEX = 'colorReplaceMe';

function setColorTo(elem: any, color = '%233182FC') {
  return elem?.replaceAll(COLOR_REGEX, color);
}
