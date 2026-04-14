-- CreateTable
CREATE TABLE "SiteAnalytics" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "visitors" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteAnalytics_pkey" PRIMARY KEY ("id")
);
