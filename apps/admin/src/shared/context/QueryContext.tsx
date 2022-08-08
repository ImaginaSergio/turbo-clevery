import { createContext } from 'react';

interface ContextProps {
  page: string;
  setPage: (e: any) => any;
  query: Map<string, any>;
  setQuery: (key: string, value: any) => any;
  resetQuery: () => any;
}

export const QueryContext = createContext<ContextProps>({
  page: '',
  setPage: (e: any) => {},
  query: new Map<string, any>(),
  setQuery: (e: any) => {},
  resetQuery: () => {},
});
