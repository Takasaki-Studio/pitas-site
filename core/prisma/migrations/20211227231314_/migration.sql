/*
  Warnings:

  - A unique constraint covering the columns `[file]` on the table `Videos` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Videos_file_key" ON "Videos"("file");
