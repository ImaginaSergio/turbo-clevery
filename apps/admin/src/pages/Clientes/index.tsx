import { useEffect, useState } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { Header } from '../../shared/components';

import VacantesTable from './views/Vacantes/Table';
import VacantesForm from './views/Vacantes/Form/Form';
import VacantesInformation from './views/Vacantes/Information/Information';

import EmpresasTable from './views/Empresas/Table';
import EmpresasForm from './views/Empresas/Form/Form';
import EmpresasInformation from './views/Empresas/Information/Information';

import BoostsTable from './views/Boosts/Table';
import BoostsForm from './views/Boosts/Form/Form';
import BoostsInformation from './views/Boosts/Information/Information';

import './Clientes.scss';

const Clientes = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [breadcrumbChildren, setBreadcrumbChildren] = useState<string>('');
  const [breadcrumbNavigate, setBreadcrumbNavigate] = useState<string>('');

  useEffect(() => {
    const path = location.pathname;

    if (path.startsWith('/clientes/vacantes')) {
      if (path === '/clientes/vacantes/new') {
        setBreadcrumbChildren('Nueva vacante');
        setBreadcrumbNavigate('/clientes/vacantes');
      } else if (path !== '/clientes/vacantes') {
        setBreadcrumbChildren('Información de la vacante');
        setBreadcrumbNavigate('/clientes/vacantes');
      } else {
        setBreadcrumbChildren('');
        setBreadcrumbNavigate('');
      }
    } else if (path.startsWith('/clientes/empresas')) {
      if (path === '/clientes/empresas/new') {
        setBreadcrumbChildren('Nueva empresa');
        setBreadcrumbNavigate('/clientes/empresas');
      } else if (path !== '/clientes/empresas') {
        setBreadcrumbChildren('Información de la empresa');
        setBreadcrumbNavigate('/clientes/empresas');
      } else {
        setBreadcrumbChildren('');
        setBreadcrumbNavigate('');
      }
    } else if (path.startsWith('/clientes/boosts')) {
      if (path === '/clientes/boosts/new') {
        setBreadcrumbChildren('Nuevo boost');
        setBreadcrumbNavigate('/clientes/boosts');
      } else if (path !== '/clientes/boosts') {
        setBreadcrumbChildren('Información del boost');
        setBreadcrumbNavigate('/clientes/boosts');
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
          title: 'Clientes',
          onClick: () => navigate(breadcrumbNavigate),
          children: breadcrumbChildren
            ? [{ title: breadcrumbChildren, isActive: true }]
            : undefined,
        }}
      />

      <div className="page-body">
        <Routes>
          <Route path="empresas">
            <Route index element={<EmpresasTable />} />
            <Route path="new" element={<EmpresasForm />} />
            <Route path=":empresaID" element={<EmpresasInformation />} />
          </Route>

          <Route path="boosts">
            <Route index element={<BoostsTable />} />
            <Route path="new" element={<BoostsForm />} />
            <Route path=":boostID" element={<BoostsInformation />} />
          </Route>

          <Route path="vacantes">
            <Route index element={<VacantesTable />} />
            <Route path="new" element={<VacantesForm />} />
            <Route path=":vacanteID" element={<VacantesInformation />} />
          </Route>
          <Route path="*" element={<Navigate to="/clientes/empresas" />} />
        </Routes>
      </div>
    </div>
  );
};

export default Clientes;
