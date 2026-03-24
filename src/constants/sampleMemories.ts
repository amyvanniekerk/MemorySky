import { Memory } from '../types/Memory';

export const SAMPLE_MEMORIES: Memory[] = [
  { id: '1', title: 'Graduated university', date: new Date('2020-06-15'), description: 'Walked across the stage and felt like I could take on the world. Four years of late nights finally paid off.', emotion: 'excited', category: 'milestone', importance: 5 },
  { id: '2', title: 'Road trip to Big Sur', date: new Date('2022-09-03'), description: 'Drove down the Pacific Coast Highway with the windows down. Stopped at every overlook.', emotion: 'peaceful', category: 'travel', importance: 4, location: 'Big Sur, CA' },
  { id: '3', title: 'Lost my dog Max', date: new Date('2021-11-20'), description: 'He was 14. I held him at the vet and told him he was the best boy. He was.', emotion: 'sad', category: 'family', importance: 5 },
  { id: '4', title: 'First day at new job', date: new Date('2023-03-06'), description: 'Nervous but excited. Everyone was so welcoming. Free snacks in the kitchen.', emotion: 'excited', category: 'career', importance: 3 },
  { id: '5', title: 'Cooked dinner for friends', date: new Date('2024-01-14'), description: 'Made pasta from scratch for the first time. It was messy but everyone loved it.', emotion: 'happy', category: 'friendship', importance: 2 },
  { id: '6', title: 'Watched the sunrise alone', date: new Date('2023-08-22'), description: 'Couldn\'t sleep, so I drove to the hilltop. The sky turned pink and gold. Felt small in the best way.', emotion: 'peaceful', category: 'everyday', importance: 3, location: 'Griffith Observatory' },
  { id: '7', title: 'Found old childhood photos', date: new Date('2024-12-25'), description: 'Mom pulled out a box of photos from the attic. I barely recognized myself but I remembered every moment.', emotion: 'nostalgic', category: 'childhood', importance: 3 },
  { id: '8', title: 'First kiss', date: new Date('2019-07-04'), description: 'Fireworks in the sky, fireworks in my chest. Corny but true.', emotion: 'bittersweet', category: 'romance', importance: 4 },
  { id: '9', title: 'Got the apartment', date: new Date('2023-01-10'), description: 'Signed the lease on my first solo apartment. Sat on the empty floor and just smiled.', emotion: 'grateful', category: 'milestone', importance: 4 },
  { id: '10', title: 'Ran my first 10K', date: new Date('2024-04-07'), description: 'Didn\'t think I could do it. Legs were screaming by mile 4 but I crossed that finish line.', emotion: 'happy', category: 'milestone', importance: 3, location: 'Central Park, NYC' },
];
