/*
  Warnings:

  - Added the required column `role` to the `User_info` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User_info" ADD COLUMN     "role" INTEGER NOT NULL;
