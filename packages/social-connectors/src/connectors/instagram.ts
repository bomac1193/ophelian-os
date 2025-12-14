/**
 * Instagram Social Connector
 * Adapted from PostPilot project
 */
import { Platform } from '@lcos/shared';
import { SocialConnector, PublishResult, PublishOptions, SocialConnectorConfig } from './base.js';

export interface InstagramConnectorConfig extends SocialConnectorConfig {
  /** Instagram user ID from OAuth */
  userId?: string;
}

export interface InstagramPublishOptions extends PublishOptions {
  /** Media type for Instagram posting */
  mediaType?: 'image' | 'video' | 'carousel';
  /** Alt text for accessibility */
  altText?: string;
}

export class InstagramConnector extends SocialConnector {
  private userId?: string;
  private baseUrl = 'https://graph.instagram.com/v18.0';

  constructor(config: InstagramConnectorConfig = {}) {
    super(config);
    this.userId = config.userId;
  }

  get platform(): Platform {
    return Platform.INSTAGRAM;
  }

  isConfigured(): boolean {
    return !!(this.config.accessToken && this.userId);
  }

  async publish(options: PublishOptions): Promise<PublishResult> {
    if (!this.isConfigured()) {
      return {
        success: false,
        url: null,
        error: 'Instagram connector not configured. Missing access token or user ID.',
        meta: {},
      };
    }

    try {
      // Determine media type
      const mediaType = this.detectMediaType(options.mediaPath);

      if (mediaType === 'image') {
        return await this.postImage(options);
      } else if (mediaType === 'video') {
        return await this.postVideo(options);
      } else {
        // Text-only post (Instagram doesn't support this natively)
        return {
          success: false,
          url: null,
          error: 'Instagram requires media (image or video) for posts',
          meta: {},
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        url: null,
        error: `Instagram posting failed: ${errorMessage}`,
        meta: {},
      };
    }
  }

  /**
   * Post an image to Instagram
   * Following PostPilot's two-step process
   */
  private async postImage(options: PublishOptions): Promise<PublishResult> {
    const { text, mediaPath } = options;

    if (!mediaPath) {
      return {
        success: false,
        url: null,
        error: 'Media path required for Instagram image post',
        meta: {},
      };
    }

    // Step 1: Create media container
    const containerResponse = await fetch(
      `${this.baseUrl}/${this.userId}/media`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: this.getPublicMediaUrl(mediaPath),
          caption: text || '',
          access_token: this.config.accessToken,
        }),
      }
    );

    if (!containerResponse.ok) {
      const error = await containerResponse.text();
      throw new Error(`Failed to create media container: ${error}`);
    }

    const containerData = (await containerResponse.json()) as { id: string };
    const creationId = containerData.id;

    // Step 2: Publish the media container
    const publishResponse = await fetch(
      `${this.baseUrl}/${this.userId}/media_publish`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creation_id: creationId,
          access_token: this.config.accessToken,
        }),
      }
    );

    if (!publishResponse.ok) {
      const error = await publishResponse.text();
      throw new Error(`Failed to publish media: ${error}`);
    }

    const publishData = (await publishResponse.json()) as { id: string };
    const postId = publishData.id;

    // Step 3: Get permalink
    const permalinkResponse = await fetch(
      `${this.baseUrl}/${postId}?fields=permalink&access_token=${this.config.accessToken}`
    );

    let permalink = `https://www.instagram.com/p/${postId}`;
    if (permalinkResponse.ok) {
      const permalinkData = (await permalinkResponse.json()) as { permalink?: string };
      permalink = permalinkData.permalink || permalink;
    }

    return {
      success: true,
      url: permalink,
      meta: {
        postId,
        creationId,
        platform: 'instagram',
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Post a video to Instagram
   * Following PostPilot's video posting flow with polling
   */
  private async postVideo(options: PublishOptions): Promise<PublishResult> {
    const { text, mediaPath } = options;

    if (!mediaPath) {
      return {
        success: false,
        url: null,
        error: 'Media path required for Instagram video post',
        meta: {},
      };
    }

    // Step 1: Create video container
    const containerResponse = await fetch(
      `${this.baseUrl}/${this.userId}/media`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          media_type: 'VIDEO',
          video_url: this.getPublicMediaUrl(mediaPath),
          caption: text || '',
          access_token: this.config.accessToken,
        }),
      }
    );

    if (!containerResponse.ok) {
      const error = await containerResponse.text();
      throw new Error(`Failed to create video container: ${error}`);
    }

    const containerData = (await containerResponse.json()) as { id: string };
    const creationId = containerData.id;

    // Step 2: Poll for video processing completion
    let isReady = false;
    let attempts = 0;
    const maxAttempts = 20; // Max 2 minutes (20 * 6 seconds)

    while (!isReady && attempts < maxAttempts) {
      await this.sleep(6000); // Wait 6 seconds

      const statusResponse = await fetch(
        `${this.baseUrl}/${creationId}?fields=status_code&access_token=${this.config.accessToken}`
      );

      if (statusResponse.ok) {
        const statusData = (await statusResponse.json()) as { status_code?: string };
        if (statusData.status_code === 'FINISHED') {
          isReady = true;
        } else if (statusData.status_code === 'ERROR') {
          throw new Error('Video processing failed');
        }
      }

      attempts++;
    }

    if (!isReady) {
      throw new Error('Video processing timeout');
    }

    // Step 3: Publish the video
    const publishResponse = await fetch(
      `${this.baseUrl}/${this.userId}/media_publish`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creation_id: creationId,
          access_token: this.config.accessToken,
        }),
      }
    );

    if (!publishResponse.ok) {
      const error = await publishResponse.text();
      throw new Error(`Failed to publish video: ${error}`);
    }

    const publishData = (await publishResponse.json()) as { id: string };
    const postId = publishData.id;

    // Step 4: Get permalink
    const permalinkResponse = await fetch(
      `${this.baseUrl}/${postId}?fields=permalink&access_token=${this.config.accessToken}`
    );

    let permalink = `https://www.instagram.com/p/${postId}`;
    if (permalinkResponse.ok) {
      const permalinkData = (await permalinkResponse.json()) as { permalink?: string };
      permalink = permalinkData.permalink || permalink;
    }

    return {
      success: true,
      url: permalink,
      meta: {
        postId,
        creationId,
        platform: 'instagram',
        mediaType: 'video',
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Detect media type from file path
   */
  private detectMediaType(mediaPath?: string): 'image' | 'video' | 'text' {
    if (!mediaPath) return 'text';

    const ext = mediaPath.toLowerCase().split('.').pop();
    const videoExtensions = ['mp4', 'mov', 'avi', 'webm', 'mkv'];
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    if (videoExtensions.includes(ext || '')) return 'video';
    if (imageExtensions.includes(ext || '')) return 'image';
    return 'text';
  }

  /**
   * Get public URL for media (Instagram requires publicly accessible URLs)
   */
  private getPublicMediaUrl(mediaPath: string): string {
    if (mediaPath.startsWith('http://') || mediaPath.startsWith('https://')) {
      return mediaPath;
    }
    // In production, this would upload to a CDN and return the URL
    // For now, return as-is (requires external URL configuration)
    return mediaPath;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Convenience function to publish to Instagram
 */
export async function publishToInstagram(
  options: PublishOptions,
  config: InstagramConnectorConfig
): Promise<PublishResult> {
  const connector = new InstagramConnector(config);
  return connector.publish(options);
}
