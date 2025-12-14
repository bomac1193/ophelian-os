import { Platform } from '@lcos/shared';
import { XConnector } from './connectors/x.js';
import { InstagramConnector, type InstagramConnectorConfig } from './connectors/instagram.js';
import { TikTokConnector, type TikTokConnectorConfig } from './connectors/tiktok.js';
import type { SocialConnector, PublishResult, PublishOptions, SocialConnectorConfig } from './connectors/base.js';

// Export connectors
export { XConnector, publishToX } from './connectors/x.js';
export { InstagramConnector, publishToInstagram, type InstagramConnectorConfig, type InstagramPublishOptions } from './connectors/instagram.js';
export { TikTokConnector, publishToTikTok, type TikTokConnectorConfig, type TikTokPublishOptions } from './connectors/tiktok.js';
export type { SocialConnector, PublishResult, PublishOptions, SocialConnectorConfig } from './connectors/base.js';

export interface SocialServiceConfig {
  x?: SocialConnectorConfig;
  instagram?: InstagramConnectorConfig;
  tiktok?: TikTokConnectorConfig;
}

export class SocialService {
  private connectors: Map<Platform, SocialConnector>;

  constructor(config: SocialServiceConfig = {}) {
    this.connectors = new Map();
    this.connectors.set(Platform.X, new XConnector(config.x));
    this.connectors.set(Platform.INSTAGRAM, new InstagramConnector(config.instagram));
    this.connectors.set(Platform.TIKTOK, new TikTokConnector(config.tiktok));
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

  /**
   * Publish to multiple platforms at once
   * Returns results for each platform
   */
  async publishToMultiple(
    platforms: Platform[],
    options: PublishOptions
  ): Promise<Map<Platform, PublishResult>> {
    const results = new Map<Platform, PublishResult>();

    await Promise.all(
      platforms.map(async (platform) => {
        const result = await this.publish(platform, options);
        results.set(platform, result);
      })
    );

    return results;
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

  /**
   * Get all platforms (configured or not)
   */
  getAllPlatforms(): Platform[] {
    return Array.from(this.connectors.keys());
  }
}
