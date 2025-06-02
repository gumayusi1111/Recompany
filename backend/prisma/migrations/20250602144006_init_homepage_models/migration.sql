-- CreateTable
CREATE TABLE "homepage" (
    "homepage_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homepage_pkey" PRIMARY KEY ("homepage_id")
);

-- CreateTable
CREATE TABLE "homepage_seo" (
    "seo_id" TEXT NOT NULL,
    "main_title" TEXT,
    "sub_title" TEXT,
    "homepage_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homepage_seo_pkey" PRIMARY KEY ("seo_id")
);

-- CreateTable
CREATE TABLE "company_intro" (
    "company_intro_id" TEXT NOT NULL,
    "intro_text" TEXT,
    "image_path" TEXT,
    "homepage_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_intro_pkey" PRIMARY KEY ("company_intro_id")
);

-- CreateTable
CREATE TABLE "banner_slide" (
    "banner_slide_id" TEXT NOT NULL,
    "main_title" TEXT,
    "sub_title" TEXT,
    "image_path" TEXT,
    "homepage_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banner_slide_pkey" PRIMARY KEY ("banner_slide_id")
);

-- CreateTable
CREATE TABLE "product_center" (
    "product_id" TEXT NOT NULL,
    "product_name" TEXT,
    "product_description" TEXT,
    "image_path" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_center_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "engineering_case_center" (
    "case_id" TEXT NOT NULL,
    "case_name" TEXT,
    "case_description" TEXT,
    "image_path" TEXT,
    "case_type" TEXT,
    "case_area" TEXT,
    "client_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "engineering_case_center_pkey" PRIMARY KEY ("case_id")
);

-- CreateTable
CREATE TABLE "homepage_product" (
    "display_id" TEXT NOT NULL,
    "homepage_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homepage_product_pkey" PRIMARY KEY ("display_id")
);

-- CreateTable
CREATE TABLE "homepage_case" (
    "display_id" TEXT NOT NULL,
    "homepage_id" TEXT NOT NULL,
    "case_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "homepage_case_pkey" PRIMARY KEY ("display_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "homepage_product_homepage_id_product_id_key" ON "homepage_product"("homepage_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "homepage_case_homepage_id_case_id_key" ON "homepage_case"("homepage_id", "case_id");

-- AddForeignKey
ALTER TABLE "homepage_seo" ADD CONSTRAINT "homepage_seo_homepage_id_fkey" FOREIGN KEY ("homepage_id") REFERENCES "homepage"("homepage_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_intro" ADD CONSTRAINT "company_intro_homepage_id_fkey" FOREIGN KEY ("homepage_id") REFERENCES "homepage"("homepage_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banner_slide" ADD CONSTRAINT "banner_slide_homepage_id_fkey" FOREIGN KEY ("homepage_id") REFERENCES "homepage"("homepage_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homepage_product" ADD CONSTRAINT "homepage_product_homepage_id_fkey" FOREIGN KEY ("homepage_id") REFERENCES "homepage"("homepage_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homepage_product" ADD CONSTRAINT "homepage_product_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product_center"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homepage_case" ADD CONSTRAINT "homepage_case_homepage_id_fkey" FOREIGN KEY ("homepage_id") REFERENCES "homepage"("homepage_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "homepage_case" ADD CONSTRAINT "homepage_case_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "engineering_case_center"("case_id") ON DELETE CASCADE ON UPDATE CASCADE;
