import type { SvgStampConfig } from './database';

/* ---------- 100 Curated Real-Life Zhu Stamps ---------- */

export const DEFAULT_STAMPS: SvgStampConfig[] = [
  // ── Bodily States ──
  { name: 'Cold Zhu',        description: 'Brrr! Shivering in the freezing weather, wrapped up tight.',                                    color: 'sky',      expression: 'cold',    accessory: 'scarf',         pose: 'shivering' },
  { name: 'Hot Zhu',         description: 'Sweating buckets under the blazing sun, desperately seeking shade.',                           color: 'coral',    expression: 'sad',     accessory: 'none',          pose: 'standing' },
  { name: 'Sweaty Zhu',      description: 'Just finished a marathon — dripping with sweat and feeling accomplished.',                     color: 'peach',    expression: 'happy',   accessory: 'none',          pose: 'running' },
  { name: 'Wet Zhu',         description: 'Caught in a downpour without an umbrella. Completely soaked!',                                 color: 'sky',      expression: 'sad',     accessory: 'umbrella',      pose: 'standing' },
  { name: 'Sick Zhu',        description: 'Running a fever, thermometer in mouth, wrapped in blankets.',                                  color: 'lime',     expression: 'sick',    accessory: 'thermometer',   pose: 'sleeping' },
  { name: 'Sneezy Zhu',      description: 'Allergy season is here — tissue at the ready for the next achoo!',                             color: 'pink',     expression: 'surprised', accessory: 'none',     pose: 'standing' },
  { name: 'Hurt Zhu',        description: 'Ouch! Tripped and bumped his head — sporting a bandage with pride.',                           color: 'peach',    expression: 'sad',     accessory: 'bandage',       pose: 'standing' },
  { name: 'Tired Zhu',       description: 'Exhausted after a long day. Barely keeping those eyes open.',                                   color: 'cream',    expression: 'sleepy',  accessory: 'pillow',        pose: 'sleeping' },

  // ── Bathroom Humor ──
  { name: 'Poop Zhu',        description: 'Occupied! Currently doing important business and not to be disturbed.',                        color: 'peach',    expression: 'focused', accessory: 'none',          pose: 'sitting' },
  { name: 'Fart Zhu',        description: 'Silent but deadly. Pretending like nothing happened.',                                         color: 'lime',     expression: 'happy',   accessory: 'none',          pose: 'standing' },
  { name: 'Pee Zhu',         description: 'When you really gotta go and the bathroom is finally in sight!',                               color: 'sky',      expression: 'scared',  accessory: 'none',          pose: 'running' },
  { name: 'Constipated Zhu', description: 'Straining and struggling. This might take a while...',                                         color: 'coral',    expression: 'angry',   accessory: 'none',          pose: 'sitting' },
  { name: 'Stinky Zhu',      description: 'Haven\'t showered in days. The flies are starting to circle.',                                 color: 'lime',     expression: 'cool',    accessory: 'mud_splat',     pose: 'standing' },

  // ── Emotions ──
  { name: 'Happy Zhu',       description: 'Pure joy radiating from this cheerful little pig! Everything is wonderful.',                    color: 'pink',     expression: 'happy',   accessory: 'none',          pose: 'waving' },
  { name: 'Sad Zhu',         description: 'Feeling blue. Sometimes you just need a good cry and a hug.',                                  color: 'sky',      expression: 'sad',     accessory: 'none',          pose: 'standing' },
  { name: 'Angry Zhu',       description: 'Absolutely furious! Steam coming out of those ears. Don\'t mess with this pig.',               color: 'coral',    expression: 'angry',   accessory: 'none',          pose: 'standing' },
  { name: 'Scared Zhu',      description: 'Wide-eyed and trembling after watching a horror movie. Every shadow is a monster!',            color: 'lavender', expression: 'scared',  accessory: 'none',          pose: 'shivering' },
  { name: 'Nervous Zhu',     description: 'Sweating bullets before a big presentation. Palms are clammy, heart is racing.',               color: 'cream',    expression: 'scared',  accessory: 'coffee_cup',    pose: 'standing' },
  { name: 'Proud Zhu',       description: 'Just won first place! Chest puffed out, basking in glory.',                                    color: 'pink',     expression: 'proud',   accessory: 'crown',         pose: 'standing' },
  { name: 'Jealous Zhu',     description: 'Looking at someone else\'s plate with envy. Why does theirs look better?',                     color: 'lime',     expression: 'angry',   accessory: 'none',          pose: 'standing' },
  { name: 'Shy Zhu',         description: 'Hiding behind those ears. Too embarrassed to say hello to their crush.',                        color: 'pink',     expression: 'happy',   accessory: 'flower_crown',  pose: 'standing' },
  { name: 'Confused Zhu',    description: 'Wait... what? Nothing makes sense right now. Head is spinning.',                                color: 'lavender', expression: 'confused', accessory: 'none',          pose: 'thinking' },
  { name: 'Surprised Zhu',   description: 'Did NOT see that coming! Jaw dropped, eyes wide open in disbelief.',                            color: 'peach',    expression: 'surprised', accessory: 'none',        pose: 'standing' },
  { name: 'Bored Zhu',       description: 'Staring at the clock watching seconds tick by. When will this meeting end?',                   color: 'cream',    expression: 'sleepy',  accessory: 'coffee_cup',    pose: 'sitting' },
  { name: 'Excited Zhu',     description: 'Can\'t contain the energy! Bouncing up and down with pure excitement!',                         color: 'pink',     expression: 'happy',   accessory: 'party_hat',     pose: 'dancing' },

  // ── Love ──
  { name: 'In Love Zhu',     description: 'Hearts floating all around. Head over hooves for someone special.',                             color: 'pink',     expression: 'loving',  accessory: 'flower_crown',  pose: 'waving' },
  { name: 'Heartbroken Zhu', description: 'Crying into a tub of ice cream after a rough breakup. It hurts so bad.',                        color: 'sky',      expression: 'sad',     accessory: 'none',          pose: 'sleeping' },
  { name: 'Flirty Zhu',      description: 'Winking and looking sharp in a bow tie. Ready for date night!',                                color: 'peach',    expression: 'cool',    accessory: 'bow_tie',       pose: 'waving' },
  { name: 'Romantic Zhu',    description: 'Roses and candlelight. Setting the mood for a perfect evening.',                                color: 'pink',     expression: 'loving',  accessory: 'flower_crown',  pose: 'standing' },

  // ── Professions ──
  { name: 'Chef Zhu',        description: 'Master of the kitchen! Whipping up delicious dishes with flair.',                               color: 'peach',    expression: 'happy',   accessory: 'chef_hat',      pose: 'cooking' },
  { name: 'Doctor Zhu',      description: 'Stethoscope ready! Time for your checkup. Say "oink!"',                                        color: 'mint',     expression: 'cool',    accessory: 'none',          pose: 'standing' },
  { name: 'Builder Zhu',     description: 'Hard hat on, ready to construct! Building the future one brick at a time.',                     color: 'peach',    expression: 'focused', accessory: 'hard_hat',      pose: 'standing' },
  { name: 'Artist Zhu',      description: 'Beret on, paintbrush in hand. Creating a masterpiece on canvas.',                               color: 'lavender', expression: 'focused', accessory: 'none',          pose: 'painting' },
  { name: 'Musician Zhu',    description: 'Strumming sweet melodies on the guitar. Music is life!',                                       color: 'coral',    expression: 'happy',   accessory: 'guitar',        pose: 'dancing' },
  { name: 'Firefighter Zhu', description: 'Brave and bold! Rushing into danger to save the day.',                                         color: 'coral',    expression: 'proud',   accessory: 'none',          pose: 'running' },
  { name: 'Police Zhu',      description: 'Protecting and serving the community with honor. You have the right to remain oinking.',        color: 'sky',      expression: 'cool',    accessory: 'sunglasses',    pose: 'standing' },
  { name: 'Teacher Zhu',     description: 'Standing at the whiteboard, sharing knowledge with the next generation.',                       color: 'mint',     expression: 'happy',   accessory: 'bow_tie',       pose: 'standing' },
  { name: 'Pilot Zhu',       description: 'Cleared for takeoff! Flying high above the clouds. Fasten your seatbelts!',                    color: 'sky',      expression: 'cool',    accessory: 'sunglasses',    pose: 'waving' },
  { name: 'Astronaut Zhu',   description: 'One small step for pig, one giant leap for pig-kind. Exploring the cosmos!',                    color: 'lavender', expression: 'surprised', accessory: 'none',         pose: 'waving' },

  // ── Hobbies ──
  { name: 'Gamer Zhu',       description: 'Eyes glued to the screen, controller in hand. Just one more level!',                            color: 'lavender', expression: 'focused', accessory: 'headphones',    pose: 'sitting' },
  { name: 'Gardener Zhu',    description: 'Green hoof! Tending to beautiful flowers and fresh vegetables in the garden.',                  color: 'lime',     expression: 'happy',   accessory: 'flower_crown',  pose: 'standing' },
  { name: 'Fisher Zhu',      description: 'Patiently waiting by the pond. Today\'s catch is gonna be huge!',                               color: 'mint',     expression: 'focused', accessory: 'none',          pose: 'sitting' },
  { name: 'Swimmer Zhu',     description: 'Splashing through the water! Doing laps like an Olympic champion.',                             color: 'sky',      expression: 'happy',   accessory: 'none',          pose: 'waving' },
  { name: 'Runner Zhu',      description: 'Pounding the pavement! Training for the big race, feeling the burn.',                            color: 'coral',    expression: 'focused', accessory: 'none',          pose: 'running' },
  { name: 'Yogi Zhu',        description: 'Finding inner peace on the yoga mat. Namaste, little piggy.',                                   color: 'cream',    expression: 'happy',   accessory: 'none',          pose: 'sitting' },
  { name: 'Cyclist Zhu',     description: 'Pedaling through the countryside, wind in the ears. Freedom on two wheels!',                    color: 'mint',     expression: 'happy',   accessory: 'sunglasses',    pose: 'running' },
  { name: 'Camper Zhu',      description: 'Pitching a tent under the stars. Roasting marshmallows by the campfire.',                       color: 'cream',    expression: 'happy',   accessory: 'scarf',          pose: 'standing' },
  { name: 'Baker Zhu',       description: 'Flour everywhere! Pulling fresh bread out of the oven. The kitchen smells amazing.',            color: 'peach',    expression: 'proud',   accessory: 'chef_hat',      pose: 'cooking' },
  { name: 'Painter Zhu',     description: 'Brush in hand, creating a colorful landscape. Every painting tells a story.',                    color: 'lavender', expression: 'focused', accessory: 'none',          pose: 'painting' },

  // ── Life Moments ──
  { name: 'Busy Zhu',        description: 'Typing furiously on the laptop, coffee in hand. Deadlines are piling up!',                      color: 'cream',    expression: 'focused', accessory: 'laptop',        pose: 'sitting' },
  { name: 'Lazy Zhu',        description: 'Netflix and chill? More like Netflix and nap. Not moving from this couch.',                      color: 'cream',    expression: 'sleepy',  accessory: 'pillow',        pose: 'sleeping' },
  { name: 'Broke Zhu',       description: 'Empty pockets and a sad wallet. Ramen for dinner... again.',                                    color: 'cream',    expression: 'sad',     accessory: 'none',          pose: 'standing' },
  { name: 'Rich Zhu',        description: 'Living the high life! Designer clothes, fancy dinners, gold everything.',                       color: 'pink',     expression: 'proud',   accessory: 'crown',         pose: 'waving' },
  { name: 'Famous Zhu',      description: 'Paparazzi everywhere! Signing autographs and walking the red carpet.',                          color: 'pink',     expression: 'cool',    accessory: 'sunglasses',    pose: 'waving' },
  { name: 'Tourist Zhu',     description: 'Camera around the neck, map in hand. Getting lost in a new city is half the fun!',             color: 'peach',    expression: 'surprised', accessory: 'none',       pose: 'waving' },
  { name: 'Student Zhu',     description: 'Cramming for finals with coffee and a laptop. Why didn\'t I start earlier?!',                   color: 'mint',     expression: 'scared',  accessory: 'laptop',        pose: 'sitting' },
  { name: 'Parent Zhu',      description: 'Juggling a baby, groceries, and a career. Superpig in action!',                                 color: 'peach',    expression: 'happy',   accessory: 'scarf',          pose: 'waving' },
  { name: 'Baby Zhu',        description: 'Tiny, adorable, and wearing a diaper. Goo goo ga ga!',                                          color: 'pink',     expression: 'surprised', accessory: 'none',        pose: 'sitting' },
  { name: 'Grandpa Zhu',     description: 'Rocking in the chair, telling stories of the good old days. Wise and wrinkly.',                  color: 'cream',    expression: 'happy',   accessory: 'bow_tie',       pose: 'sitting' },

  // ── Food & Drink ──
  { name: 'Coffee Zhu',      description: 'Don\'t talk to me before my morning coffee. Running on caffeine and determination.',            color: 'peach',    expression: 'focused', accessory: 'coffee_cup',    pose: 'standing' },
  { name: 'Tea Zhu',         description: 'Pinky up! Sipping Earl Grey with the finest biscuits. How sophisticated!',                      color: 'cream',    expression: 'happy',   accessory: 'bow_tie',       pose: 'standing' },
  { name: 'Pizza Zhu',       description: 'Face buried in a giant slice of pepperoni pizza. This is heaven.',                              color: 'coral',    expression: 'happy',   accessory: 'none',          pose: 'eating' },
  { name: 'Sushi Zhu',       description: 'Chopsticks ready! Perfectly arranged nigiri and rolls. Itadakimasu!',                           color: 'peach',    expression: 'happy',   accessory: 'none',          pose: 'eating' },
  { name: 'Ice Cream Zhu',   description: 'Licking a giant scoop of strawberry ice cream before it melts. Brain freeze!',                   color: 'pink',     expression: 'surprised', accessory: 'none',       pose: 'eating' },
  { name: 'Hungry Zhu',      description: 'Stomach growling so loud the neighbors can hear. Must... find... food...',                       color: 'peach',    expression: 'sad',     accessory: 'none',          pose: 'standing' },
  { name: 'Full Zhu',        description: 'Stuffed to the brim after a giant feast. Can\'t move, might explode.',                           color: 'coral',    expression: 'sleepy',  accessory: 'none',          pose: 'sleeping' },
  { name: 'Thirsty Zhu',     description: 'Crawling through the desert. A mirage of a water fountain in the distance...',                  color: 'coral',    expression: 'sad',     accessory: 'none',          pose: 'standing' },

  // ── Weather ──
  { name: 'Rainy Zhu',       description: 'Splashing in puddles with a bright umbrella. Rain, rain, don\'t go away!',                     color: 'sky',      expression: 'happy',   accessory: 'umbrella',      pose: 'standing' },
  { name: 'Snowy Zhu',       description: 'Building a snowpig! Frosty ears and a carrot nose. Winter wonderland!',                         color: 'sky',      expression: 'cold',    accessory: 'scarf',         pose: 'shivering' },
  { name: 'Windy Zhu',       description: 'Holding on for dear life! This gust of wind is trying to blow the pig away!',                   color: 'mint',     expression: 'surprised', accessory: 'scarf',       pose: 'standing' },
  { name: 'Sunny Zhu',       description: 'Basking in golden sunshine. Perfect weather for a picnic and good vibes.',                       color: 'cream',    expression: 'happy',   accessory: 'sunglasses',    pose: 'waving' },
  { name: 'Stormy Zhu',      description: 'Thunder and lightning! Running for cover as the sky opens up.',                                  color: 'lavender', expression: 'scared',  accessory: 'umbrella',      pose: 'running' },

  // ── Holidays ──
  { name: 'Birthday Zhu',    description: 'Party hat on, candles lit! Make a wish and blow them out. Happy birthday!',                     color: 'pink',     expression: 'happy',   accessory: 'party_hat',     pose: 'dancing' },
  { name: 'Halloween Zhu',   description: 'Trick or treat! Dressed as a spooky witch, collecting candy all night long.',                   color: 'lavender', expression: 'silly',   accessory: 'witch_hat',     pose: 'waving' },
  { name: 'Christmas Zhu',   description: 'Ho ho ho! Wearing a Santa hat and spreading holiday cheer. Presents for everyone!',              color: 'coral',    expression: 'happy',   accessory: 'santa_hat',     pose: 'waving' },
  { name: 'New Year Zhu',    description: 'Counting down to midnight! Fireworks, champagne, and resolutions to break.',                     color: 'lavender', expression: 'proud',   accessory: 'party_hat',     pose: 'dancing' },
  { name: 'Easter Zhu',      description: 'Hopping around hiding colorful eggs. Can you find them all?',                                   color: 'mint',     expression: 'happy',   accessory: 'flower_crown',  pose: 'waving' },

  // ── Weird & Funny ──
  { name: 'Ninja Zhu',       description: 'Silent but deadly. Moves through the shadows unseen. Hi-yah!',                                  color: 'lavender', expression: 'cool',    accessory: 'scarf',          pose: 'running' },
  { name: 'Pirate Zhu',      description: 'Arrr matey! Sailing the seven seas looking for treasure. Where be the gold?',                   color: 'coral',    expression: 'cool',    accessory: 'none',          pose: 'waving' },
  { name: 'Zombie Zhu',      description: 'Braaaaains... Shuffling around looking for a snack. A little green around the edges.',          color: 'lime',     expression: 'dizzy',   accessory: 'bandage',       pose: 'standing' },
  { name: 'Alien Zhu',       description: 'Greetings from another planet! Comes in peace and comes for snacks.',                            color: 'mint',     expression: 'surprised', accessory: 'none',       pose: 'waving' },
  { name: 'Superhero Zhu',   description: 'Cape flowing in the wind! Here to save the day with superpig powers!',                           color: 'coral',    expression: 'proud',   accessory: 'none',          pose: 'dancing' },
  { name: 'Robot Zhu',       description: 'Beep boop! Programmed for maximum cuteness. Does not compute... emotions.',                       color: 'sky',      expression: 'confused', accessory: 'headphones',   pose: 'standing' },
  { name: 'Ghost Zhu',       description: 'Boo! Floating through walls and haunting the snack cabinet. Spooky but adorable!',               color: 'cream',    expression: 'silly',   accessory: 'none',          pose: 'waving' },
  { name: 'Wizard Zhu',      description: 'Wingardium levio-SWINE! Casting spells with a magical wand. You\'re a wizard, Zhu!',            color: 'lavender', expression: 'cool',    accessory: 'witch_hat',     pose: 'thinking' },

  // ── Sleep ──
  { name: 'Sleepy Zhu',      description: 'Head bobbing, eyes heavy. Fighting to stay awake but losing the battle.',                        color: 'cream',    expression: 'sleepy',  accessory: 'pillow',        pose: 'sleeping' },
  { name: 'Snoring Zhu',     description: 'ZZZZZZZZ. Loud enough to wake the whole neighborhood. Someone get earplugs!',                   color: 'pink',     expression: 'sleepy',  accessory: 'none',          pose: 'sleeping' },
  { name: 'Drooling Zhu',    description: 'Fast asleep and dreaming of food. A little puddle forming on the pillow.',                       color: 'peach',    expression: 'sleepy',  accessory: 'pillow',        pose: 'sleeping' },
  { name: 'Night Owl Zhu',   description: 'Wide awake at 3 AM. The best ideas come in the middle of the night!',                            color: 'lavender', expression: 'focused', accessory: 'laptop',        pose: 'sitting' },
  { name: 'Early Bird Zhu',  description: 'Up before the sun! Chirping and ready to seize the day. Good morning world!',                    color: 'cream',    expression: 'happy',   accessory: 'coffee_cup',    pose: 'waving' },

  // ── Accidents ──
  { name: 'Stuck Zhu',       description: 'Wedged in a tight spot. Tried to squeeze through and now can\'t get out! Help!',                color: 'peach',    expression: 'scared',  accessory: 'none',          pose: 'sitting' },
  { name: 'Lost Zhu',        description: 'Map is upside down, phone is dead. Completely and utterly lost.',                                color: 'mint',     expression: 'confused', accessory: 'none',          pose: 'thinking' },
  { name: 'Falling Zhu',     description: 'Tripped on a banana peel! Arms flailing, gravity taking over. Going down!',                      color: 'peach',    expression: 'surprised', accessory: 'none',       pose: 'running' },
  { name: 'Bumped Zhu',      description: 'Walked straight into a glass door. Nose is sore but dignity is more wounded.',                   color: 'pink',     expression: 'dizzy',   accessory: 'bandage',       pose: 'standing' },
  { name: 'Dirty Zhu',       description: 'Rolled in the mud and loving it. Bath time is going to be a battle!',                            color: 'peach',    expression: 'happy',   accessory: 'mud_splat',     pose: 'dancing' },

  // ── Party & Night Out ──
  { name: 'Party Zhu',       description: 'Dancing on the tables! The life of the party with a hat and moves.',                             color: 'pink',     expression: 'happy',   accessory: 'party_hat',     pose: 'dancing' },
  { name: 'Drunk Zhu',       description: 'Had one too many! Stumbling around, slurring words, but having the time of their life.',        color: 'coral',    expression: 'dizzy',   accessory: 'party_hat',     pose: 'dancing' },
  { name: 'Hungover Zhu',    description: 'Never drinking again... Head pounding, sunglasses on, desperately seeking water.',               color: 'lime',     expression: 'sick',    accessory: 'sunglasses',    pose: 'sleeping' },
  { name: 'Dancing Zhu',     description: 'Hitting the dance floor with killer moves! No rhythm but maximum enthusiasm.',                    color: 'lavender', expression: 'happy',   accessory: 'headphones',    pose: 'dancing' },
  { name: 'Karaoke Zhu',     description: 'Belting out a power ballad on stage. Tone deaf but passion is off the charts!',                  color: 'coral',    expression: 'silly',   accessory: 'headphones',    pose: 'dancing' },

  // ── Final Five: Miscellaneous ──
  { name: 'Working Zhu',     description: 'Deep in the zone, headphones on, crushing the to-do list. Productivity mode activated!',        color: 'mint',     expression: 'focused', accessory: 'laptop',        pose: 'sitting' },
  { name: 'Shopping Zhu',    description: 'Arms full of bags! Swipe that card — retail therapy at its finest.',                             color: 'pink',     expression: 'happy',   accessory: 'sunglasses',    pose: 'waving' },
  { name: 'Cooking Zhu',     description: 'Sizzling pans and flying ingredients! Something delicious is coming together.',                   color: 'peach',    expression: 'focused', accessory: 'chef_hat',      pose: 'cooking' },
  { name: 'Traveling Zhu',   description: 'Suitcase packed, passport ready! Adventure awaits in far-off lands.',                             color: 'sky',      expression: 'happy',   accessory: 'sunglasses',    pose: 'running' },
  { name: 'Reading Zhu',     description: 'Curled up with a good book, lost in another world. Shh, they\'re at the good part!',            color: 'cream',    expression: 'happy',   accessory: 'none',          pose: 'reading' },
];

// Verify count
if (DEFAULT_STAMPS.length !== 100) {
  console.warn(`Expected 100 default stamps, got ${DEFAULT_STAMPS.length}`);
}

/* ---------- Seed Check ---------- */

export const SEED_FLAG = 'zhu_seeded_v4';

export async function seedDatabase(): Promise<void> {
  const flag = localStorage.getItem('zhu_seeded_v1') || localStorage.getItem('zhu_seeded_v2') || localStorage.getItem('zhu_seeded_v3');
  if (flag) {
    localStorage.removeItem('zhu_seeded_v1');
    localStorage.removeItem('zhu_seeded_v2');
    localStorage.removeItem('zhu_seeded_v3');
  }

  try {
    const { db } = await import('./database');
    const currentFlag = localStorage.getItem(SEED_FLAG);
    const count = await db.stamps.count();
    if (count > 0 && currentFlag === 'true') return;

    const { default: SEED_IMAGES } = await import('./seed-images.json');
    const stampRows = (SEED_IMAGES as { name: string; description: string; imageData: string }[])
      .filter((img) => img.imageData)
      .map((img) => ({
        name: img.name,
        description: img.description,
        isBuiltIn: true,
        imageData: img.imageData,
        imageType: 'png' as const,
        unlockedAt: null,
        encounterCount: 0,
        createdAt: new Date(),
      }));

    await db.transaction('rw', db.stamps, async () => {
      await db.stamps.clear();
      await db.stamps.bulkAdd(stampRows);
    });
    localStorage.setItem(SEED_FLAG, 'true');
    console.log(`Seeded ${stampRows.length} Zhu stamps`);
  } catch (err) {
    console.error('Failed to seed database:', err);
  }
}