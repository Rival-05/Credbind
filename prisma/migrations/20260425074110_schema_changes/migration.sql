/*
  Warnings:

  - You are about to drop the column `payload` on the `Credential` table. All the data in the column will be lost.
  - You are about to drop the column `issuerPublicKey` on the `Issuer` table. All the data in the column will be lost.
  - You are about to drop the column `publicKey` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the `VerificationChallenge` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `payloadHash` to the `Credential` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "VerificationChallenge" DROP CONSTRAINT "VerificationChallenge_studentId_fkey";

-- AlterTable
ALTER TABLE "Credential" DROP COLUMN "payload",
ADD COLUMN     "payloadHash" VARCHAR(64) NOT NULL,
ADD COLUMN     "suspendedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Issuer" DROP COLUMN "issuerPublicKey";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "publicKey";

-- DropTable
DROP TABLE "VerificationChallenge";

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "Credential_status_idx" ON "Credential"("status");

-- CreateIndex
CREATE INDEX "Credential_credentialId_idx" ON "Credential"("credentialId");
