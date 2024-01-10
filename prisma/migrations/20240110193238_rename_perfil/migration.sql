/*
  Warnings:

  - You are about to drop the column `pefil` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `pefil`,
    ADD COLUMN `perfil` INTEGER NOT NULL DEFAULT 1;
