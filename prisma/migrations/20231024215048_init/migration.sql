-- CreateTable
CREATE TABLE "ub_papers" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ub_papers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ub_sections" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT NOT NULL,
    "paperId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ub_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ub_paragraphs" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" TEXT NOT NULL,
    "paperId" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ub_paragraphs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "name" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_api_keys" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "user_api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ub_papers_number_key" ON "ub_papers"("number");

-- CreateIndex
CREATE UNIQUE INDEX "ub_papers_title_key" ON "ub_papers"("title");

-- CreateIndex
CREATE UNIQUE INDEX "ub_sections_paperId_title_key" ON "ub_sections"("paperId", "title");

-- CreateIndex
CREATE UNIQUE INDEX "ub_paragraphs_reference_key" ON "ub_paragraphs"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_api_keys_key_key" ON "user_api_keys"("key");

-- AddForeignKey
ALTER TABLE "ub_sections" ADD CONSTRAINT "ub_sections_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "ub_papers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ub_paragraphs" ADD CONSTRAINT "ub_paragraphs_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "ub_papers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ub_paragraphs" ADD CONSTRAINT "ub_paragraphs_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "ub_sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_api_keys" ADD CONSTRAINT "user_api_keys_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
