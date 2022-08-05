import { ICurso, IProyectoBoost, RutaItinerario, RutaItinerarioLoaded, RutaItinerarioTipoEnum } from '../index';

/**
 * Ordenamos los objetos :)
 * @param cursos Array de cursos precargados del itinerario de la ruta
 * @param proyectos Array de proyectos precargados del itinerario de la ruta
 * @param itinerario Itinerario de la ruta por la cual ordenar ambos arrays
 * @returns Itinerario con los objetos precargados en el orden establecido.
 */
const sortByRoadmap = (
  cursos: ICurso[] = [],
  proyectos: IProyectoBoost[] = [],
  itinerario: RutaItinerario[] = []
): RutaItinerarioLoaded[] => {
  let res: RutaItinerarioLoaded[] = [];

  for (const item of itinerario) {
    if (item.tipo === RutaItinerarioTipoEnum.CURSO) {
      let c = cursos?.find((c) => c.id === item.id);

      if (c !== undefined) res.push({ ...item, curso: c });
    } else if (item.tipo === RutaItinerarioTipoEnum.PROYECTO) {
      let p = proyectos?.find((p) => p.id === item.id);

      if (p !== undefined) res.push({ ...item, proyecto: p });
    }
  }

  return res;
};

export { sortByRoadmap };
