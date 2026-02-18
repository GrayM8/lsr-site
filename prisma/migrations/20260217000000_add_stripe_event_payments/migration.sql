-- AlterEnum: Add EVENT_FEE to ProductType
ALTER TYPE "ProductType" ADD VALUE 'EVENT_FEE';

-- AlterTable: Add registrationFeeCents to Event
ALTER TABLE "Event" ADD COLUMN "registrationFeeCents" INTEGER;

-- AlterTable: Make Payment.productId nullable
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_productId_fkey";
ALTER TABLE "Payment" ALTER COLUMN "productId" DROP NOT NULL;
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable: Add sourcePaymentId to EventRegistration
ALTER TABLE "EventRegistration" ADD COLUMN "sourcePaymentId" TEXT;
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_sourcePaymentId_key" UNIQUE ("sourcePaymentId");
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_sourcePaymentId_fkey" FOREIGN KEY ("sourcePaymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
