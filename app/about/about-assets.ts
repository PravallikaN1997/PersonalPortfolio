// Photo slots for the About scrapbook.
// To replace a placeholder: drop an image into /public/about (for example portrait.jpg),
// then set `src` below to "/about/portrait.jpg" and write a real description in `alt`.
// Slots without a `src` show a labelled placeholder. Use your own photos or images you
// have the rights to; the placeholders for anime stills and book covers are meant for that.
export type Slot = { src?: string; alt: string; label: string; pos?: string };

export const ASSETS: Record<string, Slot> = {
  portrait: { src: "/about/arch.jpg", alt: "Pravallika at a railing, looking back over her shoulder and flashing a peace sign, with a natural rock arch and blue water behind her.", label: "portrait", pos: "55% 45%" },
  clouds: { src: "/about/lake.jpg", alt: "Pravallika sitting by a lake under a cloudy sky.", label: "sky", pos: "50% 30%" },
  fictional: { src: "/about/shoto.jpg", alt: "Shoto Todoroki from My Hero Academia, resting his cheek on his hand.", label: "anime still", pos: "50% 30%" },
  trek: { src: "/about/park.jpg", alt: "Pravallika posing under a sign that reads The Adventure Begins.", label: "the adventure begins", pos: "58% 50%" },
  manga: { src: "/about/manga.jpg", alt: "A black and white manga page of a boy reaching out mid-fall.", label: "manga panel", pos: "50% 30%" },
  anime1: { src: "/about/muichiro.jpg", alt: "Muichiro Tokito from Demon Slayer, arms crossed.", label: "demon slayer", pos: "50% 25%" },
  anime2: { src: "/about/maomao1.jpg", alt: "Maomao from The Apothecary Diaries as a chibi with cat ears.", label: "the apothecary diaries", pos: "50% 40%" },
  anime3: { src: "/about/gojo.jpg", alt: "Satoru Gojo from Jujutsu Kaisen, two glowing blue eyes in a dark close-up.", label: "jujutsu kaisen", pos: "50% 35%" },
  book1: { src: "/about/book-s-class.jpg", alt: "Cover of The S-Class Hunters I Raised.", label: "the s-class hunters i raised", pos: "50% 30%" },
  book2: { src: "/about/book-debut.jpg", alt: "Cover of Debut or Die!", label: "debut or die!", pos: "50% 30%" },
  book3: { src: "/about/book-ghost.jpg", alt: "Cover of Got Dropped into a Ghost Story, Still Gotta Work.", label: "got dropped into a ghost story, still gotta work", pos: "50% 30%" },
  boba: { src: "/about/boba.jpg", alt: "An easy boba milk tea in a can with a wide straw, on a glass table outdoors.", label: "boba", pos: "50% 55%" },
  outside1: { src: "/about/temple.jpg", alt: "Carved stone friezes on the outer wall of an old temple.", label: "architecture" },
  outside2: { src: "/about/autumn.jpg", alt: "A path through autumn trees and fallen leaves.", label: "autumn walk" },
  outside3: { src: "/about/street.jpg", alt: "A quiet street at night with lights wrapped around the trees.", label: "night walk", pos: "50% 55%" },
  gym: { src: "/about/gym.jpg", alt: "White sneakers next to a 5 kg dumbbell on a gym floor.", label: "gym shoes", pos: "50% 62%" },
  photography: { src: "/about/station.jpg", alt: "People walking along a train at a station platform in golden evening light.", label: "photography", pos: "50% 55%" },
  food: { src: "/about/food.jpg", alt: "A bowl of noodles with chopsticks, next to a laptop playing an animated film.", label: "good food", pos: "60% 80%" },
  skies: { src: "/about/sunset.jpg", alt: "A sunset sky over a city skyline and river, seen from a bridge.", label: "random skies", pos: "50% 35%" },
  music: { src: "/about/vinyl.jpg", alt: "A crate of vinyl records with a Conan Gray album at the front.", label: "music", pos: "40% 70%" },
  workspace: { src: "/about/cafe.jpg", alt: "A latte and a pastry on a cafe table beside an open laptop.", label: "workspaces", pos: "70% 70%" },
};
