-- CreateTable
CREATE TABLE `User` (
    `id` BINARY(16) NOT NULL,
    `nickname` VARCHAR(191) NOT NULL,
    `password` VARCHAR(80) NOT NULL,
    `createdAt` CHAR(24) NOT NULL,
    `updatedAt` CHAR(24) NOT NULL,

    UNIQUE INDEX `User_nickname_key`(`nickname`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
