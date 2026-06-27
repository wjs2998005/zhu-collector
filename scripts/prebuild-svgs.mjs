// Standalone script — no TS/JSX dependencies.
// Run with: node scripts/prebuild-svgs.mjs
// Generates all 100 pig SVGs and writes src/db/seed-images.json

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/* ---------- Pig Colors ---------- */
const PIG_COLORS = {
  pink:     { body: '#FFB6C1', snout: '#FF9AA2', earInner: '#E88A95' },
  peach:    { body: '#FFDAB9', snout: '#FFBFA0', earInner: '#E8A87C' },
  lavender: { body: '#E6E6FA', snout: '#D8BFD8', earInner: '#BFA0BF' },
  mint:     { body: '#B2EBF2', snout: '#80DEEA', earInner: '#4DD0E1' },
  cream:    { body: '#FFFDD0', snout: '#FFF5BA', earInner: '#F0E68C' },
  coral:    { body: '#FFA07A', snout: '#F08080', earInner: '#CD5C5C' },
  sky:      { body: '#B3D9FF', snout: '#99C2E6', earInner: '#7BA8CC' },
  lime:     { body: '#C1E6B4', snout: '#A8D49A', earInner: '#8CBF7F' },
};

/* ---------- Expressions ---------- */
const EXPRESSIONS = {
  happy:     { eyes: 'arc',     mouth: 'smile',      cheeks: true },
  angry:     { eyes: 'slant',   mouth: 'frown',      cheeks: false, eyebrow: 'down' },
  cool:      { eyes: 'half',    mouth: 'smirk',      cheeks: false },
  sad:       { eyes: 'wide',    mouth: 'frownSmall',  cheeks: false, special: 'tear' },
  silly:     { eyes: 'x',       mouth: 'open',       cheeks: true,  special: 'tongue' },
  sleepy:    { eyes: 'closed',  mouth: 'openSmall',   cheeks: true,  special: 'zzz' },
  surprised: { eyes: 'wide',    mouth: 'openOval',   cheeks: true },
  loving:    { eyes: 'closed',  mouth: 'heart',      cheeks: true,  special: 'hearts' },
  confused:  { eyes: 'uneven',  mouth: 'wavy',       cheeks: false },
  proud:     { eyes: 'closed',  mouth: 'smirk',      cheeks: true,  special: 'sparkle' },
  cold:      { eyes: 'dotWide', mouth: 'chatter',    cheeks: false, special: 'drip' },
  sick:      { eyes: 'dotWide', mouth: 'flat',       cheeks: false, special: 'sweat' },
  focused:   { eyes: 'dot',     mouth: 'openSmall',  cheeks: false, special: 'tongue' },
  scared:    { eyes: 'dotWide', mouth: 'openOval',   cheeks: false, special: 'sweat' },
  dizzy:     { eyes: 'spiral',  mouth: 'wavy',       cheeks: true },
};

/* ---------- Pose Configs ---------- */
const POSE_CONFIGS = {
  standing:  { bodyY: 120, showLimbs: true,  armLeftAngle: -10, armRightAngle: 10 },
  waving:    { bodyY: 120, showLimbs: true,  armLeftAngle: -30, armRightAngle: 60 },
  cooking:   { bodyY: 120, showLimbs: true,  armLeftAngle: -20, armRightAngle: 40 },
  reading:   { bodyY: 130, showLimbs: true,  armLeftAngle: -40, armRightAngle: -40 },
  dancing:   { bodyY: 115, showLimbs: true,  armLeftAngle: 50,  armRightAngle: -50 },
  sleeping:  { bodyY: 145, showLimbs: false, armLeftAngle: 0,   armRightAngle: 0 },
  running:   { bodyY: 120, showLimbs: true,  armLeftAngle: 40,  armRightAngle: -40 },
  eating:    { bodyY: 125, showLimbs: true,  armLeftAngle: -30, armRightAngle: 20 },
  painting:  { bodyY: 120, showLimbs: true,  armLeftAngle: -15, armRightAngle: 30 },
  thinking:  { bodyY: 120, showLimbs: true,  armLeftAngle: -15, armRightAngle: -15 },
  sitting:   { bodyY: 135, showLimbs: true,  armLeftAngle: -10, armRightAngle: -10 },
  shivering: { bodyY: 120, showLimbs: true,  armLeftAngle: -5,  armRightAngle: -5 },
};

/* ---------- Stamp Configs ---------- */
const DEFAULT_STAMPS = [
  { name: 'Cold Zhu',        description: 'Brrr! Shivering in the freezing weather, wrapped up tight.',                                    color: 'sky',      expression: 'cold',    accessory: 'scarf',         pose: 'shivering' },
  { name: 'Hot Zhu',         description: 'Sweating buckets under the blazing sun, desperately seeking shade.',                           color: 'coral',    expression: 'sad',     accessory: 'none',          pose: 'standing' },
  { name: 'Sweaty Zhu',      description: 'Just finished a marathon — dripping with sweat and feeling accomplished.',                     color: 'peach',    expression: 'happy',   accessory: 'none',          pose: 'running' },
  { name: 'Wet Zhu',         description: 'Caught in a downpour without an umbrella. Completely soaked!',                                 color: 'sky',      expression: 'sad',     accessory: 'umbrella',      pose: 'standing' },
  { name: 'Sick Zhu',        description: 'Running a fever, thermometer in mouth, wrapped in blankets.',                                  color: 'lime',     expression: 'sick',    accessory: 'thermometer',   pose: 'sleeping' },
  { name: 'Sneezy Zhu',      description: 'Allergy season is here — tissue at the ready for the next achoo!',                             color: 'pink',     expression: 'surprised', accessory: 'none',       pose: 'standing' },
  { name: 'Hurt Zhu',        description: 'Ouch! Tripped and bumped his head — sporting a bandage with pride.',                           color: 'peach',    expression: 'sad',     accessory: 'bandage',       pose: 'standing' },
  { name: 'Tired Zhu',       description: 'Exhausted after a long day. Barely keeping those eyes open.',                                   color: 'cream',    expression: 'sleepy',  accessory: 'pillow',        pose: 'sleeping' },
  { name: 'Poop Zhu',        description: 'Occupied! Currently doing important business and not to be disturbed.',                        color: 'peach',    expression: 'focused', accessory: 'none',          pose: 'sitting' },
  { name: 'Fart Zhu',        description: 'Silent but deadly. Pretending like nothing happened.',                                         color: 'lime',     expression: 'happy',   accessory: 'none',          pose: 'standing' },
  { name: 'Pee Zhu',         description: 'When you really gotta go and the bathroom is finally in sight!',                               color: 'sky',      expression: 'scared',  accessory: 'none',          pose: 'running' },
  { name: 'Constipated Zhu', description: 'Straining and struggling. This might take a while...',                                         color: 'coral',    expression: 'angry',   accessory: 'none',          pose: 'sitting' },
  { name: 'Stinky Zhu',      description: "Haven't showered in days. The flies are starting to circle.",                                  color: 'lime',     expression: 'cool',    accessory: 'mud_splat',     pose: 'standing' },
  { name: 'Happy Zhu',       description: 'Pure joy radiating from this cheerful little pig! Everything is wonderful.',                    color: 'pink',     expression: 'happy',   accessory: 'none',          pose: 'waving' },
  { name: 'Sad Zhu',         description: 'Feeling blue. Sometimes you just need a good cry and a hug.',                                  color: 'sky',      expression: 'sad',     accessory: 'none',          pose: 'standing' },
  { name: 'Angry Zhu',       description: "Absolutely furious! Steam coming out of those ears. Don't mess with this pig.",                color: 'coral',    expression: 'angry',   accessory: 'none',          pose: 'standing' },
  { name: 'Scared Zhu',      description: 'Wide-eyed and trembling after watching a horror movie. Every shadow is a monster!',            color: 'lavender', expression: 'scared',  accessory: 'none',          pose: 'shivering' },
  { name: 'Nervous Zhu',     description: 'Sweating bullets before a big presentation. Palms are clammy, heart is racing.',               color: 'cream',    expression: 'scared',  accessory: 'coffee_cup',    pose: 'standing' },
  { name: 'Proud Zhu',       description: 'Just won first place! Chest puffed out, basking in glory.',                                    color: 'pink',     expression: 'proud',   accessory: 'crown',         pose: 'standing' },
  { name: 'Jealous Zhu',     description: "Looking at someone else's plate with envy. Why does theirs look better?",                     color: 'lime',     expression: 'angry',   accessory: 'none',          pose: 'standing' },
  { name: 'Shy Zhu',         description: 'Hiding behind those ears. Too embarrassed to say hello to their crush.',                        color: 'pink',     expression: 'happy',   accessory: 'flower_crown',  pose: 'standing' },
  { name: 'Confused Zhu',    description: 'Wait... what? Nothing makes sense right now. Head is spinning.',                                color: 'lavender', expression: 'confused', accessory: 'none',         pose: 'thinking' },
  { name: 'Surprised Zhu',   description: 'Did NOT see that coming! Jaw dropped, eyes wide open in disbelief.',                            color: 'peach',    expression: 'surprised', accessory: 'none',       pose: 'standing' },
  { name: 'Bored Zhu',       description: 'Staring at the clock watching seconds tick by. When will this meeting end?',                   color: 'cream',    expression: 'sleepy',  accessory: 'coffee_cup',    pose: 'sitting' },
  { name: 'Excited Zhu',     description: "Can't contain the energy! Bouncing up and down with pure excitement!",                          color: 'pink',     expression: 'happy',   accessory: 'party_hat',     pose: 'dancing' },
  { name: 'In Love Zhu',     description: 'Hearts floating all around. Head over hooves for someone special.',                             color: 'pink',     expression: 'loving',  accessory: 'flower_crown',  pose: 'waving' },
  { name: 'Heartbroken Zhu', description: 'Crying into a tub of ice cream after a rough breakup. It hurts so bad.',                        color: 'sky',      expression: 'sad',     accessory: 'none',          pose: 'sleeping' },
  { name: 'Flirty Zhu',      description: 'Winking and looking sharp in a bow tie. Ready for date night!',                                color: 'peach',    expression: 'cool',    accessory: 'bow_tie',       pose: 'waving' },
  { name: 'Romantic Zhu',    description: 'Roses and candlelight. Setting the mood for a perfect evening.',                                color: 'pink',     expression: 'loving',  accessory: 'flower_crown',  pose: 'standing' },
  { name: 'Chef Zhu',        description: 'Master of the kitchen! Whipping up delicious dishes with flair.',                               color: 'peach',    expression: 'happy',   accessory: 'chef_hat',      pose: 'cooking' },
  { name: 'Doctor Zhu',      description: 'Stethoscope ready! Time for your checkup. Say "oink!"',                                        color: 'mint',     expression: 'cool',    accessory: 'none',          pose: 'standing' },
  { name: 'Builder Zhu',     description: 'Hard hat on, ready to construct! Building the future one brick at a time.',                     color: 'peach',    expression: 'focused', accessory: 'hard_hat',      pose: 'standing' },
  { name: 'Artist Zhu',      description: 'Beret on, paintbrush in hand. Creating a masterpiece on canvas.',                               color: 'lavender', expression: 'focused', accessory: 'none',          pose: 'painting' },
  { name: 'Musician Zhu',    description: 'Strumming sweet melodies on the guitar. Music is life!',                                       color: 'coral',    expression: 'happy',   accessory: 'guitar',        pose: 'dancing' },
  { name: 'Firefighter Zhu', description: 'Brave and bold! Rushing into danger to save the day.',                                         color: 'coral',    expression: 'proud',   accessory: 'none',          pose: 'running' },
  { name: 'Police Zhu',      description: 'Protecting and serving the community with honor. You have the right to remain oinking.',        color: 'sky',      expression: 'cool',    accessory: 'sunglasses',    pose: 'standing' },
  { name: 'Teacher Zhu',     description: 'Standing at the whiteboard, sharing knowledge with the next generation.',                       color: 'mint',     expression: 'happy',   accessory: 'bow_tie',       pose: 'standing' },
  { name: 'Pilot Zhu',       description: 'Cleared for takeoff! Flying high above the clouds. Fasten your seatbelts!',                    color: 'sky',      expression: 'cool',    accessory: 'sunglasses',    pose: 'waving' },
  { name: 'Astronaut Zhu',   description: 'One small step for pig, one giant leap for pig-kind. Exploring the cosmos!',                    color: 'lavender', expression: 'surprised', accessory: 'none',        pose: 'waving' },
  { name: 'Gamer Zhu',       description: 'Eyes glued to the screen, controller in hand. Just one more level!',                            color: 'lavender', expression: 'focused', accessory: 'headphones',    pose: 'sitting' },
  { name: 'Gardener Zhu',    description: 'Green hoof! Tending to beautiful flowers and fresh vegetables in the garden.',                  color: 'lime',     expression: 'happy',   accessory: 'flower_crown',  pose: 'standing' },
  { name: 'Fisher Zhu',      description: "Patiently waiting by the pond. Today's catch is gonna be huge!",                                color: 'mint',     expression: 'focused', accessory: 'none',          pose: 'sitting' },
  { name: 'Swimmer Zhu',     description: 'Splashing through the water! Doing laps like an Olympic champion.',                             color: 'sky',      expression: 'happy',   accessory: 'none',          pose: 'waving' },
  { name: 'Runner Zhu',      description: 'Pounding the pavement! Training for the big race, feeling the burn.',                            color: 'coral',    expression: 'focused', accessory: 'none',          pose: 'running' },
  { name: 'Yogi Zhu',        description: 'Finding inner peace on the yoga mat. Namaste, little piggy.',                                   color: 'cream',    expression: 'happy',   accessory: 'none',          pose: 'sitting' },
  { name: 'Cyclist Zhu',     description: 'Pedaling through the countryside, wind in the ears. Freedom on two wheels!',                    color: 'mint',     expression: 'happy',   accessory: 'sunglasses',    pose: 'running' },
  { name: 'Camper Zhu',      description: 'Pitching a tent under the stars. Roasting marshmallows by the campfire.',                       color: 'cream',    expression: 'happy',   accessory: 'scarf',         pose: 'standing' },
  { name: 'Baker Zhu',       description: 'Flour everywhere! Pulling fresh bread out of the oven. The kitchen smells amazing.',            color: 'peach',    expression: 'proud',   accessory: 'chef_hat',      pose: 'cooking' },
  { name: 'Painter Zhu',     description: 'Brush in hand, creating a colorful landscape. Every painting tells a story.',                    color: 'lavender', expression: 'focused', accessory: 'none',          pose: 'painting' },
  { name: 'Busy Zhu',        description: 'Typing furiously on the laptop, coffee in hand. Deadlines are piling up!',                      color: 'cream',    expression: 'focused', accessory: 'laptop',        pose: 'sitting' },
  { name: 'Lazy Zhu',        description: 'Netflix and chill? More like Netflix and nap. Not moving from this couch.',                      color: 'cream',    expression: 'sleepy',  accessory: 'pillow',        pose: 'sleeping' },
  { name: 'Broke Zhu',       description: 'Empty pockets and a sad wallet. Ramen for dinner... again.',                                    color: 'cream',    expression: 'sad',     accessory: 'none',          pose: 'standing' },
  { name: 'Rich Zhu',        description: 'Living the high life! Designer clothes, fancy dinners, gold everything.',                       color: 'pink',     expression: 'proud',   accessory: 'crown',         pose: 'waving' },
  { name: 'Famous Zhu',      description: 'Paparazzi everywhere! Signing autographs and walking the red carpet.',                          color: 'pink',     expression: 'cool',    accessory: 'sunglasses',    pose: 'waving' },
  { name: 'Tourist Zhu',     description: 'Camera around the neck, map in hand. Getting lost in a new city is half the fun!',             color: 'peach',    expression: 'surprised', accessory: 'none',       pose: 'waving' },
  { name: 'Student Zhu',     description: "Cramming for finals with coffee and a laptop. Why didn't I start earlier?!",                   color: 'mint',     expression: 'scared',  accessory: 'laptop',        pose: 'sitting' },
  { name: 'Parent Zhu',      description: 'Juggling a baby, groceries, and a career. Superpig in action!',                                 color: 'peach',    expression: 'happy',   accessory: 'scarf',         pose: 'waving' },
  { name: 'Baby Zhu',        description: 'Tiny, adorable, and wearing a diaper. Goo goo ga ga!',                                          color: 'pink',     expression: 'surprised', accessory: 'none',       pose: 'sitting' },
  { name: 'Grandpa Zhu',     description: 'Rocking in the chair, telling stories of the good old days. Wise and wrinkly.',                  color: 'cream',    expression: 'happy',   accessory: 'bow_tie',       pose: 'sitting' },
  { name: 'Coffee Zhu',      description: "Don't talk to me before my morning coffee. Running on caffeine and determination.",             color: 'peach',    expression: 'focused', accessory: 'coffee_cup',    pose: 'standing' },
  { name: 'Tea Zhu',         description: 'Pinky up! Sipping Earl Grey with the finest biscuits. How sophisticated!',                      color: 'cream',    expression: 'happy',   accessory: 'bow_tie',       pose: 'standing' },
  { name: 'Pizza Zhu',       description: 'Face buried in a giant slice of pepperoni pizza. This is heaven.',                              color: 'coral',    expression: 'happy',   accessory: 'none',          pose: 'eating' },
  { name: 'Sushi Zhu',       description: 'Chopsticks ready! Perfectly arranged nigiri and rolls. Itadakimasu!',                           color: 'peach',    expression: 'happy',   accessory: 'none',          pose: 'eating' },
  { name: 'Ice Cream Zhu',   description: 'Licking a giant scoop of strawberry ice cream before it melts. Brain freeze!',                   color: 'pink',     expression: 'surprised', accessory: 'none',      pose: 'eating' },
  { name: 'Hungry Zhu',      description: 'Stomach growling so loud the neighbors can hear. Must... find... food...',                       color: 'peach',    expression: 'sad',     accessory: 'none',          pose: 'standing' },
  { name: 'Full Zhu',        description: "Stuffed to the brim after a giant feast. Can't move, might explode.",                           color: 'coral',    expression: 'sleepy',  accessory: 'none',          pose: 'sleeping' },
  { name: 'Thirsty Zhu',     description: 'Crawling through the desert. A mirage of a water fountain in the distance...',                  color: 'coral',    expression: 'sad',     accessory: 'none',          pose: 'standing' },
  { name: 'Rainy Zhu',       description: "Splashing in puddles with a bright umbrella. Rain, rain, don't go away!",                      color: 'sky',      expression: 'happy',   accessory: 'umbrella',      pose: 'standing' },
  { name: 'Snowy Zhu',       description: 'Building a snowpig! Frosty ears and a carrot nose. Winter wonderland!',                         color: 'sky',      expression: 'cold',    accessory: 'scarf',         pose: 'shivering' },
  { name: 'Windy Zhu',       description: 'Holding on for dear life! This gust of wind is trying to blow the pig away!',                   color: 'mint',     expression: 'surprised', accessory: 'scarf',      pose: 'standing' },
  { name: 'Sunny Zhu',       description: 'Basking in golden sunshine. Perfect weather for a picnic and good vibes.',                       color: 'cream',    expression: 'happy',   accessory: 'sunglasses',    pose: 'waving' },
  { name: 'Stormy Zhu',      description: 'Thunder and lightning! Running for cover as the sky opens up.',                                  color: 'lavender', expression: 'scared',  accessory: 'umbrella',      pose: 'running' },
  { name: 'Birthday Zhu',    description: 'Party hat on, candles lit! Make a wish and blow them out. Happy birthday!',                     color: 'pink',     expression: 'happy',   accessory: 'party_hat',     pose: 'dancing' },
  { name: 'Halloween Zhu',   description: 'Trick or treat! Dressed as a spooky witch, collecting candy all night long.',                   color: 'lavender', expression: 'silly',   accessory: 'witch_hat',     pose: 'waving' },
  { name: 'Christmas Zhu',   description: 'Ho ho ho! Wearing a Santa hat and spreading holiday cheer. Presents for everyone!',              color: 'coral',    expression: 'happy',   accessory: 'santa_hat',     pose: 'waving' },
  { name: 'New Year Zhu',    description: 'Counting down to midnight! Fireworks, champagne, and resolutions to break.',                     color: 'lavender', expression: 'proud',   accessory: 'party_hat',     pose: 'dancing' },
  { name: 'Easter Zhu',      description: 'Hopping around hiding colorful eggs. Can you find them all?',                                   color: 'mint',     expression: 'happy',   accessory: 'flower_crown',  pose: 'waving' },
  { name: 'Ninja Zhu',       description: 'Silent but deadly. Moves through the shadows unseen. Hi-yah!',                                  color: 'lavender', expression: 'cool',    accessory: 'scarf',         pose: 'running' },
  { name: 'Pirate Zhu',      description: 'Arrr matey! Sailing the seven seas looking for treasure. Where be the gold?',                   color: 'coral',    expression: 'cool',    accessory: 'none',          pose: 'waving' },
  { name: 'Zombie Zhu',      description: 'Braaaaains... Shuffling around looking for a snack. A little green around the edges.',          color: 'lime',     expression: 'dizzy',   accessory: 'bandage',       pose: 'standing' },
  { name: 'Alien Zhu',       description: 'Greetings from another planet! Comes in peace and comes for snacks.',                            color: 'mint',     expression: 'surprised', accessory: 'none',      pose: 'waving' },
  { name: 'Superhero Zhu',   description: 'Cape flowing in the wind! Here to save the day with superpig powers!',                           color: 'coral',    expression: 'proud',   accessory: 'none',          pose: 'dancing' },
  { name: 'Robot Zhu',       description: 'Beep boop! Programmed for maximum cuteness. Does not compute... emotions.',                       color: 'sky',      expression: 'confused', accessory: 'headphones', pose: 'standing' },
  { name: 'Ghost Zhu',       description: 'Boo! Floating through walls and haunting the snack cabinet. Spooky but adorable!',               color: 'cream',    expression: 'silly',   accessory: 'none',          pose: 'waving' },
  { name: 'Wizard Zhu',      description: "Wingardium levio-SWINE! Casting spells with a magical wand. You're a wizard, Zhu!",             color: 'lavender', expression: 'cool',    accessory: 'witch_hat',     pose: 'thinking' },
  { name: 'Sleepy Zhu',      description: 'Head bobbing, eyes heavy. Fighting to stay awake but losing the battle.',                        color: 'cream',    expression: 'sleepy',  accessory: 'pillow',        pose: 'sleeping' },
  { name: 'Snoring Zhu',     description: 'ZZZZZZZZ. Loud enough to wake the whole neighborhood. Someone get earplugs!',                   color: 'pink',     expression: 'sleepy',  accessory: 'none',          pose: 'sleeping' },
  { name: 'Drooling Zhu',    description: 'Fast asleep and dreaming of food. A little puddle forming on the pillow.',                       color: 'peach',    expression: 'sleepy',  accessory: 'pillow',        pose: 'sleeping' },
  { name: 'Night Owl Zhu',   description: 'Wide awake at 3 AM. The best ideas come in the middle of the night!',                            color: 'lavender', expression: 'focused', accessory: 'laptop',        pose: 'sitting' },
  { name: 'Early Bird Zhu',  description: 'Up before the sun! Chirping and ready to seize the day. Good morning world!',                    color: 'cream',    expression: 'happy',   accessory: 'coffee_cup',    pose: 'waving' },
  { name: 'Stuck Zhu',       description: "Wedged in a tight spot. Tried to squeeze through and now can't get out! Help!",                 color: 'peach',    expression: 'scared',  accessory: 'none',          pose: 'sitting' },
  { name: 'Lost Zhu',        description: "Map is upside down, phone is dead. Completely and utterly lost.",                                color: 'mint',     expression: 'confused', accessory: 'none',         pose: 'thinking' },
  { name: 'Falling Zhu',     description: 'Tripped on a banana peel! Arms flailing, gravity taking over. Going down!',                      color: 'peach',    expression: 'surprised', accessory: 'none',      pose: 'running' },
  { name: 'Bumped Zhu',      description: 'Walked straight into a glass door. Nose is sore but dignity is more wounded.',                   color: 'pink',     expression: 'dizzy',   accessory: 'bandage',       pose: 'standing' },
  { name: 'Dirty Zhu',       description: 'Rolled in the mud and loving it. Bath time is going to be a battle!',                            color: 'peach',    expression: 'happy',   accessory: 'mud_splat',     pose: 'dancing' },
  { name: 'Party Zhu',       description: 'Dancing on the tables! The life of the party with a hat and moves.',                             color: 'pink',     expression: 'happy',   accessory: 'party_hat',     pose: 'dancing' },
  { name: 'Drunk Zhu',       description: 'Had one too many! Stumbling around, slurring words, but having the time of their life.',        color: 'coral',    expression: 'dizzy',   accessory: 'party_hat',     pose: 'dancing' },
  { name: 'Hungover Zhu',    description: 'Never drinking again... Head pounding, sunglasses on, desperately seeking water.',               color: 'lime',     expression: 'sick',    accessory: 'sunglasses',    pose: 'sleeping' },
  { name: 'Dancing Zhu',     description: 'Hitting the dance floor with killer moves! No rhythm but maximum enthusiasm.',                    color: 'lavender', expression: 'happy',   accessory: 'headphones',    pose: 'dancing' },
  { name: 'Karaoke Zhu',     description: 'Belting out a power ballad on stage. Tone deaf but passion is off the charts!',                  color: 'coral',    expression: 'silly',   accessory: 'headphones',    pose: 'dancing' },
  { name: 'Working Zhu',     description: 'Deep in the zone, headphones on, crushing the to-do list. Productivity mode activated!',        color: 'mint',     expression: 'focused', accessory: 'laptop',        pose: 'sitting' },
  { name: 'Shopping Zhu',    description: 'Arms full of bags! Swipe that card — retail therapy at its finest.',                             color: 'pink',     expression: 'happy',   accessory: 'sunglasses',    pose: 'waving' },
  { name: 'Cooking Zhu',     description: 'Sizzling pans and flying ingredients! Something delicious is coming together.',                   color: 'peach',    expression: 'focused', accessory: 'chef_hat',      pose: 'cooking' },
  { name: 'Traveling Zhu',   description: 'Suitcase packed, passport ready! Adventure awaits in far-off lands.',                             color: 'sky',      expression: 'happy',   accessory: 'sunglasses',    pose: 'running' },
  { name: 'Reading Zhu',     description: "Curled up with a good book, lost in another world. Shh, they're at the good part!",             color: 'cream',    expression: 'happy',   accessory: 'none',          pose: 'reading' },
];

/* ---------- SVG String Builders (ported from renderer.tsx) ---------- */

function buildEars(cx, hy, palette) {
  const leftEar   = `polygon points="${cx-28},${hy-22} ${cx-38},${hy-42} ${cx-14},${hy-30}" fill="${palette.body}"`;
  const leftInner = `polygon points="${cx-26},${hy-26} ${cx-32},${hy-38} ${cx-20},${hy-30}" fill="${palette.earInner}"`;
  const rightEar   = `polygon points="${cx+28},${hy-22} ${cx+38},${hy-42} ${cx+14},${hy-30}" fill="${palette.body}"`;
  const rightInner = `polygon points="${cx+26},${hy-26} ${cx+32},${hy-38} ${cx+20},${hy-30}" fill="${palette.earInner}"`;
  return `<${leftEar}/><${leftInner}/><${rightEar}/><${rightInner}/>`;
}

function buildEyes(cx, eyeY, eyes) {
  const gap = 10;
  switch (eyes) {
    case 'arc':
      return `<path d="M ${cx-gap-8} ${eyeY} Q ${cx-gap} ${eyeY-6} ${cx-gap+8} ${eyeY}" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round"/><path d="M ${cx+gap-8} ${eyeY} Q ${cx+gap} ${eyeY-6} ${cx+gap+8} ${eyeY}" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>`;
    case 'slant':
      return `<line x1="${cx-gap-6}" y1="${eyeY-4}" x2="${cx-gap+4}" y2="${eyeY+2}" stroke="#333" stroke-width="2.5" stroke-linecap="round"/><line x1="${cx+gap-4}" y1="${eyeY+2}" x2="${cx+gap+6}" y2="${eyeY-4}" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>`;
    case 'half':
      return `<circle cx="${cx-gap}" cy="${eyeY-1}" r="6" fill="#333"/><circle cx="${cx+gap}" cy="${eyeY-1}" r="6" fill="#333"/>`;
    case 'wide':
      return `<circle cx="${cx-gap}" cy="${eyeY}" r="7" fill="white" stroke="#333" stroke-width="1.5"/><circle cx="${cx-gap}" cy="${eyeY}" r="3.5" fill="#333"/><circle cx="${cx+gap}" cy="${eyeY}" r="7" fill="white" stroke="#333" stroke-width="1.5"/><circle cx="${cx+gap}" cy="${eyeY}" r="3.5" fill="#333"/>`;
    case 'x':
      return `<line x1="${cx-gap-4}" y1="${eyeY-4}" x2="${cx-gap+4}" y2="${eyeY+4}" stroke="#333" stroke-width="2.5" stroke-linecap="round"/><line x1="${cx-gap+4}" y1="${eyeY-4}" x2="${cx-gap-4}" y2="${eyeY+4}" stroke="#333" stroke-width="2.5" stroke-linecap="round"/><line x1="${cx+gap-4}" y1="${eyeY-4}" x2="${cx+gap+4}" y2="${eyeY+4}" stroke="#333" stroke-width="2.5" stroke-linecap="round"/><line x1="${cx+gap+4}" y1="${eyeY-4}" x2="${cx+gap-4}" y2="${eyeY+4}" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>`;
    case 'closed':
      return `<line x1="${cx-gap-6}" y1="${eyeY}" x2="${cx-gap+6}" y2="${eyeY}" stroke="#333" stroke-width="2.5" stroke-linecap="round"/><line x1="${cx+gap-6}" y1="${eyeY}" x2="${cx+gap+6}" y2="${eyeY}" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>`;
    case 'uneven':
      return `<circle cx="${cx-gap}" cy="${eyeY-1}" r="5" fill="#333"/><line x1="${cx+gap-4}" y1="${eyeY}" x2="${cx+gap+5}" y2="${eyeY}" stroke="#333" stroke-width="2" stroke-linecap="round"/>`;
    case 'dot':
      return `<circle cx="${cx-gap}" cy="${eyeY}" r="3" fill="#333"/><circle cx="${cx+gap}" cy="${eyeY}" r="3" fill="#333"/>`;
    case 'spiral':
      return `<circle cx="${cx-gap}" cy="${eyeY}" r="6" fill="white" stroke="#333" stroke-width="1"/><path d="M ${cx-gap-2} ${eyeY-2} Q ${cx-gap+2} ${eyeY-2} ${cx-gap+2} ${eyeY} Q ${cx-gap+2} ${eyeY+2} ${cx-gap-2} ${eyeY+2}" fill="none" stroke="#333" stroke-width="1.2"/><circle cx="${cx+gap}" cy="${eyeY}" r="6" fill="white" stroke="#333" stroke-width="1"/><path d="M ${cx+gap-2} ${eyeY-2} Q ${cx+gap+2} ${eyeY-2} ${cx+gap+2} ${eyeY} Q ${cx+gap+2} ${eyeY+2} ${cx+gap-2} ${eyeY+2}" fill="none" stroke="#333" stroke-width="1.2"/>`;
    case 'dotWide':
      return `<circle cx="${cx-gap}" cy="${eyeY}" r="3.5" fill="white" stroke="#333" stroke-width="1"/><circle cx="${cx-gap}" cy="${eyeY}" r="1.8" fill="#333"/><circle cx="${cx+gap}" cy="${eyeY}" r="3.5" fill="white" stroke="#333" stroke-width="1"/><circle cx="${cx+gap}" cy="${eyeY}" r="1.8" fill="#333"/>`;
    default:
      return `<circle cx="${cx-gap}" cy="${eyeY}" r="4" fill="#333"/><circle cx="${cx+gap}" cy="${eyeY}" r="4" fill="#333"/>`;
  }
}

function buildMouth(cx, cy, mouth) {
  switch (mouth) {
    case 'smile':      return `<path d="M ${cx-7} ${cy-1} Q ${cx} ${cy+6} ${cx+7} ${cy-1}" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round"/>`;
    case 'frown':      return `<path d="M ${cx-7} ${cy+5} Q ${cx} ${cy-2} ${cx+7} ${cy+5}" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round"/>`;
    case 'smirk':      return `<path d="M ${cx-5} ${cy-1} Q ${cx} ${cy+4} ${cx+10} ${cy-1}" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round"/>`;
    case 'frownSmall': return `<path d="M ${cx-5} ${cy+3} Q ${cx} ${cy} ${cx+5} ${cy+3}" fill="none" stroke="#333" stroke-width="2" stroke-linecap="round"/>`;
    case 'open':       return `<ellipse cx="${cx}" cy="${cy+1}" rx="6" ry="5" fill="#333"/>`;
    case 'openSmall':  return `<ellipse cx="${cx}" cy="${cy+1}" rx="4" ry="3" fill="#333"/>`;
    case 'openOval':   return `<ellipse cx="${cx}" cy="${cy+1}" rx="5" ry="7" fill="#333"/>`;
    case 'heart':      return `<g transform="translate(${cx-5}, ${cy-2})"><path d="M 5 9 C 5 4 0 2 0 5 C 0 8 5 12 5 12 C 5 12 10 8 10 5 C 10 2 5 4 5 9 Z" fill="#FF69B4" transform="scale(0.8)"/></g>`;
    case 'wavy':       return `<path d="M ${cx-8} ${cy} Q ${cx-3} ${cy+4} ${cx} ${cy} Q ${cx+3} ${cy-4} ${cx+8} ${cy}" fill="none" stroke="#333" stroke-width="1.5" stroke-linecap="round"/>`;
    case 'chatter':    return `<rect x="${cx-5}" y="${cy-2}" width="3" height="6" rx="0.5" fill="#FFF" stroke="#333" stroke-width="0.8"/><rect x="${cx+2}" y="${cy-2}" width="3" height="6" rx="0.5" fill="#FFF" stroke="#333" stroke-width="0.8"/><line x1="${cx-5}" y1="${cy-2}" x2="${cx-2}" y2="${cy-2}" stroke="#333" stroke-width="0.8"/><line x1="${cx+2}" y1="${cy-2}" x2="${cx+5}" y2="${cy-2}" stroke="#333" stroke-width="0.8"/><line x1="${cx-12}" y1="${cy-4}" x2="${cx-8}" y2="${cy-1}" stroke="#87CEEB" stroke-width="1" stroke-linecap="round"/><line x1="${cx+8}" y1="${cy-4}" x2="${cx+12}" y2="${cy-1}" stroke="#87CEEB" stroke-width="1" stroke-linecap="round"/>`;
    case 'flat':       return `<line x1="${cx-7}" y1="${cy+1}" x2="${cx+7}" y2="${cy+1}" stroke="#333" stroke-width="2" stroke-linecap="round"/>`;
    default:           return '';
  }
}

function buildSpecial(cx, hy, special) {
  switch (special) {
    case 'tear':    return `<path d="M ${cx-30} ${hy-5} Q ${cx-32} ${hy+1} ${cx-30} ${hy+5} Q ${cx-28} ${hy+1} ${cx-30} ${hy-5} Z" fill="#87CEEB"/>`;
    case 'tongue':  return `<ellipse cx="${cx}" cy="${hy+28}" rx="5" ry="4" fill="#FF8C94"/>`;
    case 'hearts':  return `<path d="M 0 9 C 0 4 -5 2 -5 5 C -5 8 0 12 0 12 C 0 12 5 8 5 5 C 5 2 0 4 0 9 Z" fill="#FF69B4" transform="translate(${cx-20}, ${hy-35}) scale(0.6)"/><path d="M 0 9 C 0 4 -5 2 -5 5 C -5 8 0 12 0 12 C 0 12 5 8 5 5 C 5 2 0 4 0 9 Z" fill="#FF69B4" transform="translate(${cx+15}, ${hy-40}) scale(0.5)"/>`;
    case 'sparkle': return `<text x="${cx+18}" y="${hy-35}" font-size="16" fill="#FFD700">✦</text><text x="${cx+28}" y="${hy-45}" font-size="10" fill="#FFD700">✦</text>`;
    case 'sweat':   return `<path d="M ${cx+28} ${hy-10} Q ${cx+25} ${hy-6} ${cx+28} ${hy-2} Q ${cx+31} ${hy-6} ${cx+28} ${hy-10} Z" fill="#87CEEB" opacity="0.8"/>`;
    case 'drip':    return `<ellipse cx="${cx-25}" cy="${hy-22}" rx="3" ry="5" fill="#87CEEB" opacity="0.7"/><ellipse cx="${cx+28}" cy="${hy-26}" rx="2.5" ry="4" fill="#87CEEB" opacity="0.6"/><ellipse cx="${cx+5}" cy="${hy-32}" rx="2" ry="3" fill="#87CEEB" opacity="0.5"/>`;
    case 'zzz':     return `<text x="${cx+30}" y="${hy-28}" font-size="12" fill="#999" font-family="sans-serif" font-weight="bold">z</text><text x="${cx+38}" y="${hy-38}" font-size="9" fill="#BBB" font-family="sans-serif" font-weight="bold">z</text><text x="${cx+44}" y="${hy-46}" font-size="7" fill="#DDD" font-family="sans-serif" font-weight="bold">z</text>`;
    case 'bandaid': return `<g transform="translate(${cx+18}, ${hy-8})"><rect x="-8" y="-3" width="16" height="6" rx="2" fill="#F5DEB3"/><rect x="-2" y="-4" width="4" height="8" rx="0.5" fill="#FFF"/></g>`;
    default:        return '';
  }
}

function buildBody(cx, by, poseConfig, palette) {
  if (!poseConfig.showLimbs) {
    return `
      <ellipse cx="${cx}" cy="${by+15}" rx="55" ry="30" fill="${palette.body}"/>
      <text x="${cx+45}" y="${by-10}" font-size="14" fill="#999" font-family="sans-serif" font-weight="bold">z</text>
      <text x="${cx+55}" y="${by-24}" font-size="11" fill="#BBB" font-family="sans-serif" font-weight="bold">z</text>
      <text x="${cx+62}" y="${by-35}" font-size="9" fill="#DDD" font-family="sans-serif" font-weight="bold">z</text>
    `;
  }
  const tailSVG = `<path d="M ${cx-42} ${by-15} Q ${cx-57} ${by-33} ${cx-52} ${by-23} Q ${cx-47} ${by-13} ${cx-57} ${by-20}" fill="none" stroke="${palette.body}" stroke-width="4" stroke-linecap="round"/>`;
  const armLen = 22;
  const leftRad  = (poseConfig.armLeftAngle  * Math.PI) / 180;
  const rightRad = (poseConfig.armRightAngle * Math.PI) / 180;
  const lx = cx - 30 + Math.cos(leftRad)  * armLen;
  const ly = by - 10 + Math.sin(leftRad)  * armLen;
  const rx = cx + 30 + Math.cos(rightRad) * armLen;
  const ry = by - 10 + Math.sin(rightRad) * armLen;
  return `
    <ellipse cx="${cx}" cy="${by}" rx="42" ry="38" fill="${palette.body}"/>
    ${tailSVG}
    <line x1="${cx-30}" y1="${by-10}" x2="${lx}" y2="${ly}" stroke="${palette.body}" stroke-width="10" stroke-linecap="round"/>
    <circle cx="${lx}" cy="${ly}" r="5" fill="${palette.body}" opacity="0.7"/>
    <line x1="${cx+30}" y1="${by-10}" x2="${rx}" y2="${ry}" stroke="${palette.body}" stroke-width="10" stroke-linecap="round"/>
    <circle cx="${rx}" cy="${ry}" r="5" fill="${palette.body}" opacity="0.7"/>
    <ellipse cx="${cx-16}" cy="${by+38}" rx="12" ry="8" fill="${palette.body}"/>
    <ellipse cx="${cx+16}" cy="${by+38}" rx="12" ry="8" fill="${palette.body}"/>
    <ellipse cx="${cx-16}" cy="${by+44}" rx="10" ry="5" fill="${palette.earInner}" opacity="0.6"/>
    <ellipse cx="${cx+16}" cy="${by+44}" rx="10" ry="5" fill="${palette.earInner}" opacity="0.6"/>
  `;
}

function buildAccessory(accessory, cx) {
  switch (accessory) {
    case 'chef_hat':
      return `<g transform="translate(${cx}, 28)"><rect x="-22" y="-4" width="44" height="10" rx="3" fill="white" stroke="#DDD" stroke-width="1"/><ellipse cx="-8" cy="-15" rx="16" ry="12" fill="white" stroke="#DDD" stroke-width="1"/><ellipse cx="8" cy="-16" rx="14" ry="11" fill="white" stroke="#DDD" stroke-width="1"/></g>`;
    case 'scarf':
      return `<rect x="${cx-28}" y="108" width="56" height="14" rx="5" fill="#FF6347"/><path d="M ${cx+8} 115 C ${cx+15} 115 ${cx+18} 130 ${cx+15} 140 L ${cx+5} 140 C ${cx+8} 132 ${cx+7} 122 ${cx+2} 118 Z" fill="#FF6347"/><line x1="${cx-20}" y1="110" x2="${cx-20}" y2="120" stroke="#FFD700" stroke-width="2"/><line x1="${cx-10}" y1="110" x2="${cx-10}" y2="120" stroke="#FFD700" stroke-width="2"/><line x1="${cx}" y1="110" x2="${cx}" y2="120" stroke="#FFD700" stroke-width="2"/>`;
    case 'sunglasses':
      return `<rect x="${cx-25}" y="71" width="20" height="12" rx="4" fill="#222"/><rect x="${cx+5}" y="71" width="20" height="12" rx="4" fill="#222"/><line x1="${cx-5}" y1="77" x2="${cx+5}" y2="77" stroke="#222" stroke-width="2"/><rect x="${cx-24}" y="72" width="18" height="10" rx="3" fill="#444" opacity="0.6"/><rect x="${cx+6}" y="72" width="18" height="10" rx="3" fill="#444" opacity="0.6"/>`;
    case 'flower_crown': {
      let flowers = '';
      [78, 100, 122].forEach((fx) => {
        [0, 72, 144, 216, 288].forEach((angle) => {
          const rad = (angle * Math.PI) / 180;
          flowers += `<ellipse cx="${fx + 3 * Math.cos(rad)}" cy="${34 + 3 * Math.sin(rad)}" rx="4" ry="3" fill="#FF69B4" opacity="0.8"/>`;
        });
        flowers += `<circle cx="${fx}" cy="34" r="2.5" fill="#FFD700"/>`;
      });
      flowers += `<path d="M 65 42 Q 100 30 135 42" fill="none" stroke="#90EE90" stroke-width="2"/>`;
      return flowers;
    }
    case 'party_hat':
      return `<g transform="translate(${cx}, 25)"><polygon points="-16,14 0,-20 16,14" fill="#FF69B4"/><line x1="-10" y1="8" x2="10" y2="8" stroke="#FFD700" stroke-width="2"/><line x1="-6" y1="0" x2="6" y2="0" stroke="#FFD700" stroke-width="2"/><line x1="-2" y1="-8" x2="2" y2="-8" stroke="#FFD700" stroke-width="2"/><circle cx="0" cy="-20" r="5" fill="#FFD700"/></g>`;
    case 'headphones':
      return `<path d="M 75 38 Q 100 25 125 38" fill="none" stroke="#555" stroke-width="5" stroke-linecap="round"/><rect x="68" y="42" width="10" height="18" rx="5" fill="#444"/><rect x="122" y="42" width="10" height="18" rx="5" fill="#444"/>`;
    case 'bow_tie':
      return `<g transform="translate(${cx}, 112)"><path d="M -14 -6 L 0 0 L -14 6 Z" fill="#4169E1"/><path d="M 14 -6 L 0 0 L 14 6 Z" fill="#4169E1"/><circle cx="0" cy="0" r="3" fill="#3158C8"/></g>`;
    case 'crown':
      return `<g transform="translate(${cx}, 28)"><rect x="-18" y="4" width="36" height="12" rx="2" fill="#FFD700"/><polygon points="-18,4 -14,-8 -8,4" fill="#FFD700"/><polygon points="-6,4 0,-12 6,4" fill="#FFD700"/><polygon points="8,4 14,-8 18,4" fill="#FFD700"/><circle cx="-11" cy="-2" r="2" fill="#FF0000"/><circle cx="0" cy="-5" r="2.5" fill="#4169E1"/><circle cx="11" cy="-2" r="2" fill="#FF0000"/></g>`;
    case 'witch_hat':
      return `<g transform="translate(${cx}, 25)"><ellipse cx="0" cy="10" rx="26" ry="6" fill="#4B0082"/><polygon points="-14,10 0,-24 14,10" fill="#4B0082"/><rect x="-4" y="6" width="8" height="8" rx="1" fill="none" stroke="#FFD700" stroke-width="1.5"/></g>`;
    case 'santa_hat':
      return `<g transform="translate(${cx}, 25)"><polygon points="-18,10 0,-30 18,10" fill="#FF0000"/><ellipse cx="0" cy="10" rx="19" ry="5" fill="white"/><circle cx="0" cy="-30" r="5" fill="white"/><path d="M 2 -20 Q 10 -18 16 -10 Q 12 -14 2 -16 Z" fill="#CC0000"/></g>`;
    case 'thermometer':
      return `<g transform="translate(120, 95)"><rect x="-3" y="-22" width="6" height="28" rx="3" fill="white" stroke="#DDD" stroke-width="1"/><circle cx="0" cy="8" r="6" fill="#FF4444" stroke="#DDD" stroke-width="1"/><rect x="-1.5" y="-2" width="3" height="14" rx="1.5" fill="#FF4444"/><line x1="4" y1="-15" x2="8" y2="-15" stroke="#999" stroke-width="0.8"/><line x1="4" y1="-8" x2="8" y2="-8" stroke="#999" stroke-width="0.8"/><line x1="4" y1="-1" x2="8" y2="-1" stroke="#999" stroke-width="0.8"/></g>`;
    case 'umbrella':
      return `<g transform="translate(130, 30)"><path d="M -5 50 Q -10 40 0 35" fill="none" stroke="#8B4513" stroke-width="3" stroke-linecap="round"/><path d="M -30 35 Q -15 0 0 35 Q 15 0 30 35 Z" fill="#4488FF"/><line x1="0" y1="5" x2="-15" y2="35" stroke="#3366CC" stroke-width="1"/><line x1="0" y1="5" x2="0" y2="35" stroke="#3366CC" stroke-width="1"/><line x1="0" y1="5" x2="15" y2="35" stroke="#3366CC" stroke-width="1"/><circle cx="0" cy="5" r="3" fill="#3366CC"/></g>`;
    case 'coffee_cup':
      return `<g transform="translate(120, 120)"><rect x="-14" y="-10" width="28" height="18" rx="3" fill="#FFF" stroke="#DDD" stroke-width="1.5"/><path d="M 14 -4 Q 22 -4 22 4 Q 22 10 14 8" fill="none" stroke="#DDD" stroke-width="3" stroke-linecap="round"/><rect x="-11" y="-4" width="22" height="8" rx="2" fill="#6B3A2E"/><path d="M -4 -12 Q -2 -16 -4 -20" fill="none" stroke="#CCC" stroke-width="1.5" stroke-linecap="round"/><path d="M 4 -14 Q 6 -18 4 -22" fill="none" stroke="#CCC" stroke-width="1.5" stroke-linecap="round"/></g>`;
    case 'bandage':
      return `<g transform="translate(75, 65)"><rect x="-3" y="-10" width="6" height="20" rx="2" fill="#F5DEB3"/><rect x="-10" y="-3" width="20" height="6" rx="2" fill="#F5DEB3"/><rect x="-1" y="-1" width="2" height="2" fill="#FFF"/></g>`;
    case 'guitar':
      return `<g transform="translate(125, 85)"><rect x="4" y="-40" width="6" height="35" rx="2" fill="#8B4513"/><rect x="2" y="-50" width="10" height="12" rx="2" fill="#6B3410"/><circle cx="0" cy="-48" r="1.5" fill="#DDD"/><circle cx="14" cy="-48" r="1.5" fill="#DDD"/><circle cx="0" cy="-42" r="1.5" fill="#DDD"/><circle cx="14" cy="-42" r="1.5" fill="#DDD"/><ellipse cx="7" cy="10" rx="16" ry="12" fill="#DEB887" stroke="#8B4513" stroke-width="1.5"/><ellipse cx="7" cy="15" rx="13" ry="8" fill="#DEB887" stroke="#8B4513" stroke-width="1.5"/><circle cx="7" cy="10" r="6" fill="#6B3410"/><line x1="5" y1="-40" x2="5" y2="12" stroke="#DDD" stroke-width="0.5"/><line x1="7" y1="-40" x2="7" y2="12" stroke="#DDD" stroke-width="0.5"/><line x1="9" y1="-40" x2="9" y2="12" stroke="#DDD" stroke-width="0.5"/></g>`;
    case 'pillow':
      return `<g transform="translate(100, 155)"><rect x="-40" y="-12" width="80" height="22" rx="8" fill="white" stroke="#DDD" stroke-width="1"/><line x1="-30" y1="-6" x2="30" y2="-6" stroke="#EEE" stroke-width="1"/><line x1="-30" y1="0" x2="30" y2="0" stroke="#EEE" stroke-width="1"/><line x1="-30" y1="6" x2="30" y2="6" stroke="#EEE" stroke-width="1"/></g>`;
    case 'hard_hat':
      return `<g transform="translate(${cx}, 28)"><ellipse cx="0" cy="12" rx="24" ry="5" fill="#FFA500"/><path d="M -22 12 Q -20 -8 0 -12 Q 20 -8 22 12 Z" fill="#FFA500" stroke="#E89600" stroke-width="1"/><rect x="-1.5" y="-10" width="3" height="22" rx="1" fill="#E89600"/></g>`;
    case 'laptop':
      return `<g transform="translate(100, 130)"><rect x="-30" y="8" width="60" height="6" rx="1" fill="#CCC" stroke="#AAA" stroke-width="1"/><rect x="-22" y="-22" width="44" height="30" rx="2" fill="#333" stroke="#555" stroke-width="1"/><rect x="-20" y="-20" width="40" height="20" rx="1" fill="#4488FF" opacity="0.6"/><line x1="-16" y1="-16" x2="-4" y2="-16" stroke="#FFF" stroke-width="1.5" opacity="0.4"/><line x1="-16" y1="-12" x2="2" y2="-12" stroke="#FFF" stroke-width="1.5" opacity="0.4"/><line x1="-16" y1="-8" x2="-8" y2="-8" stroke="#FFF" stroke-width="1.5" opacity="0.4"/><line x1="-22" y1="8" x2="22" y2="8" stroke="#999" stroke-width="1.5"/></g>`;
    case 'mud_splat':
      return `<ellipse cx="80" cy="145" rx="12" ry="6" fill="#8B6914" opacity="0.7"/><ellipse cx="125" cy="150" rx="8" ry="4" fill="#8B6914" opacity="0.5"/><ellipse cx="110" cy="140" rx="6" ry="3" fill="#8B6914" opacity="0.6"/><ellipse cx="90" cy="38" rx="5" ry="3" fill="#8B6914" opacity="0.4"/>`;
    default:
      return '';
  }
}

function renderSVGToString(config) {
  const palette     = PIG_COLORS[config.color];
  const expr        = EXPRESSIONS[config.expression];
  const poseConfig  = POSE_CONFIGS[config.pose];

  const cx = 100;
  const hy = 78;
  const by = poseConfig.bodyY;

  const eyesSVG    = buildEyes(cx, hy - 4, expr.eyes);
  const mouthSVG   = buildMouth(cx, hy + 22, expr.mouth);
  const cheeksSVG  = expr.cheeks
    ? `<ellipse cx="${cx-25}" cy="${hy+10}" rx="8" ry="5" fill="#FF9999" opacity="0.4"/><ellipse cx="${cx+25}" cy="${hy+10}" rx="8" ry="5" fill="#FF9999" opacity="0.4"/>`
    : '';
  const eyebrowSVG = expr.eyebrow === 'down'
    ? `<line x1="${cx-20}" y1="${hy-14}" x2="${cx-8}" y2="${hy-10}" stroke="#666" stroke-width="2.5" stroke-linecap="round"/><line x1="${cx+20}" y1="${hy-14}" x2="${cx+8}" y2="${hy-10}" stroke="#666" stroke-width="2.5" stroke-linecap="round"/>`
    : '';
  const specialSVG   = buildSpecial(cx, hy, expr.special);
  const bodySVG      = buildBody(cx, by, poseConfig, palette);
  const accessorySVG = buildAccessory(config.accessory, cx);

  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#FFFDF7"/>
  ${bodySVG}
  <circle cx="${cx}" cy="${hy}" r="42" fill="${palette.body}"/>
  ${buildEars(cx, hy, palette)}
  <ellipse cx="${cx}" cy="${hy+14}" rx="16" ry="12" fill="${palette.snout}"/>
  <circle cx="${cx-5}" cy="${hy+13}" r="2.5" fill="${palette.earInner}"/>
  <circle cx="${cx+5}" cy="${hy+13}" r="2.5" fill="${palette.earInner}"/>
  ${cheeksSVG}
  ${eyesSVG}
  ${eyebrowSVG}
  ${mouthSVG}
  ${specialSVG}
  ${accessorySVG}
</svg>`.trim();
}

/* ---------- Generate ---------- */

const results = DEFAULT_STAMPS.map((config) => {
  const svgString = renderSVGToString(config);
  const base64    = Buffer.from(svgString, 'utf8').toString('base64');
  return {
    name:        config.name,
    description: config.description,
    imageData:   `data:image/svg+xml;base64,${base64}`,
  };
});

const outPath = join(__dirname, '../src/db/seed-images.json');
writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf8');

console.log(`✓ Generated ${results.length} SVG data URIs → src/db/seed-images.json`);
