import { useState, useEffect } from 'react';
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from 'react-router-dom';

import { Header } from '../../shared/components';

import AlumnosTable from './views/Alumnos/Table';
import AlumnosInformation from './views/Alumnos/Information/Information';

import GruposTable from './views/Grupos/Table';
import GruposInformation from './views/Grupos/Information/Information';

import EjerciciosTable from './views/Ejercicios/Table';
import EjerciciosCorreccion from './views/Ejercicios/Correccion/Information';

import CursosTable from './views/StatsCurso/Table';
import CursosCover from './views/StatsCurso/Cover';
import HabilidadesTable from './views/StatsHabilidad/Table';

import './Alumnado.scss';

const Usuarios = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [breadcrumbChildren, setBreadcrumbChildren] = useState<string>('');
  const [breadcrumbNavigate, setBreadcrumbNavigate] = useState<string>('');

  useEffect(() => {
    const path = location.pathname;

    if (path.startsWith('/alumnado/ejercicios')) {
      setBreadcrumbNavigate('/alumnado/ejercicios');

      if (path === '/alumnado/ejercicios') setBreadcrumbChildren('');
      else setBreadcrumbChildren('Información del ejercicio');
    } else if (path.startsWith('/alumnado/grupos')) {
      setBreadcrumbNavigate('/alumnado/grupos');

      if (path === '/alumnado/grupos') setBreadcrumbChildren('');
      else setBreadcrumbChildren('Información del grupo');
    } else if (path.startsWith('/alumnado/usuarios')) {
      setBreadcrumbNavigate('/alumnado/usuarios');

      if (path === '/alumnado/usuarios') setBreadcrumbChildren('');
      else setBreadcrumbChildren('Información del usuario');
    } else {
      setBreadcrumbChildren('');
      setBreadcrumbNavigate('');
    }
  }, [location.pathname]);

  return (
    <div className="page-container">
      <Header
        head={{
          title: 'Alumnado',
          onClick: () => navigate(breadcrumbNavigate),
          children: breadcrumbChildren
            ? [{ title: breadcrumbChildren, isActive: true }]
            : undefined,
        }}
      />

      <div className="page-body">
        <Routes>
          <Route path="usuarios">
            <Route index element={<AlumnosTable />} />
            <Route path=":userId" element={<AlumnosInformation />} />
          </Route>

          <Route path="ejercicios">
            <Route index element={<EjerciciosTable />} />
            <Route path=":ejercicioId" element={<EjerciciosCorreccion />} />
          </Route>

          <Route path="stats-habilidad">
            <Route index element={<HabilidadesTable />} />
            <Route path="habilidades" element={<HabilidadesTable />} />
          </Route>

          <Route path="stats-curso">
            <Route index element={<CursosTable />} />
            <Route path=":cursoId" element={<CursosCover />} />
          </Route>

          <Route path="grupos">
            <Route index element={<GruposTable />} />
            <Route path=":grupoID" element={<GruposInformation />} />
          </Route>

          <Route path="*" element={<Navigate to="/alumnado/usuarios" />} />
        </Routes>
      </div>
    </div>
  );
};

export default Usuarios;
