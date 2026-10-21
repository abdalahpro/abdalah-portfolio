export interface Reel {
  id: string;
  /** Vidéo complète (lightbox) — chargée seulement à l'ouverture. */
  src: string;
  /** Boucle muette de 9 s utilisée pour les aperçus. */
  loop: string;
  poster: string;
  /** Index dans dict.reels.captions (les accroches tournent en boucle). */
  caption: number;
}

const COUNT = 27;

/** Ordre inversé par rapport au portfolio d'Erfero : la vidéo 27 passe en
 * premier, la 01 en dernier. */
export const reels: Reel[] = Array.from({ length: COUNT }, (_, i) => {
  const n = String(COUNT - i).padStart(2, "0");
  return {
    id: `reel-${n}`,
    src: `/reels/full/reel-${n}.mp4`,
    loop: `/reels/loop/reel-${n}.mp4`,
    poster: `/reels/posters/reel-${n}.webp`,
    caption: i % 10,
  };
});
