import type { Fan, MatchWithFans, FeedEntry } from './types';
import fansJson from '../fixtures/fans.json';
import totalsJson from '../fixtures/totals.json';

export interface DataClient {
  getLiveMatch(): Promise<MatchWithFans | null>;
  vote(matchId: string, fanId: string): Promise<{ ok: true }>; // Placeholder for future integrity work
  getFeed(opts: { offset: number; limit: number }): Promise<Fan[]>;
  getFeedEntries(opts: { offset: number; limit: number }): Promise<FeedEntry[]>;
  getCurrentTotals(): Promise<Record<string, number>>;
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


  async getCurrentTotals(): Promise<Record<string, number>> {
    return this.live?.totals ?? {}
  }
}

export function createClient(): DataClient {
  const base = (import.meta.env.VITE_API_BASE as string) || '/api'
  return new RestClient(base)
}


class RestClient implements DataClient {
  private base: string
  constructor(base: string) { this.base = base }

  private async json<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${this.base}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...init,
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`${res.status} ${res.statusText} ${text}`)
    }
    return res.json()
  }

  async getLiveMatch(): Promise<MatchWithFans | null> {
    const r = await this.json<any>('/match/bootstrap')
    return {
      id: r.match.id,
      challenger1Id: r.match.challenger1Id,
      challenger2Id: r.match.challenger2Id,
      startAt: r.match.startAt,
      endAt: r.match.endAt,
      winnerFanId: null,
      challenger1: r.challenger1,
      challenger2: r.challenger2,
      totals: r.totals,
    }
  }

  async vote(matchId: string, fanId: string): Promise<{ ok: true }> {
    await this.json(`/fans/${fanId}/like`, { method: 'POST', body: JSON.stringify({ count: 1 }) })
    return { ok: true }
  }

  async getFeed({ offset, limit }: { offset: number; limit: number }): Promise<Fan[]> {
    // Placeholder: reuse fixtures until feed endpoint exists
    const fans = (fansJson as any) as Fan[]
    const sorted = [...fans].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    return sorted.slice(offset, offset + limit)
  }

  async getFeedEntries({ offset, limit }: { offset: number; limit: number }): Promise<FeedEntry[]> {
    const page = await this.getFeed({ offset, limit })
    return page.map((fan, i) => {
      const total = 5 + (offset + i)
      const result: 'winner' | 'loser' = ((offset + i) % 3 === 0) ? 'winner' : 'loser'
      return { id: `${fan.id}-${offset+i}`, fan, total, result }
    })
  }

  async getCurrentTotals(): Promise<Record<string, number>> {
    const r = await this.json<{ totals: Record<string, number> }>(`/match/current/totals`)
    return r.totals
  }
}


