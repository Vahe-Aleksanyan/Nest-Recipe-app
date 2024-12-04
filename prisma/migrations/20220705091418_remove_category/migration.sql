/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Articles` table. All the data in the column will be lost.
  - You are about to drop the `Categories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Articles" DROP CONSTRAINT "Articles_categoryId_fkey";

-- AlterTable
ALTER TABLE "Articles" DROP COLUMN "categoryId",
ALTER COLUMN "likesNum" DROP NOT NULL;

-- DropTable
DROP TABLE "Categories";
