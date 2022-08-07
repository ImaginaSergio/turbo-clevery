import { useCallback, useContext, useEffect, useState } from 'react';

import { IFavorito, getFavoritos, addFavorito as serverAddFavorito, removeFavorito as serverRemoveFavorito } from 'data';
import { debounce } from 'lodash';

import { FavoritosContext, LoginContext } from '../../context';

export const FavoritosController = ({ children, ...props }: any) => {
  const { user } = useContext(LoginContext);
  const [favoritos, setFavoritos] = useState<IFavorito[]>([]);

  useEffect(() => {
    if (user !== undefined && user) {
      // Cuando iniciemos sesión, cargamos listado de favoritos
      (async () => {
        const dataFavoritos = await getFavoritos({
          client: 'campus',
          strategy: 'invalidate-on-undefined',
          query: [{ user_id: user?.id }, { limit: 10000 }],
        });

        setFavoritos(dataFavoritos?.data || []);
      })();
    }
  }, [user]);

  // TODO: WIP (faltan endpoints de back)
  const filterFavoritos = (query: string) => {};

  const addFavorito = useCallback((newFavorito: IFavorito) => {
    const last: any[] = [...favoritos];
    setFavoritos([...last, newFavorito]);
    debounceAddFav(newFavorito);
  }, []);

  const removeFavorito = useCallback((favorito: IFavorito) => {
    const last: any[] = [...favoritos]
      ?.map((fav) =>
        fav.objetoId == favorito.objetoId && fav.tipo === favorito.tipo && fav.userId == favorito.userId ? undefined : fav
      )
      ?.filter((fav) => fav);

    setFavoritos([...last]);
    debounceRemoveFav(favorito);
  }, []);

  const controladorFav = useCallback(
    (favorito: IFavorito, action: boolean) => {
      if (!action) {
        const last: any[] = [...favoritos]
          ?.map((fav) =>
            fav.objetoId == favorito.objetoId && fav.tipo === favorito.tipo && fav.userId == favorito.userId ? undefined : fav
          )
          ?.filter((fav) => fav);
        setFavoritos([...last]);
        debounceRemoveFav(favorito);
      } else {
        setFavoritos([...favoritos, favorito]);
        debounceAddFav(favorito);
      }
    },
    [favoritos]
  );

  const debounceRemoveFav = debounce((favorito: IFavorito) => {
    serverRemoveFavorito({
      id: favorito?.id || 'Llega como undefined',
    }).catch((error) => {
      console.error('¡Error al eliminar el favorito!', { error });
    });
  }, 10);

  const debounceAddFav = debounce((newFavorito: IFavorito) => {
    serverAddFavorito({
      favorito: { ...newFavorito, objeto: undefined },
    })
      .then((value) => {
        newFavorito.id = value.value.id;
        const last: any[] = [...favoritos]
          ?.map((fav) =>
            fav.objetoId == newFavorito.objetoId && fav.tipo === newFavorito.tipo && fav.userId == newFavorito.userId
              ? undefined
              : fav
          )
          ?.filter((fav) => fav);
        setFavoritos([...last, newFavorito]);
      })
      .catch((error) => {
        console.error('¡Error al guardar el favorito!', { error });
      });
  }, 10);

  return (
    <FavoritosContext.Provider
      value={{
        favoritos,
        addFavorito,
        removeFavorito,
        filterFavoritos,
        controladorFav,
      }}
    >
      {children}
    </FavoritosContext.Provider>
  );
};
