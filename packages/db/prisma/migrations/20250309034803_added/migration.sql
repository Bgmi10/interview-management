/*
  Warnings:

  - A unique constraint covering the columns `[candidateId,jobId]` on the table `JobApplication` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "JobApplication_candidateId_jobId_key" ON "JobApplication"("candidateId", "jobId");
