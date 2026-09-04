-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "shippingAddress" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "productBrand" TEXT NOT NULL,
    "variantColor" TEXT NOT NULL,
    "variantStorage" TEXT NOT NULL,
    "variantImageUrl" TEXT NOT NULL,
    "productPrice" INTEGER NOT NULL,
    "productMrp" INTEGER NOT NULL,
    "emiTenure" INTEGER NOT NULL,
    "emiMonthlyAmount" INTEGER NOT NULL,
    "emiInterestRate" DOUBLE PRECISION NOT NULL,
    "emiTotalAmount" INTEGER NOT NULL,
    "emiCashback" INTEGER NOT NULL DEFAULT 0,
    "emiIsNoCost" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");
