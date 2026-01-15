-- AlterTable
ALTER TABLE "link_click" ADD COLUMN     "sessionFingerprint" TEXT,
ADD COLUMN     "idempotencyKey" TEXT,
ADD COLUMN     "isBot" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "link_click_idempotencyKey_key" ON "link_click"("idempotencyKey");

-- CreateIndex
CREATE INDEX "link_click_sessionFingerprint_idx" ON "link_click"("sessionFingerprint");

-- CreateIndex
CREATE INDEX "link_click_idempotencyKey_idx" ON "link_click"("idempotencyKey");

