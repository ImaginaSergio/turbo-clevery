import { useState } from 'react';
import { TestABContext } from '../../context';

export const TestABController = ({ children, ...props }: any) => {
  // 1. Cargamos todos los tests AB de la bbdd
  const [testsList, setTestsList] = useState<any[]>([]);

  return (
    <TestABContext.Provider value={{ testsList, setTestsList }}>
      {children}
    </TestABContext.Provider>
  );
};
