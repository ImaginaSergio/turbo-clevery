import { createContext } from 'react';

import { FavoritoTipoEnum, IFavorito } from 'data';

interface ContextProps {
  favoritos: IFavorito[];
  addFavorito: (favorito: IFavorito) => void;
  removeFavorito: (favorito: IFavorito) => void;
  controladorFav: (favorito: IFavorito, action: boolean) => void;
  filterFavoritos: (query: string) => void;
}

export const FavoritosContext = createContext<ContextProps>({
  favoritos: [],
  addFavorito: (f: IFavorito) => {},
  removeFavorito: (f: IFavorito) => {},
  controladorFav: (f: IFavorito, a: boolean) => {},
  filterFavoritos: (q: string) => {},
});
