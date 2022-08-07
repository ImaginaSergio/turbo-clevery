import { createContext } from 'react';

interface ITestLivecoder {
  nombre: string;
  variante: 'A' | 'B';
}

interface ContextProps {
  testsList: ITestLivecoder[];
  setTestsList: (e: ITestLivecoder[]) => void;
}

export const TestABContext = createContext<ContextProps>({
  testsList: [],
  setTestsList: (e: ITestLivecoder[]) => {},
});
