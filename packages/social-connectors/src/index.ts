import { Platform } from '@lcos/shared';
import { XConnector } from './connectors/x.js';
import type { SocialConnector, PublishResult, PublishOptions, SocialConnectorConfig } from './connectors/base.js';

export { XConnector, publishToX } from './connectors/x.js';
export type { SocialConnector, PublishResult, PublishOptions, SocialConnectorConfig } from './connectors/base.js';

export interface SocialServiceConfig {
  x?: SocialConnectorConfig;
  // Future: tiktok, instagram
}

export class SocialService {
  private connectors: Map<Platform, SocialConnector>;

  constructor(config: SocialServiceConfig = {}) {
    this.connectors = new Map();
    this.connectors.set(Platform.X, new XConnector(config.x));
    // Future: Add TikTok, Instagram connectors
  }

  getConnector(platform: Platform): SocialConnector | undefined {
    return this.connectors.get(platform);
  }

  async publish(platform: Platform, options: PublishOptions): Promise<PublishResult> {
    const connector = this.getConnector(platform);

    if (!connector) {
      return {
        success: false,
        url: null,
        error: `No connector available for platform: ${platform}`,
        meta: {},
      };
    }

    if (!connector.isConfigured()) {
      return {
        success: false,
        url: null,
        error: `Connector for ${platform} is not configured`,
        meta: {},
      };
    }

    return connector.publish(options);
  }

  getAvailablePlatforms(): Platform[] {
    const platforms: Platform[] = [];
    for (const [platform, connector] of this.connectors) {
      if (connector.isConfigured()) {
        platforms.push(platform);
      }
    }
    return platforms;
  }
}
