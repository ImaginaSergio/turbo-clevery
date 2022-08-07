import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { BiArrowBack } from 'react-icons/bi';
import { Box, Flex, Icon, Button, Modal, ModalBody, Image, ModalContent, ModalOverlay } from '@chakra-ui/react';

import { LayoutContext } from '../../../shared/context';
import { OpenParser } from 'ui';
import { INoticia } from 'data';
import { NoticiaBadge } from './Badge';

interface ProyectoModalProps {
  isOpen: boolean;
  noticia?: INoticia;
  onClose: () => void;
  onClickNext?: () => void;
  onClickPrev?: () => void;
}

export const NoticiaModal = ({
  noticia,

  isOpen = false,
  onClose,
}: ProyectoModalProps) => {
  const { isMobile } = useContext(LayoutContext);
  const navigate = useNavigate();

  return (
    <Modal size="full" isOpen={isOpen} onClose={onClose} closeOnOverlayClick={true}>
      <ModalOverlay boxSize="100%" bg="rgba(25, 25, 25, 1)">
        <ModalContent boxSize="100%" rounded="0px" background="transparent" overflow="auto">
          <ModalBody boxSize="100%" pt="20px" mb="20px">
            <Flex w="100%" h="100%" direction="column" justify="center" align="center" position="relative">
              <Flex w="100%" color="#ffffff" h="100%" direction="column">
                <Button
                  color="#FFF"
                  bg="#383839"
                  alignItems="center"
                  onClick={onClose}
                  pr={isMobile ? '10px' : ''}
                  leftIcon={<Icon as={BiArrowBack} />}
                  _hover={{ backgroundColor: '#000' }}
                  position="absolute"
                  ml="10px"
                  mt="10px"
                >
                  {'Volver'}
                </Button>

                {noticia?.imagen?.url && <Image src={noticia?.imagen?.url} boxSize="100%" rounded="xl" />}

                <Flex gap="8px" mt={noticia?.imagen?.url ? '20px' : '80px'}>
                  {!noticia?.curso?.id && <NoticiaBadge label="General" bg="#2834BA1A" color="secondary_dark" />}

                  {noticia?.cursoId && (
                    <>
                      <NoticiaBadge label="Cursos" bg="#7B61FF1A" color="#7B61FF" />

                      <NoticiaBadge label={noticia?.curso?.titulo} bg="#0C97C21A" color="#0C97C2" />
                    </>
                  )}
                </Flex>

                <Box mt="22px" fontSize="32px" fontWeight="bold" lineHeight="39px" color="#ffffff" data-cy="preview_titulo">
                  {noticia?.titulo}
                </Box>

                <OpenParser
                  value={noticia?.contenido}
                  style={{
                    marginTop: '28px',
                    fontSize: '18px',
                    lineHeight: '30px',
                  }}
                />

                <Button
                  mt="28px"
                  bg="#ffffff"
                  p="18px 31px"
                  mb="20px"
                  color="#000000"
                  onClick={() => navigate('/cursos')}
                  data-cy="cursos_button_modal"
                >
                  Ver todos los cursos
                </Button>
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
