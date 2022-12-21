/*
  Warnings:

  - A unique constraint covering the columns `[host]` on the table `Instance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[token]` on the table `Instance` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Instance_host_key" ON "Instance"("host");

-- CreateIndex
CREATE UNIQUE INDEX "Instance_token_key" ON "Instance"("token");
