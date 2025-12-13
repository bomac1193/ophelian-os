import { Platform } from '@lcos/shared';
import { SocialConnector, type PublishResult, type PublishOptions, type SocialConnectorConfig } from './base.js';

export class XConnector extends SocialConnector {
  constructor(config: SocialConnectorConfig = {}) {
    super(config);
  }

  get platform(): Platform {
    return Platform.X;
  }

  isConfigured(): boolean {
    // For MVP, we use a stub that doesn't require real credentials
    return true;
  }

  async publish(options: PublishOptions): Promise<PublishResult> {
    const { text } = options;

    // Validate text length
    if (text.length > 280) {
      return {
        success: false,
        url: null,
        error: 'Text exceeds 280 character limit for X',
        meta: { textLength: text.length },
      };
    }

    // Stub implementation - returns a fake URL
    // In production, this would use the X API
    const fakeId = Math.random().toString(36).substring(2, 15);
    const fakeUrl = `https://x.com/character/status/${fakeId}`;

    console.log(`[X Connector Stub] Would publish: "${text.slice(0, 50)}..."`);

    return {
      success: true,
      url: fakeUrl,
      meta: {
        stub: true,
        tweetId: fakeId,
        publishedAt: new Date().toISOString(),
        textLength: text.length,
      },
    };
  }
}

// Convenience function
export async function publishToX(options: PublishOptions): Promise<PublishResult> {
  const connector = new XConnector();
  return connector.publish(options);
}
