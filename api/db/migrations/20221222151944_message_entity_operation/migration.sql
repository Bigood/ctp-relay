/*
  Warnings:

  - Added the required column `entity` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `operation` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "entity" TEXT NOT NULL,
ADD COLUMN     "operation" TEXT NOT NULL,
ALTER COLUMN "payload" SET DATA TYPE TEXT;
