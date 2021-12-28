/*
  Warnings:

  - You are about to drop the column `mime` on the `Videos` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Videos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "file" TEXT NOT NULL
);
INSERT INTO "new_Videos" ("file", "id") SELECT "file", "id" FROM "Videos";
DROP TABLE "Videos";
ALTER TABLE "new_Videos" RENAME TO "Videos";
CREATE UNIQUE INDEX "Videos_file_key" ON "Videos"("file");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
