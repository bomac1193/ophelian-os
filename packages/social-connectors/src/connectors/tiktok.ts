/**
 * TikTok Social Connector
 * Adapted from PostPilot project
 */
import { readFileSync } from 'node:fs';
import { Platform } from '@lcos/shared';
import { SocialConnector, PublishResult, PublishOptions, SocialConnectorConfig } from './base.js';

export interface TikTokConnectorConfig extends SocialConnectorConfig {
  /** TikTok client key (from developer portal) */
  clientKey?: string;
  /** TikTok client secret */
  clientSecret?: string;
  /** TikTok user's open_id */
  userId?: string;
  /** TikTok username for URL generation */
  username?: string;
}

export interface TikTokPublishOptions extends PublishOptions {
  /** Privacy level for the video */
  privacyLevel?: 'PUBLIC_TO_EVERYONE' | 'MUTUAL_FOLLOW_FRIENDS' | 'SELF_ONLY';
  /** Disable duets */
  disableDuet?: boolean;
  /** Disable comments */
  disableComment?: boolean;
  /** Disable stitch */
  disableStitch?: boolean;
  /** Video cover timestamp in milliseconds */
  coverTimestamp?: number;
  /** File size in bytes (required for upload) */
  fileSize?: number;
}

export class TikTokConnector extends SocialConnector {
  private userId?: string;
  private username?: string;
  private baseUrl = 'https://open.tiktokapis.com/v2';

  constructor(config: TikTokConnectorConfig = {}) {
    super(config);
    this.userId = config.userId;
    this.username = config.username;
  }

  get platform(): Platform {
    return Platform.TIKTOK;
  }

  isConfigured(): boolean {
    return !!(this.config.accessToken);
  }

  async publish(options: PublishOptions): Promise<PublishResult> {
    if (!this.isConfigured()) {
      return {
        success: false,
        url: null,
        error: 'TikTok connector not configured. Missing access token.',
        meta: {},
      };
    }

    // TikTok only supports video content
    if (!options.mediaPath) {
      return {
        success: false,
        url: null,
        error: 'TikTok requires video content for posts',
        meta: {},
      };
    }

    const ext = options.mediaPath.toLowerCase().split('.').pop();
    const videoExtensions = ['mp4', 'mov', 'webm'];
    if (!videoExtensions.includes(ext || '')) {
      return {
        success: false,
        url: null,
        error: 'TikTok only supports video formats (mp4, mov, webm)',
        meta: {},
      };
    }

    try {
      return await this.postVideo(options as TikTokPublishOptions);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        url: null,
        error: `TikTok posting failed: ${errorMessage}`,
        meta: {},
      };
    }
  }

  /**
   * Post a video to TikTok
   * Following PostPilot's upload flow
   */
  private async postVideo(options: TikTokPublishOptions): Promise<PublishResult> {
    const { text, mediaPath, privacyLevel, disableDuet, disableComment, disableStitch, coverTimestamp, fileSize } = options;

    if (!mediaPath) {
      throw new Error('Video path required for TikTok post');
    }

    // Read video file to get size if not provided
    let videoSize = fileSize;
    let videoBuffer: Buffer | null = null;

    if (!mediaPath.startsWith('http')) {
      videoBuffer = readFileSync(mediaPath);
      videoSize = videoBuffer.length;
    }

    // Step 1: Initialize video upload
    const initResponse = await fetch(
      `${this.baseUrl}/post/publish/video/init/`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          post_info: {
            title: text || '',
            privacy_level: privacyLevel || 'MUTUAL_FOLLOW_FRIENDS',
            disable_duet: disableDuet || false,
            disable_comment: disableComment || false,
            disable_stitch: disableStitch || false,
            video_cover_timestamp_ms: coverTimestamp || 1000,
          },
          source_info: {
            source: 'FILE_UPLOAD',
            video_size: videoSize || 0,
            chunk_size: 10000000, // 10MB chunks
            total_chunk_count: 1,
          },
        }),
      }
    );

    if (!initResponse.ok) {
      const error = await initResponse.text();
      throw new Error(`Failed to initialize upload: ${error}`);
    }

    const initData = (await initResponse.json()) as {
      data?: {
        publish_id?: string;
        upload_url?: string;
      };
      error?: { message?: string };
    };

    if (!initData.data?.publish_id || !initData.data?.upload_url) {
      throw new Error(initData.error?.message || 'Failed to get upload URL');
    }

    const publishId = initData.data.publish_id;
    const uploadUrl = initData.data.upload_url;

    // Step 2: Upload video file
    if (videoBuffer) {
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'video/mp4',
          'Content-Length': videoBuffer.length.toString(),
        },
        body: videoBuffer,
      });

      if (!uploadResponse.ok) {
        const error = await uploadResponse.text();
        throw new Error(`Failed to upload video: ${error}`);
      }
    } else {
      // For URL-based uploads, we'd need a different approach
      throw new Error('URL-based uploads not yet supported. Please provide a local file path.');
    }

    // Step 3: Poll for publish status
    let publishComplete = false;
    let attempts = 0;
    const maxAttempts = 30; // Max 2.5 minutes (30 * 5 seconds)

    while (!publishComplete && attempts < maxAttempts) {
      await this.sleep(5000); // Wait 5 seconds

      const statusResponse = await fetch(
        `${this.baseUrl}/post/publish/status/fetch/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json; charset=UTF-8',
          },
          body: JSON.stringify({
            publish_id: publishId,
          }),
        }
      );

      if (statusResponse.ok) {
        const statusData = (await statusResponse.json()) as {
          data?: {
            status?: string;
          };
        };

        const status = statusData.data?.status;
        if (status === 'PUBLISH_COMPLETE') {
          publishComplete = true;
        } else if (status === 'FAILED') {
          throw new Error('TikTok publish failed');
        }
      }

      attempts++;
    }

    if (!publishComplete) {
      throw new Error('TikTok publish timeout');
    }

    // Generate post URL
    const postUrl = this.username
      ? `https://www.tiktok.com/@${this.username}/video/${publishId}`
      : `https://www.tiktok.com/video/${publishId}`;

    return {
      success: true,
      url: postUrl,
      meta: {
        publishId,
        platform: 'tiktok',
        timestamp: new Date().toISOString(),
        privacyLevel: privacyLevel || 'MUTUAL_FOLLOW_FRIENDS',
      },
    };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Convenience function to publish to TikTok
 */
export async function publishToTikTok(
  options: TikTokPublishOptions,
  config: TikTokConnectorConfig
): Promise<PublishResult> {
  const connector = new TikTokConnector(config);
  return connector.publish(options);
}
