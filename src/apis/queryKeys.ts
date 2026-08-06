const allergensRoot = ['allergens'] as const;
const authRoot = ['auth'] as const;
const companionsRoot = ['companions'] as const;
const draftsRoot = ['drafts'] as const;
const homeLocationsRoot = ['homeLocations'] as const;
const recordsRoot = ['records'] as const;
const userRoot = ['user'] as const;

export const queryKeys = {
  allergens: {
    all: allergensRoot,
  },
  auth: {
    all: authRoot,
    sessions: [...authRoot, 'sessions'] as const,
  },
  companions: {
    all: companionsRoot,
    records: (companionId: number) => [...companionsRoot, companionId, 'records'] as const,
    pendingRequests: [...companionsRoot, 'pendingRequests'] as const,
    myCode: [...companionsRoot, 'myCode'] as const,
  },
  drafts: {
    all: draftsRoot,
    pending: [...draftsRoot, 'pending'] as const,
    pendingCount: [...draftsRoot, 'pendingCount'] as const,
  },
  homeLocations: {
    all: homeLocationsRoot,
  },
  records: {
    all: recordsRoot,
    byDate: (date: string) => [...recordsRoot, 'byDate', date] as const,
    calendar: (year: number, month: number) => [...recordsRoot, 'calendar', year, month] as const,
    restaurantSearch: (query: string, latitude?: number, longitude?: number) =>
      [...recordsRoot, 'restaurants', query, latitude ?? null, longitude ?? null] as const,
  },
  user: {
    all: userRoot,
    me: [...userRoot, 'me'] as const,
  },
} as const;
