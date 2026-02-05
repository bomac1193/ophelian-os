#!/bin/bash

# Genome Sync Stress Test Script
# Tests genome creation, linking, and display for all characters

set -e

API_URL="${API_URL:-http://localhost:3001}"
API_KEY="${API_KEY:-ophelian-dev-key-2026}"
COLORS=true

# Color codes
if [ "$COLORS" = true ]; then
  RED='\033[0;31m'
  GREEN='\033[0;32m'
  YELLOW='\033[1;33m'
  BLUE='\033[0;34m'
  PURPLE='\033[0;35m'
  CYAN='\033[0;36m'
  NC='\033[0m' # No Color
else
  RED=''
  GREEN=''
  YELLOW=''
  BLUE=''
  PURPLE=''
  CYAN=''
  NC=''
fi

echo -e "${CYAN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║        GENOME SYNC STRESS TEST - BOVEDA PROJECT          ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Helper function for API calls
api_call() {
  curl -s -H "x-api-key: $API_KEY" "$@"
}

# Test 1: Check initial state
echo -e "${BLUE}[TEST 1]${NC} Checking initial state..."
CHAR_COUNT=$(api_call "$API_URL/characters" | jq 'length')
GENOME_COUNT=$(api_call "$API_URL/genomes" | jq 'length')
echo -e "  Characters: ${YELLOW}$CHAR_COUNT${NC}"
echo -e "  Genomes: ${YELLOW}$GENOME_COUNT${NC}"

# Identify relics vs regular characters
RELICS=$(api_call "$API_URL/characters" | jq '[.[] | select(.timelineState.oripheon.generated.relics != null and (.timelineState.oripheon.generated.relics | length) > 0)] | length')
REGULAR=$((CHAR_COUNT - RELICS))
echo -e "  Regular Characters: ${GREEN}$REGULAR${NC}"
echo -e "  Relics: ${PURPLE}$RELICS${NC}"
echo ""

# Test 2: Sync all genomes
echo -e "${BLUE}[TEST 2]${NC} Running genome sync for all characters..."
SYNC_RESULT=$(api_call -X POST "$API_URL/genomes/sync-all" -H "Content-Type: application/json" -d '{}')
echo "$SYNC_RESULT" | jq '.'

GENERATED=$(echo "$SYNC_RESULT" | jq '.summary.generated')
ALREADY_EXISTS=$(echo "$SYNC_RESULT" | jq '.summary.alreadyExists')
ERRORS=$(echo "$SYNC_RESULT" | jq '.summary.errors')

echo ""
echo -e "${GREEN}✓${NC} Genomes Generated: $GENERATED"
echo -e "${YELLOW}⊙${NC} Already Existed: $ALREADY_EXISTS"
if [ "$ERRORS" -gt 0 ]; then
  echo -e "${RED}✗${NC} Errors: $ERRORS"
  echo "$SYNC_RESULT" | jq '.results[] | select(.status == "error")'
else
  echo -e "${GREEN}✓${NC} Errors: 0"
fi
echo ""

# Test 3: Verify all characters have genomes
echo -e "${BLUE}[TEST 3]${NC} Verifying all characters have linked genomes..."
NEW_GENOME_COUNT=$(api_call "$API_URL/genomes" | jq 'length')
LINKED_COUNT=$(api_call "$API_URL/genomes" | jq '[.[] | select(.characterId != null)] | length')

echo -e "  Total Genomes: ${YELLOW}$NEW_GENOME_COUNT${NC}"
echo -e "  Linked to Characters: ${GREEN}$LINKED_COUNT${NC}"

if [ "$LINKED_COUNT" -eq "$CHAR_COUNT" ]; then
  echo -e "${GREEN}✓ SUCCESS${NC}: All $CHAR_COUNT characters have genomes!"
else
  echo -e "${RED}✗ FAIL${NC}: Expected $CHAR_COUNT linked genomes, got $LINKED_COUNT"

  # Show which characters are missing genomes
  echo ""
  echo "Characters without genomes:"
  CHARS_WITH_GENOMES=$(api_call "$API_URL/genomes" | jq -r '[.[] | select(.characterId != null) | .characterId] | join(",")')
  api_call "$API_URL/characters" | jq -r --arg linked "$CHARS_WITH_GENOMES" '.[] | select([.id] | inside($linked | split(",")) | not) | "  - \(.name) (\(.id))"'
fi
echo ""

# Test 4: Verify relics have genomes
echo -e "${BLUE}[TEST 4]${NC} Verifying relics have genomes..."
RELIC_CHARS=$(api_call "$API_URL/characters" | jq -r '[.[] | select(.timelineState.oripheon.generated.relics != null and (.timelineState.oripheon.generated.relics | length) > 0) | .id]')
RELIC_COUNT=$(echo "$RELIC_CHARS" | jq 'length')

RELIC_WITH_GENOMES=0
for CHAR_ID in $(echo "$RELIC_CHARS" | jq -r '.[]'); do
  HAS_GENOME=$(api_call "$API_URL/genomes" | jq --arg id "$CHAR_ID" '[.[] | select(.characterId == $id)] | length')
  if [ "$HAS_GENOME" -gt 0 ]; then
    RELIC_WITH_GENOMES=$((RELIC_WITH_GENOMES + 1))
  fi
done

echo -e "  Relics with genomes: ${GREEN}$RELIC_WITH_GENOMES${NC} / $RELIC_COUNT"

if [ "$RELIC_WITH_GENOMES" -eq "$RELIC_COUNT" ]; then
  echo -e "${GREEN}✓ SUCCESS${NC}: All relics have genomes!"
else
  echo -e "${YELLOW}⚠ WARNING${NC}: Some relics don't have genomes"
fi
echo ""

# Test 5: Test progressive disclosure for a sample
echo -e "${BLUE}[TEST 5]${NC} Testing progressive disclosure display..."
SAMPLE_GENOME=$(api_call "$API_URL/genomes" | jq -r '.[0] | .id')

if [ -n "$SAMPLE_GENOME" ] && [ "$SAMPLE_GENOME" != "null" ]; then
  echo "  Sample Genome ID: $SAMPLE_GENOME"

  # Import getSurfaceView simulation (simplified)
  GENOME_DATA=$(api_call "$API_URL/genomes/$SAMPLE_GENOME")

  ORISHA=$(echo "$GENOME_DATA" | jq -r '.orishaConfiguration.headOrisha')
  SEPHIRA=$(echo "$GENOME_DATA" | jq -r '.kabbalisticPosition.primarySephira')
  TRAJECTORY=$(echo "$GENOME_DATA" | jq -r '.psychologicalState.trajectory')

  echo -e "  ${PURPLE}Surface View:${NC}"
  echo -e "    Orisha: $ORISHA"
  echo -e "    Sephira: $SEPHIRA"
  echo -e "    Trajectory: $TRAJECTORY"
  echo -e "${GREEN}✓${NC} Progressive disclosure data accessible"
else
  echo -e "${RED}✗${NC} No genomes available for testing"
fi
echo ""

# Test 6: Performance metrics
echo -e "${BLUE}[TEST 6]${NC} Performance metrics..."
START_TIME=$(date +%s%3N)
api_call "$API_URL/genomes" > /dev/null
END_TIME=$(date +%s%3N)
RESPONSE_TIME=$((END_TIME - START_TIME))

echo -e "  Genome list endpoint response: ${YELLOW}${RESPONSE_TIME}ms${NC}"

if [ "$RESPONSE_TIME" -lt 1000 ]; then
  echo -e "${GREEN}✓${NC} Response time acceptable (< 1s)"
else
  echo -e "${YELLOW}⚠${NC} Response time slow (> 1s)"
fi
echo ""

# Summary
echo -e "${CYAN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                    TEST SUMMARY                          ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "Total Characters: $CHAR_COUNT"
echo -e "  - Regular: $REGULAR"
echo -e "  - Relics: $RELICS"
echo ""
echo -e "Total Genomes: $NEW_GENOME_COUNT"
echo -e "  - Linked: $LINKED_COUNT"
echo -e "  - Unlinked: $((NEW_GENOME_COUNT - LINKED_COUNT))"
echo ""

if [ "$LINKED_COUNT" -eq "$CHAR_COUNT" ] && [ "$ERRORS" -eq 0 ]; then
  echo -e "${GREEN}╔════════════════════════════════╗${NC}"
  echo -e "${GREEN}║   ALL TESTS PASSED ✓           ║${NC}"
  echo -e "${GREEN}╚════════════════════════════════╝${NC}"
  exit 0
else
  echo -e "${YELLOW}╔════════════════════════════════╗${NC}"
  echo -e "${YELLOW}║   SOME TESTS FAILED ⚠          ║${NC}"
  echo -e "${YELLOW}╚════════════════════════════════╝${NC}"
  exit 1
fi
