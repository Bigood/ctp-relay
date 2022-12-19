-- CreateTable
CREATE TABLE "Instance" (
    "host" TEXT NOT NULL,
    "secret" TEXT NOT NULL,
    "version" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Instance_pkey" PRIMARY KEY ("host")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "payload" JSONB NOT NULL,
    "instanceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MessagesDeliveredToInstance" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MessagesDeliveredToInstance_AB_unique" ON "_MessagesDeliveredToInstance"("A", "B");

-- CreateIndex
CREATE INDEX "_MessagesDeliveredToInstance_B_index" ON "_MessagesDeliveredToInstance"("B");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_instanceId_fkey" FOREIGN KEY ("instanceId") REFERENCES "Instance"("host") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MessagesDeliveredToInstance" ADD CONSTRAINT "_MessagesDeliveredToInstance_A_fkey" FOREIGN KEY ("A") REFERENCES "Instance"("host") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MessagesDeliveredToInstance" ADD CONSTRAINT "_MessagesDeliveredToInstance_B_fkey" FOREIGN KEY ("B") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
