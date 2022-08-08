import { useNavigate } from 'react-router-dom';

import { Header } from '../../shared/components';

const Configuracion = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <Header
        head={{
          title: 'Configuración',
          onClick: () => navigate('/configuracion'),
        }}
      />

      <div className="page-body" />
    </div>
  );
};

export default Configuracion;
