import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Stamp } from '@/db/database';

/** Stamps visible on the Home page — only those added to collection */
export function useAllStamps(): Stamp[] | undefined {
  return useLiveQuery(async () => {
    const all = await db.stamps.orderBy('createdAt').toArray();
    return all.filter((s) => s.isBuiltIn === true);
  });
}

export function useStamp(id: number): Stamp | undefined {
  return useLiveQuery(() => db.stamps.get(id), [id]);
}

/** Unlocked stamps in the collection */
export function useUnlockedStamps(sortBy: string = 'unlockedAt'): Stamp[] | undefined {
  return useLiveQuery(async () => {
    const all = await db.stamps.toArray();
    const unlocked = all.filter((s) => s.isBuiltIn === true && s.unlockedAt !== null);

    switch (sortBy) {
      case 'name':
        return unlocked.sort((a, b) => a.name.localeCompare(b.name));
      case 'encounters':
        return unlocked.sort((a, b) => b.encounterCount - a.encounterCount);
      case 'unlockedAt':
      default:
        return unlocked.sort((a, b) => {
          const da = a.unlockedAt?.getTime() ?? 0;
          const db_ = b.unlockedAt?.getTime() ?? 0;
          return db_ - da;
        });
    }
  });
}

/** Stats only count stamps added to collection */
export function useStats() {
  return useLiveQuery(async () => {
    const all = await db.stamps.toArray();
    const inCollection = all.filter((s) => s.isBuiltIn === true);
    const unlocked = inCollection.filter((s) => s.unlockedAt !== null);
    return {
      total: inCollection.length,
      unlocked: unlocked.length,
      totalEncounters: inCollection.reduce((sum, s) => sum + s.encounterCount, 0),
    };
  });
}

/** Generated stamps not yet added to collection */
export function useAIGeneratedStamps(): Stamp[] | undefined {
  return useLiveQuery(async () => {
    const all = await db.stamps.orderBy('createdAt').reverse().toArray();
    return all.filter((s) => s.isBuiltIn === false);
  });
}