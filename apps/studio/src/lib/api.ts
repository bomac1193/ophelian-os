const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'default-dev-key';

interface FetchOptions extends RequestInit {
  body?: string | FormData;
}

async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `API error: ${response.status}`);
  }

  return response.json();
}

// Character APIs
export interface Character {
  id: string;
  name: string;
  aliases: string[];
  bio: string;
  personaTags: string[];
  toneAllowed: string[];
  toneForbidden: string[];
  systemPrompt: string;
  currentArc: string | null;
  timelineState: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export async function getCharacters(): Promise<Character[]> {
  return apiFetch<Character[]>('/characters');
}

export async function getCharacter(id: string): Promise<Character> {
  return apiFetch<Character>(`/characters/${id}`);
}

export async function createCharacter(data: Partial<Character>): Promise<Character> {
  return apiFetch<Character>('/characters', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Content APIs
export interface ContentItem {
  id: string;
  characterId: string;
  platform: 'X' | 'TIKTOK' | 'INSTAGRAM';
  contentType: 'POST' | 'SCRIPT';
  text: string;
  status: 'DRAFT' | 'APPROVED' | 'PUBLISHED' | 'FAILED';
  scheduledFor: string | null;
  publishedUrl: string | null;
  meta: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export async function getContent(): Promise<ContentItem[]> {
  return apiFetch<ContentItem[]>('/content');
}

export async function generateContent(
  characterId: string,
  platform: string,
  intent: string
): Promise<ContentItem> {
  return apiFetch<ContentItem>('/content/generate', {
    method: 'POST',
    body: JSON.stringify({ characterId, platform, intent }),
  });
}

export async function approveContent(id: string): Promise<ContentItem> {
  return apiFetch<ContentItem>(`/content/${id}/approve`, {
    method: 'POST',
  });
}

export async function publishContent(id: string): Promise<ContentItem> {
  return apiFetch<ContentItem>(`/content/${id}/publish`, {
    method: 'POST',
  });
}

export interface AudioResult {
  contentItemId: string;
  audioFilePath: string;
  durationSeconds: number;
  provider: string;
}

export async function generateAudio(contentId: string): Promise<AudioResult> {
  return apiFetch<AudioResult>(`/content/${contentId}/audio`, {
    method: 'POST',
  });
}

// Ledger APIs
export interface OwnerSettlement {
  ownerId: string;
  totalRevenueCents: number;
  voiceActorShareCents: number;
  creatorShareCents: number;
  platformShareCents: number;
  eventCount: number;
  events: {
    eventId: string;
    eventType: string;
    revenueCents: number;
    timestamp: string;
  }[];
}

export interface MonthlySettlement {
  month: string;
  generatedAt: string;
  owners: OwnerSettlement[];
  totals: {
    totalRevenueCents: number;
    totalVoiceActorShareCents: number;
    totalCreatorShareCents: number;
    totalPlatformShareCents: number;
    totalEventCount: number;
  };
}

export async function getSettlement(month: string): Promise<MonthlySettlement> {
  return apiFetch<MonthlySettlement>(`/ledger/settlement?month=${month}`);
}
