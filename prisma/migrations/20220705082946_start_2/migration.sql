/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Articles` table. All the data in the column will be lost.
  - You are about to drop the `Categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Comments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Articles" DROP CONSTRAINT "Articles_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_articleId_fkey";

-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_userId_fkey";

-- AlterTable
ALTER TABLE "Articles" DROP COLUMN "categoryId";

-- DropTable
DROP TABLE "Categories";

-- DropTable
DROP TABLE "Comments";
