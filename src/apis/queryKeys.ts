const allergensRoot = ['allergens'] as const;
const authRoot = ['auth'] as const;
const companionsRoot = ['companions'] as const;
const draftsRoot = ['drafts'] as const;
const discoveryRoot = ['discovery'] as const;
const decisionRoomsRoot = ['decisionRooms'] as const;
const homeLocationsRoot = ['homeLocations'] as const;
const recordsRoot = ['records'] as const;
const recommendationsRoot = ['recommendations'] as const;
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
  decisionRooms: {
    all: decisionRoomsRoot,
    mine: [...decisionRoomsRoot, 'mine'] as const,
    detail: (inviteCode: string, hasParticipantToken: boolean) =>
      [...decisionRoomsRoot, 'detail', inviteCode.toUpperCase(), hasParticipantToken] as const,
    locations: (inviteCode: string, query: string, latitude?: number, longitude?: number) =>
      [
        ...decisionRoomsRoot,
        'locations',
        inviteCode.toUpperCase(),
        query,
        latitude ?? null,
        longitude ?? null,
      ] as const,
  },
  discovery: {
    all: discoveryRoot,
    feed: (params: object) => [...discoveryRoot, 'feed', params] as const,
    creators: [...discoveryRoot, 'creators'] as const,
    detail: (restaurantId: number, latitude?: number, longitude?: number) =>
      [...discoveryRoot, 'detail', restaurantId, latitude ?? null, longitude ?? null] as const,
    commentReaction: (restaurantId: number) =>
      [...discoveryRoot, 'commentReaction', restaurantId] as const,
    todayCandidates: [...discoveryRoot, 'todayCandidates'] as const,
  },
  homeLocations: {
    all: homeLocationsRoot,
  },
  recommendations: {
    all: recommendationsRoot,
    usage: [...recommendationsRoot, 'usage'] as const,
    workspaces: [...recommendationsRoot, 'workspaces'] as const,
    history: [...recommendationsRoot, 'history'] as const,
    historyDetail: (requestId: string) => [...recommendationsRoot, 'history', requestId] as const,
    locations: (query: string, latitude?: number, longitude?: number) =>
      [...recommendationsRoot, 'locations', query, latitude ?? null, longitude ?? null] as const,
  },
  records: {
    all: recordsRoot,
    byDate: (date: string) => [...recordsRoot, 'byDate', date] as const,
    calendar: (year: number, month: number) => [...recordsRoot, 'calendar', year, month] as const,
    homeRepresentative: (date: string) => [...recordsRoot, 'homeRepresentative', date] as const,
    restaurantSearch: (query: string, latitude?: number, longitude?: number) =>
      [...recordsRoot, 'restaurants', query, latitude ?? null, longitude ?? null] as const,
  },
  user: {
    all: userRoot,
    me: [...userRoot, 'me'] as const,
  },
} as const;
