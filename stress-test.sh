#!/bin/bash
# Boveda Stress Test Script
API_URL="http://localhost:3002"
API_KEY="ophelian-dev-key-2026"
HEADERS="-H 'x-api-key: $API_KEY'"

echo "=== BOVEDA STRESS TEST ==="
echo "Testing API at: $API_URL"
echo

# Test 1: Characters
echo "1. Testing /characters endpoint..."
CHAR_RESULT=$(curl -s -H "x-api-key: $API_KEY" "$API_URL/characters")
CHAR_COUNT=$(echo "$CHAR_RESULT" | jq 'length' 2>/dev/null || echo "ERROR")
echo "  - Characters found: $CHAR_COUNT"
echo

# Test 2: Genomes
echo "2. Testing /genomes endpoint..."
GENOME_RESULT=$(curl -s -H "x-api-key: $API_KEY" "$API_URL/genomes" 2>&1)
GENOME_COUNT=$(echo "$GENOME_RESULT" | jq 'length' 2>/dev/null || echo "ERROR: $GENOME_RESULT")
echo "  - Genomes found: $GENOME_COUNT"
echo

# Test 3: Scenes
echo "3. Testing /scenes endpoint..."
SCENE_RESULT=$(curl -s -H "x-api-key: $API_KEY" "$API_URL/scenes" 2>&1)
SCENE_COUNT=$(echo "$SCENE_RESULT" | jq 'length' 2>/dev/null || echo "ERROR: $SCENE_RESULT")
echo "  - Scenes found: $SCENE_COUNT"
echo

# Test 4: Worlds/Globes
echo "4. Testing /worlds endpoint..."
WORLD_RESULT=$(curl -s -H "x-api-key: $API_KEY" "$API_URL/worlds" 2>&1)
WORLD_COUNT=$(echo "$WORLD_RESULT" | jq 'length' 2>/dev/null || echo "ERROR: $WORLD_RESULT")
echo "  - Worlds found: $WORLD_COUNT"
echo

# Test 5: Relationships
echo "5. Testing /relationships endpoint..."
REL_RESULT=$(curl -s -H "x-api-key: $API_KEY" "$API_URL/relationships" 2>&1)
REL_COUNT=$(echo "$REL_RESULT" | jq 'length' 2>/dev/null || echo "ERROR: $REL_RESULT")
echo "  - Relationships found: $REL_COUNT"
echo

# Test 6: Snapshots
echo "6. Testing /snapshots endpoint..."
SNAP_RESULT=$(curl -s -H "x-api-key: $API_KEY" "$API_URL/snapshots" 2>&1)
SNAP_COUNT=$(echo "$SNAP_RESULT" | jq 'length' 2>/dev/null || echo "ERROR: $SNAP_RESULT")
echo "  - Snapshots found: $SNAP_COUNT"
echo

# Test 7: Usage/Ledger
echo "7. Testing /ledger/events endpoint..."
LEDGER_RESULT=$(curl -s -H "x-api-key: $API_KEY" "$API_URL/ledger/events" 2>&1)
LEDGER_COUNT=$(echo "$LEDGER_RESULT" | jq 'length' 2>/dev/null || echo "ERROR: $LEDGER_RESULT")
echo "  - Usage events found: $LEDGER_COUNT"
echo

# Test 8: Voice Profiles
echo "8. Testing /voice-profiles endpoint..."
VOICE_RESULT=$(curl -s -H "x-api-key: $API_KEY" "$API_URL/voice-profiles" 2>&1)
VOICE_COUNT=$(echo "$VOICE_RESULT" | jq 'length' 2>/dev/null || echo "ERROR: $VOICE_RESULT")
echo "  - Voice profiles found: $VOICE_COUNT"
echo

# Test 9: Content
echo "9. Testing /content endpoint..."
CONTENT_RESULT=$(curl -s -H "x-api-key: $API_KEY" "$API_URL/content" 2>&1)
CONTENT_COUNT=$(echo "$CONTENT_RESULT" | jq 'length' 2>/dev/null || echo "ERROR: $CONTENT_RESULT")
echo "  - Content items found: $CONTENT_COUNT"
echo

# Test 10: Licenses
echo "10. Testing /licenses endpoint..."
LICENSE_RESULT=$(curl -s -H "x-api-key: $API_KEY" "$API_URL/licenses" 2>&1)
LICENSE_COUNT=$(echo "$LICENSE_RESULT" | jq 'length' 2>/dev/null || echo "ERROR: $LICENSE_RESULT")
echo "  - Licenses found: $LICENSE_COUNT"
echo

# Test 11: Generate new character (function test)
echo "11. Testing character generation..."
GEN_RESULT=$(curl -s -X POST -H "x-api-key: $API_KEY" -H "Content-Type: application/json" \
  -d '{"heritage":"random","mode":"random"}' \
  "$API_URL/generate/character" 2>&1)
GEN_NAME=$(echo "$GEN_RESULT" | jq -r '.name // "ERROR"' 2>/dev/null)
echo "  - Generated character: $GEN_NAME"
echo

# Test 12: Generate genome
echo "12. Testing genome generation..."
GGENOME_RESULT=$(curl -s -X POST -H "x-api-key: $API_KEY" -H "Content-Type: application/json" \
  "$API_URL/genomes/generate" 2>&1)
GGENOME_ID=$(echo "$GGENOME_RESULT" | jq -r '.orishaConfiguration.head.name // "ERROR"' 2>/dev/null)
echo "  - Generated genome with Orisha: $GGENOME_ID"
echo

echo "=== STRESS TEST COMPLETE ==="
