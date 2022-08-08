import { useContext } from 'react';

import { Box, Flex } from '@chakra-ui/react';

import {
  InformationInput,
  InformationSelect,
  InformationTextEditor,
  InformationFilepond,
  InformationAsyncSelect,
} from '../../../../../shared/components';
import { LoginContext } from '../../../../../shared/context';

import { isRoleAllowed } from 'utils';
import { INoticia, getUsers, UserRolEnum } from 'data';

type TabInformacionProps = {
  noticia: INoticia;
  updateValue: (value: any) => void;
};

export const TabInformacion = ({ noticia, updateValue }: TabInformacionProps) => {
  const { user } = useContext(LoginContext);

  const loadAutores = async (value: string) => {
    if (value.includes('@')) {
      const _usuarios = await getUsers({
        client: 'admin',
        query: [{ email: value }],
      });

      return _usuarios?.data?.map((user: any) => ({
        value: user.id,
        label: user.email,
      }));
    } else {
      const _usuarios = await getUsers({
        client: 'admin',
        query: [{ nombre: value }],
      });

      return _usuarios?.data?.map((user: any) => ({
        value: user.id,
        label: (user?.nombre || ' ') + ' ' + (user?.apellidos || ' '),
      }));
    }
  };

  return (
    <Flex p="30px" gap="30px" boxSize="100%" direction="column" overflow="auto">
      <Flex minH="fit-content" w="100%" direction="column" rowGap="8px">
        <Box fontSize="18px" fontWeight="semibold">
          Información General
        </Box>

        <Box fontSize="14px" fontWeight="medium" color="#84889A">
          Información sobre la noticia, como el título de la misma, descripción, logotipo, etc...
        </Box>
      </Flex>

      <Flex gap="30px" w="100%" direction={{ base: 'column', lg: 'row' }}>
        <Flex direction="column" w="100%" gap="30px">
          <InformationInput
            name="titulo"
            label="Titulo del noticia"
            defaultValue={noticia?.titulo}
            isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
            updateValue={updateValue}
          />

          <Flex w="100%" gap="30px" direction={{ base: 'column', lg: 'row' }}>
            <InformationSelect
              name="publicado"
              label="Estado"
              placeholder="Selecciona una opción"
              options={[
                { label: 'Publicado', value: true },
                { label: 'Oculto', value: false },
              ]}
              defaultValue={{
                label: noticia?.publicado ? 'Publicado' : 'Oculto',
                value: noticia?.publicado,
              }}
              updateValue={updateValue}
              isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
              style={{ width: '100%' }}
            />

            <InformationAsyncSelect
              name="autorId"
              label="Autor"
              placeholder="Escribe para buscar"
              updateValue={updateValue}
              loadOptions={loadAutores}
              style={{ width: '100%' }}
              defaultValue={
                noticia?.autor
                  ? {
                      label: noticia?.autor?.username,
                      value: noticia?.autorId,
                    }
                  : {}
              }
            />
          </Flex>

          <InformationFilepond
            name="imagen"
            label="Portada"
            putEP={'/godAPI/noticias/' + noticia.id}
            isDisabled={!noticia?.id}
          />

          <InformationTextEditor
            name="descripcionCorta"
            label="Descripción corta"
            placeholder="Introduce el texto"
            defaultValue={noticia?.descripcionCorta}
            updateValue={updateValue}
            isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
          />

          <InformationTextEditor
            name="descripcion"
            label="Contenido de la noticia"
            placeholder="Introduce el texto"
            defaultValue={noticia?.contenido}
            updateValue={updateValue}
            isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
