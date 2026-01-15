-- CreateEnum
CREATE TYPE "CollectionCategory" AS ENUM ('UI_LIBRARY', 'RESOURCES', 'SITES', 'TOOLS', 'OTHER');

-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('UP', 'DOWN');

-- CreateTable
CREATE TABLE "collection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" "CollectionCategory" NOT NULL DEFAULT 'OTHER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collection_link" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "icon" TEXT,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collection_link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collection_vote" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "voteType" "VoteType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "collection_vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "collection_userId_idx" ON "collection"("userId");

-- CreateIndex
CREATE INDEX "collection_category_idx" ON "collection"("category");

-- CreateIndex
CREATE INDEX "collection_createdAt_idx" ON "collection"("createdAt");

-- CreateIndex
CREATE INDEX "collection_link_collectionId_idx" ON "collection_link"("collectionId");

-- CreateIndex
CREATE INDEX "collection_vote_collectionId_idx" ON "collection_vote"("collectionId");

-- CreateIndex
CREATE INDEX "collection_vote_userId_idx" ON "collection_vote"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "collection_vote_collectionId_userId_key" ON "collection_vote"("collectionId", "userId");

-- AddForeignKey
ALTER TABLE "collection" ADD CONSTRAINT "collection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_link" ADD CONSTRAINT "collection_link_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_vote" ADD CONSTRAINT "collection_vote_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_vote" ADD CONSTRAINT "collection_vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
