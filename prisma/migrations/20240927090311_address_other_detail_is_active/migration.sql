-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "otherDetail" DROP NOT NULL;
