-- CreateEnum
CREATE TYPE "IssuerStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "CredentialStatus" AS ENUM ('ACTIVE', 'REVOKED', 'EXPIRED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ISSUER', 'STUDENT');

-- CreateTable
CREATE TABLE "Issuer" (
    "id" TEXT NOT NULL,
    "orgName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "status" "IssuerStatus" NOT NULL DEFAULT 'PENDING',
    "issuerPublicKey" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Issuer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "enrollment" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Credential" (
    "id" TEXT NOT NULL,
    "credentialId" TEXT NOT NULL,
    "cid" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT,
    "status" "CredentialStatus" NOT NULL DEFAULT 'ACTIVE',
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "issuerId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Credential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Revocation" (
    "id" TEXT NOT NULL,
    "cid" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "revokedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "credentialId" TEXT NOT NULL,

    CONSTRAINT "Revocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DomainWhitelist" (
    "id" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DomainWhitelist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "actorIssuerId" TEXT,
    "actorStudentId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Issuer_email_key" ON "Issuer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_enrollment_key" ON "Student"("enrollment");

-- CreateIndex
CREATE UNIQUE INDEX "Student_walletId_key" ON "Student"("walletId");

-- CreateIndex
CREATE UNIQUE INDEX "Credential_credentialId_key" ON "Credential"("credentialId");

-- CreateIndex
CREATE UNIQUE INDEX "Credential_cid_key" ON "Credential"("cid");

-- CreateIndex
CREATE INDEX "Credential_issuerId_idx" ON "Credential"("issuerId");

-- CreateIndex
CREATE INDEX "Credential_studentId_idx" ON "Credential"("studentId");

-- CreateIndex
CREATE INDEX "Credential_cid_idx" ON "Credential"("cid");

-- CreateIndex
CREATE UNIQUE INDEX "Revocation_cid_key" ON "Revocation"("cid");

-- CreateIndex
CREATE UNIQUE INDEX "Revocation_credentialId_key" ON "Revocation"("credentialId");

-- CreateIndex
CREATE UNIQUE INDEX "DomainWhitelist_domain_key" ON "DomainWhitelist"("domain");

-- CreateIndex
CREATE INDEX "AuditLog_actorIssuerId_idx" ON "AuditLog"("actorIssuerId");

-- CreateIndex
CREATE INDEX "AuditLog_actorStudentId_idx" ON "AuditLog"("actorStudentId");

-- AddForeignKey
ALTER TABLE "Credential" ADD CONSTRAINT "Credential_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "Issuer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Credential" ADD CONSTRAINT "Credential_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Revocation" ADD CONSTRAINT "Revocation_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "Credential"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorIssuerId_fkey" FOREIGN KEY ("actorIssuerId") REFERENCES "Issuer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorStudentId_fkey" FOREIGN KEY ("actorStudentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
