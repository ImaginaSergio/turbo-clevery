type ModalVariant = 'FULL' | 'UNIQUE';
type ModalType =
  | 'remoto'
  | 'salario'
  | 'telefono'
  | 'trabajo'
  | 'traslado'
  | 'linkedin'
  | 'localizacion'
  | 'habilidades';

type ModalProps = {
  type: ModalType;
  variant: ModalVariant;
  state: { isOpen: boolean; onClose: () => void };
};

export { ModalVariant, ModalType, ModalProps };
