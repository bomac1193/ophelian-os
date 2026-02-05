# SLAYT Integration Guide

## Overview

Boveda integrates with SLAYT (Social Layer for Yield Transformation) to enable multi-platform social media publishing for character content. SLAYT is a separate microservice that handles platform-specific content adaptation and distribution.

## Architecture

```
┌─────────────┐         ┌──────────────┐         ┌───────────────────┐
│   Boveda    │────────▶│    SLAYT     │────────▶│  Social Platforms │
│   Studio    │         │  Microservice│         │ (Twitter/IG/TikTok)│
└─────────────┘         └──────────────┘         └───────────────────┘
     │                         │
     │                         │
  Character               Platform-specific
   Content                  Adaptation
```

**Boveda Responsibilities:**
- Character genome management
- Content creation
- Revenue tracking
- User interface

**SLAYT Responsibilities:**
- Platform authentication (Twitter, Instagram, TikTok)
- Content adaptation (character limits, hashtags, formatting)
- Post scheduling
- Publishing to social platforms
- Analytics tracking

## Gateway Endpoint

Boveda exposes a gateway endpoint at `/api/social/publish` that delegates to SLAYT.

### Location
`apps/studio/src/app/api/social/publish/route.ts`

### Request Format

```typescript
POST /api/social/publish

{
  "characterId": "char_123",
  "characterName": "Luna",
  "genome": {
    "visual": { /* visual signature data */ },
    "orisha": "Oshun",
    "sephira": "Netzach",
    "traits": ["creative", "empathetic"],
    "voice": { /* voice parameters */ }
  },
  "content": {
    "type": "story",
    "text": "Character story content...",
    "media": ["https://example.com/image.jpg"],
    "metadata": { /* additional data */ }
  },
  "platforms": ["TWITTER", "INSTAGRAM", "TIKTOK"],
  "settings": {
    "scheduleTime": "2024-01-15T10:00:00Z",
    "autoAdapt": true,
    "includeHashtags": true,
    "includeAttribution": true
  }
}
```

### Response Format

```typescript
// Success
{
  "success": true,
  "message": "Content published successfully",
  "slaytResponse": {
    "publishId": "pub_xyz",
    "platforms": {
      "TWITTER": { "postId": "123", "url": "https://twitter.com/..." },
      "INSTAGRAM": { "postId": "456", "url": "https://instagram.com/..." }
    }
  },
  "publishedTo": ["TWITTER", "INSTAGRAM"],
  "characterId": "char_123",
  "timestamp": "2024-01-15T10:00:00Z"
}

// Error - SLAYT not available
{
  "error": "SLAYT service not available",
  "message": "SLAYT is not running. Start SLAYT service to enable social publishing.",
  "instructions": "Run: cd /path/to/slayt && npm run dev",
  "payload": { /* original payload for manual processing */ }
}
```

## Environment Configuration

### Required Environment Variables

Add to `.env.local`:

```bash
# SLAYT Service Configuration
SLAYT_API_URL=http://localhost:3002
SLAYT_API_KEY=your-slayt-api-key

# Optional: Production SLAYT endpoint
# SLAYT_API_URL=https://slayt.yourdomain.com
```

### Default Values (Development)
- `SLAYT_API_URL`: `http://localhost:3002`
- `SLAYT_API_KEY`: `slayt-dev-key`

## SLAYT Service Requirements

SLAYT must implement the following endpoints:

### 1. Health Check
```
GET /health
Authorization: Bearer {SLAYT_API_KEY}

Response:
{
  "status": "healthy",
  "version": "1.0.0"
}
```

### 2. Publish Content
```
POST /api/publish
Authorization: Bearer {SLAYT_API_KEY}
X-Source: boveda

Request: (see Boveda payload format above)

Response:
{
  "publishId": "pub_xyz",
  "platforms": {
    "TWITTER": {
      "postId": "123",
      "url": "https://twitter.com/...",
      "adaptedContent": "Adapted tweet text...",
      "scheduled": false
    },
    "INSTAGRAM": {
      "postId": "456",
      "url": "https://instagram.com/...",
      "adaptedContent": "Adapted caption...",
      "scheduled": false
    }
  },
  "timestamp": "2024-01-15T10:00:00Z"
}
```

## Platform-Specific Adaptations

SLAYT handles these adaptations automatically:

### Twitter
- Character limit: 280 characters
- Thread creation for longer content
- Hashtag optimization (max 2-3)
- Media attachments (up to 4 images)

### Instagram
- Caption optimization (up to 2,200 characters)
- Hashtag strategy (up to 30)
- Image format/aspect ratio adjustment
- First comment for long captions

### TikTok
- Video script generation from text
- Caption optimization (150 characters)
- Trending sound recommendations
- Hashtag trends

## Implementation Steps

### Phase 1: Local Development Setup
1. Clone SLAYT repository to WSL
2. Configure SLAYT with development credentials
3. Start SLAYT service: `cd /path/to/slayt && npm run dev`
4. Verify health check: `curl http://localhost:3002/health`
5. Test Boveda → SLAYT integration

### Phase 2: Platform Authentication
1. Configure Twitter API credentials in SLAYT
2. Configure Instagram Graph API credentials in SLAYT
3. Configure TikTok API credentials in SLAYT
4. Test authentication flows

### Phase 3: Content Adaptation Logic
1. Implement platform-specific formatters in SLAYT
2. Add media processing (image resizing, video encoding)
3. Build hashtag generation based on character genome
4. Test cross-platform publishing

### Phase 4: Production Deployment
1. Deploy SLAYT as independent service
2. Configure production API keys
3. Update Boveda environment variables
4. Enable monitoring and logging

## Frontend Integration

Add social publishing button to character detail page:

```tsx
// apps/studio/src/app/imprint/[id]/page.tsx

const handlePublishToSocial = async () => {
  const response = await fetch('/api/social/publish', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      characterId: genome.id,
      characterName: genome.name,
      genome: {
        visual: genome.multiModalSignature?.visual,
        orisha: genome.personality?.orisha,
        sephira: genome.personality?.sephira,
        traits: genome.personality?.traits,
        voice: genome.voiceParameters,
      },
      content: {
        type: 'story',
        text: selectedStory.text,
        media: selectedStory.images,
      },
      platforms: ['TWITTER', 'INSTAGRAM', 'TIKTOK'],
      settings: {
        autoAdapt: true,
        includeHashtags: true,
        includeAttribution: true,
      },
    }),
  });

  const result = await response.json();
  if (result.success) {
    console.log('Published to:', result.publishedTo);
  }
};
```

## Error Handling

### SLAYT Unavailable
When SLAYT is not running, Boveda returns a 503 error with helpful instructions:

```json
{
  "error": "SLAYT service not available",
  "message": "SLAYT is not running. Start SLAYT service to enable social publishing.",
  "instructions": "Run: cd /path/to/slayt && npm run dev",
  "payload": { /* original payload */ }
}
```

The frontend should:
1. Show user-friendly error message
2. Provide link to SLAYT setup documentation
3. Optionally save payload for retry later

### Platform-Specific Failures
SLAYT may successfully publish to some platforms but fail on others:

```json
{
  "success": true,
  "partial": true,
  "platforms": {
    "TWITTER": { "status": "success", "postId": "123" },
    "INSTAGRAM": { "status": "failed", "error": "Auth token expired" }
  }
}
```

## Security Considerations

1. **API Key Management**: Store SLAYT_API_KEY in environment variables, never in code
2. **Request Validation**: SLAYT should validate all incoming requests
3. **Rate Limiting**: Implement rate limiting on both Boveda and SLAYT
4. **Content Moderation**: SLAYT should check content against platform policies
5. **User Authentication**: Verify user has permission to publish character content

## Monitoring and Analytics

SLAYT should track:
- Publish success/failure rates
- Platform-specific engagement metrics
- API response times
- Error patterns

Boveda should display:
- Total posts published per character
- Platform breakdown
- Engagement summaries (fetched from SLAYT)

## Future Enhancements

1. **Scheduled Publishing**: Calendar view for planning posts
2. **Analytics Dashboard**: Engagement metrics per character/platform
3. **A/B Testing**: Test different content adaptations
4. **Auto-Publishing**: Publish new content automatically based on rules
5. **Content Recommendations**: Suggest optimal posting times/platforms

## Testing

### Manual Testing
1. Start SLAYT: `cd /path/to/slayt && npm run dev`
2. Check health: `curl http://localhost:3002/health`
3. Test publish from Boveda UI
4. Verify content appears on social platforms

### Automated Testing
```typescript
// Test SLAYT integration
describe('SLAYT Integration', () => {
  it('should publish content when SLAYT is available', async () => {
    // Mock SLAYT response
    fetchMock.mockResponseOnce(JSON.stringify({
      publishId: 'pub_123',
      platforms: { TWITTER: { postId: '456' } }
    }));

    const response = await fetch('/api/social/publish', {
      method: 'POST',
      body: JSON.stringify(testPayload),
    });

    expect(response.ok).toBe(true);
  });

  it('should handle SLAYT unavailability gracefully', async () => {
    fetchMock.mockRejectOnce(new Error('Connection refused'));

    const response = await fetch('/api/social/publish', {
      method: 'POST',
      body: JSON.stringify(testPayload),
    });

    expect(response.status).toBe(503);
  });
});
```

## Support

For SLAYT-specific issues:
1. Check SLAYT service logs
2. Verify environment variables
3. Test health endpoint
4. Review SLAYT documentation

For Boveda integration issues:
1. Check Boveda API logs
2. Verify payload format
3. Test with SLAYT health check
4. Review this integration guide
