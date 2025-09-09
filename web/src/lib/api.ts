import type { Fan, MatchWithFans, FeedEntry } from './types';
import fansJson from '../fixtures/fans.json';
import totalsJson from '../fixtures/totals.json';

export interface DataClient {
  getLiveMatch(): Promise<MatchWithFans | null>;
  vote(matchId: string, fanId: string): Promise<{ ok: true }>; // Placeholder for future integrity work
  getFeed(opts: { offset: number; limit: number }): Promise<Fan[]>;
  getFeedEntries(opts: { offset: number; limit: number }): Promise<FeedEntry[]>;
}

export class MockClient implements DataClient {
  private fans: Fan[];
  private live: MatchWithFans | null;

  constructor() {
    this.fans = (fansJson as Fan[]);

    const challenger1 = this.fans[18];
    const challenger2 = this.fans[19];
    const start = new Date();
    const end = new Date(start.getTime() + 6 * 60 * 60 * 1000);

    const totals: Record<string, number> = (totalsJson as any)['m1'] ?? {};

    this.live = {
      id: 'm1',
      challenger1Id: challenger1.id,
      challenger2Id: challenger2.id,
      startAt: start.toISOString(),
      endAt: end.toISOString(),
      winnerFanId: null,
      challenger1,
      challenger2,
      totals,
    };
  }

  async getLiveMatch(): Promise<MatchWithFans | null> {
    return this.live;
  }

  async vote(): Promise<{ ok: true }> {
    // No-op for MVP mock
    return { ok: true };
  }

  async getFeed({ offset, limit }: { offset: number; limit: number }): Promise<Fan[]> {
    const sorted = [...this.fans].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    return sorted.slice(offset, offset + limit);
  }

  async getFeedEntries({ offset, limit }: { offset: number; limit: number }): Promise<FeedEntry[]> {
    // Fake historical entries: alternate winner/loser with totals derived from index
    const page = await this.getFeed({ offset, limit })
    return page.map((fan, i) => {
      const total = 5 + (offset + i)
      const result: 'winner' | 'loser' = ((offset + i) % 3 === 0) ? 'winner' : 'loser'
      return { id: `${fan.id}-${offset+i}`, fan, total, result }
    })
  }
}

export function createClient(): DataClient {
  // Later: switch based on env to real backend
  return new MockClient();
}


