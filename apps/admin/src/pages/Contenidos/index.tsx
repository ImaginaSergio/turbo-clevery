import { useEffect, useState } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { Header } from '../../shared/components';

import CertificacionesTable from './views/Certificaciones/Table';
import CertificacionesForm from './views/Certificaciones/Form';
import CertificacionesInformation from './views/Certificaciones/Information/Information';

import CursosForm from './views/Cursos/Form';
import CursosTable from './views/Cursos/Table';
import CursosInformation from './views/Cursos/Information/Information';

import RutasForm from './views/Rutas/Form';
import RutasTable from './views/Rutas/Table';
import RutasInformation from './views/Rutas/Information';

import HabilidadesForm from './views/Habilidades/Form';
import HabilidadesTable from './views/Habilidades/Table';
import HabilidadesInformation from './views/Habilidades/Information/Information';

import './Contenidos.scss';

const Contenidos = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [breadcrumbChildren, setBreadcrumbChildren] = useState<string>('');
  const [breadcrumbNavigate, setBreadcrumbNavigate] = useState<string>('');

  useEffect(() => {
    const path = location.pathname;

    if (path.startsWith('/contenidos/cursos')) {
      if (path === '/contenidos/cursos/new') {
        setBreadcrumbChildren('Nuevo curso');
        setBreadcrumbNavigate('/contenidos/cursos');
      } else if (path !== '/contenidos/cursos') {
        setBreadcrumbChildren('Información del curso');
        setBreadcrumbNavigate('/contenidos/cursos');
      } else {
        setBreadcrumbChildren('');
        setBreadcrumbNavigate('');
      }
    } else if (path.startsWith('/contenidos/certificaciones')) {
      if (path === '/contenidos/certificaciones/new') {
        setBreadcrumbChildren('Nueva certificación');
        setBreadcrumbNavigate('/contenidos/certificaciones');
      } else if (path !== '/contenidos/certificaciones') {
        setBreadcrumbChildren('Información de la certificación');
        setBreadcrumbNavigate('/contenidos/certificaciones');
      } else {
        setBreadcrumbChildren('');
        setBreadcrumbNavigate('');
      }
    } else if (path.startsWith('/contenidos/rutas')) {
      if (path === '/contenidos/rutas/new') {
        setBreadcrumbChildren('Nueva hoja de ruta');
        setBreadcrumbNavigate('/contenidos/ruta');
      } else if (path !== '/contenidos/rutas') {
        setBreadcrumbChildren('Información de la hoja de ruta');
        setBreadcrumbNavigate('/contenidos/ruta');
      } else {
        setBreadcrumbChildren('');
        setBreadcrumbNavigate('');
      }
    } else if (path.startsWith('/contenidos/habilidades')) {
      if (path === '/contenidos/habilidades/new') {
        setBreadcrumbChildren('Nueva habilidad');
        setBreadcrumbNavigate('/contenidos/habilidades');
      } else if (path !== '/contenidos/habilidades') {
        setBreadcrumbChildren('Información de la habilidad');
        setBreadcrumbNavigate('/contenidos/habilidades');
      } else {
        setBreadcrumbChildren('');
        setBreadcrumbNavigate('');
      }
    }
  }, [location.pathname]);

  return (
    <div className="page-container">
      <Header
        head={{
          title: 'Contenidos',
          onClick: () => navigate(breadcrumbNavigate),
          children: breadcrumbChildren
            ? [{ title: breadcrumbChildren, isActive: true }]
            : undefined,
        }}
      />

      <div className="page-body">
        <Routes>
          <Route path="cursos">
            <Route index element={<CursosTable />} />
            <Route path="new" element={<CursosForm />} />
            <Route path=":cursoID" element={<CursosInformation />} />
          </Route>

          <Route path="certificaciones">
            <Route index element={<CertificacionesTable />} />
            <Route path="new" element={<CertificacionesForm />} />
            <Route
              path=":certificacionID"
              element={<CertificacionesInformation />}
            />
          </Route>

          <Route path="rutas">
            <Route index element={<RutasTable />} />
            <Route path="new" element={<RutasForm />} />
            <Route path=":rutaID" element={<RutasInformation />} />
          </Route>

          <Route path="habilidades">
            <Route index element={<HabilidadesTable />} />
            <Route path="new" element={<HabilidadesForm />} />
            <Route path=":habilidadID" element={<HabilidadesInformation />} />
          </Route>

          <Route path="*" element={<Navigate to="/contenidos/cursos" />} />
        </Routes>
      </div>
    </div>
  );
};

export default Contenidos;
