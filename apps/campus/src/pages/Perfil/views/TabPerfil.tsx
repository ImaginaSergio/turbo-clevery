import { useContext, useEffect, useState } from 'react';

import { Button, Flex, useToast } from '@chakra-ui/react';

import {
  IPais,
  IEstado,
  getPaises,
  getEstados,
  UserRolEnum,
  getUserByID,
  removeAvatar,
  uploadAvatar,
  checkIfUsernameExists,
} from 'data';
import { onFailure } from 'utils';
import { LoginContext } from '../../../shared/context';
import { OpenAvatarUploader } from '../../../shared/components';
import { OpenInput, OpenPhoneInput, OpenSelect } from 'ui';
import { debounce } from 'lodash';

export const TabPerfil = ({
  updateValue,
  onRefresh,
}: {
  updateValue: any;
  onRefresh: ({ newUser }: { newUser: any }) => any;
}) => {
  const toast = useToast();
  const { user } = useContext(LoginContext);

  const [nombre, setNombre] = useState<string>(user?.nombre || '');
  const [apellidos, setApellidos] = useState<string>(user?.apellidos || '');
  const [telefono, setTelefono] = useState<string>(user?.telefono || '');

  const [username, setUsername] = useState<string>(user?.username || '');
  const [pais, setPais] = useState<IPais | null>(user?.pais || null);
  const [estado, setEstado] = useState<IEstado | null>(user?.estado || null);

  const [paises, setPaises] = useState([]);
  const [estados, setEstados] = useState([]);

  const [pending, setPending] = useState<boolean>(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState<boolean>(false);

  useEffect(() => {
    getAllpaises();
  }, []);

  useEffect(() => {
    if (pais) getAllEstados();
  }, [pais]);

  const getAllpaises = async () => {
    let _paises: any = await getPaises({});

    setPaises(
      _paises.map((c: IPais) => ({
        label: `${c.bandera} ${c.nombre}`,
        value: { label: c.nombre, value: c },
        'data-cy': `${c.nombre}_option`,
      }))
    );
  };

  const getAllEstados = async () => {
    let estados: any = await getEstados({ query: [{ pais_id: pais?.id }] });

    setEstados(
      estados.map((estado: IEstado) => ({
        label: estado.nombre,
        value: { label: estado.nombre, value: estado },
        'data-cy': `${estado.nombre}_option`,
      }))
    );
  };

  const onAvatarLoad = async (data: any) => {
    if (!user?.id) {
      onFailure(toast, 'Error inesperado', 'El ID de usuario es undefined. Por favor, contacte con soporte.');
      return;
    }

    const dataUser = await getUserByID({ id: user.id });

    if (!dataUser.isAxiosError) onRefresh({ newUser: dataUser });
    else console.error({ error: dataUser });
  };

  const handleRemove = async () => {
    if (!user?.id) {
      onFailure(toast, 'Error inesperado', 'El ID de usuario es undefined. Por favor, contacte con soporte.');
      return;
    }

    setIsUploadingAvatar(true);

    await removeAvatar({ id: user?.id })
      .then(async () => {
        const dataUser = await getUserByID({ id: user?.id || 0 });

        if (!dataUser.isAxiosError) onRefresh({ newUser: dataUser });
        else console.error({ error: dataUser });
      })
      .catch((err) => console.error({ err }));

    setIsUploadingAvatar(false);
  };

  const handleUpload = async (acceptedFiles: File[]) => {
    setIsUploadingAvatar(true);

    const data = await uploadAvatar({ files: acceptedFiles });
    await onAvatarLoad(data);

    setIsUploadingAvatar(false);
  };

  const handleUpdate = () => {
    let newData: any = {
      nombre,
      apellidos,
      telefono,
      paisId: pais?.id,
      estadoId: estado?.id,
    };

    // Non-duplicated data validation
    if (username !== user?.username) newData.username = username;

    updateValue({ newData });
    setPending(false);
  };

  const validateUsername = debounce(async (value: string, resolve: (val: string) => void) => {
    let error;
    const res: any = await checkIfUsernameExists({ username: value });

    if (res?.data?.exists !== false && user?.username !== value) error = res.data.message;

    if (value === '') error = 'No puede dejar vacío este campo';

    return resolve(error);
  }, 500);

  return (
    <Flex w="100%" direction="column" gap="32px">
      <OpenAvatarUploader
        size="90px"
        onUpload={handleUpload}
        onDelete={handleRemove}
        src={user?.avatar?.url}
        isUploading={isUploadingAvatar}
        allowGif={user?.rol === UserRolEnum.ADMIN}
        name={user?.username || 'Avatar del usuario'}
      />

      <OpenInput
        name="username"
        label="Nombre de usuario"
        defaultValue={username}
        onValidate={async (value) => new Promise((resolve) => validateUsername(value || '', resolve))}
        onChange={(value: any) => {
          if (!pending) setPending(true);

          setUsername(value.username);
        }}
      />

      <OpenInput
        name="nombre"
        label="Nombre"
        defaultValue={nombre}
        onChange={(value: any) => {
          if (!pending) setPending(true);

          setNombre(value.nombre);
        }}
      />

      <OpenInput
        name="apellidos"
        label="Apellidos"
        defaultValue={apellidos}
        onChange={(value: any) => {
          if (!pending) setPending(true);
          setApellidos(value.apellidos);
        }}
      />

      <OpenPhoneInput
        name="telefono"
        label="Teléfono"
        defaultValue={telefono}
        onChange={(value: any) => {
          if (!pending) setPending(true);
          setTelefono(value.telefono);
        }}
      />

      <OpenSelect
        label="País"
        name="pais"
        placeholder="Elige un país del listado"
        options={paises}
        defaultValue={pais ? { label: `${pais.bandera} ${pais.nombre}`, value: pais } : undefined}
        onChange={(e: any) => {
          if (!pending) setPending(true);
          setPais(e.value);
        }}
      />

      <OpenSelect
        label="Localidad"
        name="estado"
        placeholder="Elige una región del listado"
        options={estados}
        isDisabled={!pais || !pais?.nombre}
        defaultValue={estado ? { label: estado.nombre, value: estado } : estado}
        onChange={(e: any) => {
          if (!pending) setPending(true);
          setEstado(e.value);
        }}
      />

      {pending && (
        <Flex w="100%" justify="flex-start" mb="40px">
          <Button h="46px" bg="gray_3" rounded="12px" fontSize="14px" fontWeight="bold" onClick={() => setPending(false)}>
            Descartar cambios
          </Button>

          <Button
            h="46px"
            ml="17px"
            bg="primary"
            color="white"
            rounded="12px"
            fontSize="14px"
            fontWeight="bold"
            onClick={handleUpdate}
            data-cy="guardar_cambios_perfil"
          >
            Guardar cambios
          </Button>
        </Flex>
      )}
    </Flex>
  );
};
