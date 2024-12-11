-- CreateEnum
CREATE TYPE "ERewardType" AS ENUM ('PHYSICAL_GOOD', 'VOUCHER');

-- CreateEnum
CREATE TYPE "EShippingStatus" AS ENUM ('WAITING_APPROVAL', 'PROCESSED', 'DELIVERED', 'RECEIVED');

-- CreateEnum
CREATE TYPE "ERole" AS ENUM ('CUSTOMER', 'MERCHANT', 'CASHIER');

-- CreateEnum
CREATE TYPE "EPointType" AS ENUM ('BY_PRICE', 'BY_MENU');

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "ERole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Merchant" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "businessName" TEXT NOT NULL,
    "businessEmail" TEXT NOT NULL,
    "businessPhoneNumber" TEXT NOT NULL,
    "businessField" TEXT NOT NULL,
    "businessAddress" TEXT NOT NULL,
    "provinceId" INTEGER NOT NULL,
    "regencyId" INTEGER NOT NULL,
    "districtId" INTEGER NOT NULL,
    "villageId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Merchant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "address" TEXT,
    "points" INTEGER NOT NULL DEFAULT 0,
    "provinceId" INTEGER NOT NULL,
    "regencyId" INTEGER NOT NULL,
    "districtId" INTEGER NOT NULL,
    "villageId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cashier" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "belongToMerchantId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cashier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerOnMerchant" (
    "id" SERIAL NOT NULL,
    "merchantId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerOnMerchant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PointExchange" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "merchantId" INTEGER NOT NULL,
    "cashierId" INTEGER NOT NULL,
    "customerId" INTEGER,
    "totalClaimPoint" INTEGER NOT NULL,
    "claimedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PointExchange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PointCatalogue" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "termAndCondition" TEXT NOT NULL,
    "point" INTEGER NOT NULL,
    "pointType" "EPointType" NOT NULL,
    "merchantId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PointCatalogue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PointCatalogueOnPointExchange" (
    "id" SERIAL NOT NULL,
    "pointExchangeId" INTEGER NOT NULL,
    "pointCatalogueId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PointCatalogueOnPointExchange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RewardExchange" (
    "id" SERIAL NOT NULL,
    "merchantId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "status" "EShippingStatus" NOT NULL,
    "waitingApprovalAt" TIMESTAMP(3),
    "processedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "arrivedAt" TIMESTAMP(3),
    "receivedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rewardCatalogueId" INTEGER NOT NULL,

    CONSTRAINT "RewardExchange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RewardCatalogue" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "termAndCondition" TEXT NOT NULL,
    "pricePoint" INTEGER NOT NULL,
    "rewardType" "ERewardType" NOT NULL,
    "merchantId" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL,
    "maxDailyRedeem" INTEGER NOT NULL,
    "maxMonthlyRedeem" INTEGER NOT NULL,
    "viewOrder" INTEGER NOT NULL,
    "periodeStart" TIMESTAMP(3) NOT NULL,
    "periodeEnd" TIMESTAMP(3) NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RewardCatalogue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Province" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "altName" TEXT,
    "latitude" TEXT,
    "longitude" TEXT,

    CONSTRAINT "Province_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Regency" (
    "id" SERIAL NOT NULL,
    "provinceId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "altName" TEXT,
    "latitude" TEXT,
    "longitude" TEXT,

    CONSTRAINT "Regency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "District" (
    "id" SERIAL NOT NULL,
    "regencyId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "altName" TEXT,
    "latitude" TEXT,
    "longitude" TEXT,

    CONSTRAINT "District_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Village" (
    "id" SERIAL NOT NULL,
    "districtId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "altName" TEXT,
    "latitude" TEXT,
    "longitude" TEXT,

    CONSTRAINT "Village_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_username_key" ON "Account"("username");

-- CreateIndex
CREATE UNIQUE INDEX "PointExchange_uuid_key" ON "PointExchange"("uuid");

-- AddForeignKey
ALTER TABLE "Merchant" ADD CONSTRAINT "Merchant_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cashier" ADD CONSTRAINT "Cashier_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cashier" ADD CONSTRAINT "Cashier_belongToMerchantId_fkey" FOREIGN KEY ("belongToMerchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerOnMerchant" ADD CONSTRAINT "CustomerOnMerchant_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerOnMerchant" ADD CONSTRAINT "CustomerOnMerchant_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointExchange" ADD CONSTRAINT "PointExchange_cashierId_fkey" FOREIGN KEY ("cashierId") REFERENCES "Cashier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointExchange" ADD CONSTRAINT "PointExchange_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointExchange" ADD CONSTRAINT "PointExchange_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointCatalogue" ADD CONSTRAINT "PointCatalogue_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointCatalogueOnPointExchange" ADD CONSTRAINT "fk_point_catalogue" FOREIGN KEY ("pointCatalogueId") REFERENCES "PointCatalogue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointCatalogueOnPointExchange" ADD CONSTRAINT "fk_point_exchange" FOREIGN KEY ("pointExchangeId") REFERENCES "PointExchange"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardExchange" ADD CONSTRAINT "RewardExchange_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardExchange" ADD CONSTRAINT "RewardExchange_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardExchange" ADD CONSTRAINT "RewardExchange_rewardCatalogueId_fkey" FOREIGN KEY ("rewardCatalogueId") REFERENCES "RewardCatalogue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardCatalogue" ADD CONSTRAINT "RewardCatalogue_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Regency" ADD CONSTRAINT "Regency_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "Province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "District" ADD CONSTRAINT "District_regencyId_fkey" FOREIGN KEY ("regencyId") REFERENCES "Regency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Village" ADD CONSTRAINT "Village_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
