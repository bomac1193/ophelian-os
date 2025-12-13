import type { Platform } from '@lcos/shared';

export interface PublishResult {
  success: boolean;
  url: string | null;
  error?: string;
  meta: Record<string, unknown>;
}

export interface PublishOptions {
  text: string;
  mediaPath?: string;
}

export interface SocialConnectorConfig {
  apiKey?: string;
  apiSecret?: string;
  accessToken?: string;
  accessTokenSecret?: string;
}

export abstract class SocialConnector {
  protected config: SocialConnectorConfig;

  constructor(config: SocialConnectorConfig) {
    this.config = config;
  }

  abstract get platform(): Platform;
  abstract publish(options: PublishOptions): Promise<PublishResult>;
  abstract isConfigured(): boolean;
}
