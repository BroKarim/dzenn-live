-- AlterTable
ALTER TABLE "link_click" ADD COLUMN     "operatingSystem" TEXT,
ADD COLUMN     "utmCampaign" TEXT,
ADD COLUMN     "utmContent" TEXT,
ADD COLUMN     "utmMedium" TEXT,
ADD COLUMN     "utmSource" TEXT,
ADD COLUMN     "utmTerm" TEXT;

-- CreateIndex
CREATE INDEX "link_click_utmSource_idx" ON "link_click"("utmSource");

-- CreateIndex
CREATE INDEX "link_click_utmMedium_idx" ON "link_click"("utmMedium");

-- CreateIndex
CREATE INDEX "link_click_utmCampaign_idx" ON "link_click"("utmCampaign");
