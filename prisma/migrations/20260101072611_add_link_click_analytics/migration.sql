-- CreateTable
CREATE TABLE "link_click" (
    "id" TEXT NOT NULL,
    "linkId" TEXT NOT NULL,
    "referrer" TEXT,
    "country" TEXT,
    "device" TEXT,
    "browser" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "clickedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "link_click_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "link_click_linkId_idx" ON "link_click"("linkId");

-- CreateIndex
CREATE INDEX "link_click_clickedAt_idx" ON "link_click"("clickedAt");

-- AddForeignKey
ALTER TABLE "link_click" ADD CONSTRAINT "link_click_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "link"("id") ON DELETE CASCADE ON UPDATE CASCADE;
