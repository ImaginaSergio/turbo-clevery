import { useEffect, useState } from 'react';
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from 'react-router-dom';

import { Header } from '../../shared/components';

import PlantillasForm from './views/Plantillas/Form';
import PlantillasTable from './views/Plantillas/Table';
import NoticiasTable from './views/Noticias/Table';
import NoticiasForm from './views/Noticias/Form/Form';
import NoticiasInformation from './views/Noticias/Information/Information';
import PlantillasInformation from './views/Plantillas/Information/Information';

import './Miscelanea.scss';

const Miscelanea = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [breadcrumbNavigate, setBreadcrumbNavigate] = useState<string>('');
  const [breadcrumbChildren, setBreadcrumbChildren] = useState<string>('');

  useEffect(() => {
    const path = location.pathname;

    if (path.startsWith('/miscelanea/plantillas')) {
      setBreadcrumbNavigate('/miscelanea/plantillas');

      if (path === '/miscelanea/plantillas/new')
        setBreadcrumbChildren('Nueva plantilla');
      else if (path !== '/miscelanea/plantillas')
        setBreadcrumbChildren('Información de la plantilla');
      else setBreadcrumbChildren('');
    } else if (path.startsWith('/miscelanea/noticias')) {
      setBreadcrumbNavigate('/miscelanea/noticias');

      if (path === '/miscelanea/noticias/new')
        setBreadcrumbChildren('Nueva noticia');
      else if (path !== '/miscelanea/noticias')
        setBreadcrumbChildren('Información de la noticia');
      else setBreadcrumbChildren('');
    } else {
      setBreadcrumbNavigate('');
      setBreadcrumbChildren('');
    }
  }, [location.pathname]);

  return (
    <div className="page-container">
      <Header
        head={{
          title: 'Miscelánea',
          onClick: () => navigate(breadcrumbNavigate),
          children: breadcrumbChildren
            ? [{ title: breadcrumbChildren, isActive: true }]
            : undefined,
        }}
      />

      <div className="page-body">
        <Routes>
          <Route path="plantillas">
            <Route index element={<PlantillasTable />} />
            <Route path="new" element={<PlantillasForm />} />
            <Route path=":plantillaID" element={<PlantillasInformation />} />
          </Route>

          <Route path="noticias">
            <Route index element={<NoticiasTable />} />
            <Route path="new" element={<NoticiasForm />} />
            <Route path=":noticiaID" element={<NoticiasInformation />} />
          </Route>

          <Route path="*" element={<Navigate to="/miscelanea/plantillas" />} />
        </Routes>
      </div>
    </div>
  );
};

export default Miscelanea;
