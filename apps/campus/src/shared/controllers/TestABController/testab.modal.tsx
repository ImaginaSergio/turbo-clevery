import { useContext } from 'react';

import { Modal, ModalContent, ModalOverlay, useToast } from '@chakra-ui/react';

import {
  RemotoModal,
  SalarioModal,
  LinkedinModal,
  TrasladoModal,
  TelefonoModal,
  HabilidadesModal,
  TrabajoActualModal,
  LocalizacionModal,
} from './ModalContents';
import { ModalProps } from './types';
import { onFailure } from 'utils';
import { LoginContext } from '../../context';
import { addCookie, getUserByID, updateUser } from 'data';

export const TestABModal = ({ state, type, variant }: ModalProps) => {
  const toast = useToast();
  const { user, setUser } = useContext(LoginContext);

  const onUpdateUser = ({ newUser }: { newUser: any }) => {
    if (!user?.id) {
      onFailure(toast, 'Error inesperado', 'El ID de usuario es undefined. Por favor, contacte con soporte.');

      return;
    }

    updateUser({
      id: user.id,
      user: newUser,
    })
      .then(async (res) => {
        const dataUser = await getUserByID({ id: user.id || 0 });

        if (dataUser?.id) setUser({ ...dataUser });
        else console.error({ error: dataUser });
      })
      .catch((err) => console.error({ err }));

    onCloseModal();
  };

  const onCloseModal = () => {
    addCookie({ key: 'popup-delay', value: 'delay', expirationMinutes: 30 });

    state.onClose();
  };

  return (
    <Modal onClose={onCloseModal} isOpen={state.isOpen} isCentered>
      <ModalOverlay bg="rgba(16, 23, 46, 0.75)" />

      <ModalContent maxW="624px" p="42px" rounded="20px" gap="30px">
        {type === 'localizacion' && (
          <LocalizacionModal
            variant={variant}
            onClose={onCloseModal}
            onUpdate={onUpdateUser}
            defaultValue={{
              pais: user?.pais || undefined,
              estado: user?.estado || undefined,
            }}
          />
        )}

        {type === 'salario' && (
          <SalarioModal
            variant={variant}
            onClose={onCloseModal}
            onUpdate={onUpdateUser}
            defaultValue={[user?.expectativasSalarialesMin || undefined, user?.expectativasSalarialesMax || undefined]}
          />
        )}

        {type === 'remoto' && (
          <RemotoModal
            variant={variant}
            onClose={onCloseModal}
            onUpdate={onUpdateUser}
            defaultValue={{
              trabajoRemoto: user?.trabajoRemoto || undefined,
            }}
          />
        )}

        {type === 'trabajo' && (
          <TrabajoActualModal
            variant={variant}
            onClose={onCloseModal}
            onUpdate={onUpdateUser}
            defaultValue={{
              actualmenteTrabajando: user?.actualmenteTrabajando || undefined,
            }}
          />
        )}

        {type === 'traslado' && (
          <TrasladoModal
            variant={variant}
            onClose={onCloseModal}
            onUpdate={onUpdateUser}
            defaultValue={{
              posibilidadTraslado: user?.posibilidadTraslado || undefined,
            }}
          />
        )}

        {type === 'telefono' && (
          <TelefonoModal
            variant={variant}
            onClose={onCloseModal}
            onUpdate={onUpdateUser}
            defaultValue={{ telefono: user?.telefono || undefined }}
          />
        )}

        {type === 'habilidades' && (
          <HabilidadesModal
            variant={variant}
            onClose={onCloseModal}
            onUpdate={onUpdateUser}
            defaultValue={{ habilidades: user?.habilidades || [] }}
          />
        )}

        {type === 'linkedin' && (
          <LinkedinModal
            variant={variant}
            onClose={onCloseModal}
            onUpdate={onUpdateUser}
            defaultValue={{ linkedin: user?.linkedin || undefined }}
          />
        )}
      </ModalContent>
    </Modal>
  );
};
