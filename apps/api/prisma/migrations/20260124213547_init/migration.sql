-- CreateEnum
CREATE TYPE "RelationshipTypeEnum" AS ENUM ('ALLY', 'ENEMY', 'MENTOR', 'FAMILY', 'RIVAL', 'FRIEND', 'LOVER', 'CUSTOM');

-- CreateTable
CREATE TABLE "CharacterPosition" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "x" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "y" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "CharacterPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CharacterRelationship" (
    "id" TEXT NOT NULL,
    "sourceCharacterId" TEXT NOT NULL,
    "targetCharacterId" TEXT NOT NULL,
    "relationshipType" "RelationshipTypeEnum" NOT NULL DEFAULT 'CUSTOM',
    "customTypeName" TEXT,
    "sourceRole" TEXT,
    "targetRole" TEXT,
    "lore" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CharacterRelationship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CharacterPosition_characterId_key" ON "CharacterPosition"("characterId");

-- CreateIndex
CREATE UNIQUE INDEX "CharacterRelationship_sourceCharacterId_targetCharacterId_key" ON "CharacterRelationship"("sourceCharacterId", "targetCharacterId");

-- AddForeignKey
ALTER TABLE "CharacterPosition" ADD CONSTRAINT "CharacterPosition_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
