/*
  Warnings:

  - Added the required column `parentId` to the `chats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "parentId" TEXT NOT NULL;
