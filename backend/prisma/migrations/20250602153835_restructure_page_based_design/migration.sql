/*
  Warnings:

  - You are about to drop the `banner_slide` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `company_intro` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `engineering_case_center` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `homepage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `homepage_case` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `homepage_product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `homepage_seo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_center` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "banner_slide" DROP CONSTRAINT "banner_slide_homepage_id_fkey";

-- DropForeignKey
ALTER TABLE "company_intro" DROP CONSTRAINT "company_intro_homepage_id_fkey";

-- DropForeignKey
ALTER TABLE "homepage_case" DROP CONSTRAINT "homepage_case_case_id_fkey";

-- DropForeignKey
ALTER TABLE "homepage_case" DROP CONSTRAINT "homepage_case_homepage_id_fkey";

-- DropForeignKey
ALTER TABLE "homepage_product" DROP CONSTRAINT "homepage_product_homepage_id_fkey";

-- DropForeignKey
ALTER TABLE "homepage_product" DROP CONSTRAINT "homepage_product_product_id_fkey";

-- DropForeignKey
ALTER TABLE "homepage_seo" DROP CONSTRAINT "homepage_seo_homepage_id_fkey";

-- DropTable
DROP TABLE "banner_slide";

-- DropTable
DROP TABLE "company_intro";

-- DropTable
DROP TABLE "engineering_case_center";

-- DropTable
DROP TABLE "homepage";

-- DropTable
DROP TABLE "homepage_case";

-- DropTable
DROP TABLE "homepage_product";

-- DropTable
DROP TABLE "homepage_seo";

-- DropTable
DROP TABLE "product_center";

-- CreateTable
CREATE TABLE "home_page" (
    "page_id" TEXT NOT NULL,
    "seo_main_title" TEXT,
    "seo_sub_title" TEXT,
    "seo_keywords" TEXT,
    "seo_description" TEXT,
    "company_intro_title" TEXT,
    "company_intro_text" TEXT,
    "company_intro_image" TEXT,
    "banner_slides" JSONB,
    "product_section_title" TEXT,
    "featured_products" JSONB,
    "case_section_title" TEXT,
    "featured_cases" JSONB,
    "page_config" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_page_pkey" PRIMARY KEY ("page_id")
);

-- CreateTable
CREATE TABLE "product_page" (
    "page_id" TEXT NOT NULL,
    "page_title" TEXT,
    "page_description" TEXT,
    "page_keywords" TEXT,
    "page_intro" TEXT,
    "products" JSONB,
    "categories" JSONB,
    "page_config" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_page_pkey" PRIMARY KEY ("page_id")
);

-- CreateTable
CREATE TABLE "case_page" (
    "page_id" TEXT NOT NULL,
    "page_title" TEXT,
    "page_description" TEXT,
    "page_keywords" TEXT,
    "page_intro" TEXT,
    "cases" JSONB,
    "categories" JSONB,
    "page_config" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "case_page_pkey" PRIMARY KEY ("page_id")
);

-- CreateTable
CREATE TABLE "news_page" (
    "page_id" TEXT NOT NULL,
    "page_title" TEXT,
    "page_description" TEXT,
    "page_keywords" TEXT,
    "page_intro" TEXT,
    "news" JSONB,
    "categories" JSONB,
    "page_config" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_page_pkey" PRIMARY KEY ("page_id")
);

-- CreateTable
CREATE TABLE "about_page" (
    "page_id" TEXT NOT NULL,
    "page_title" TEXT,
    "page_description" TEXT,
    "page_keywords" TEXT,
    "company_name" TEXT,
    "company_intro" TEXT,
    "company_history" TEXT,
    "company_vision" TEXT,
    "company_mission" TEXT,
    "contact_info" JSONB,
    "team_info" JSONB,
    "page_config" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "about_page_pkey" PRIMARY KEY ("page_id")
);

-- CreateTable
CREATE TABLE "contact_page" (
    "page_id" TEXT NOT NULL,
    "page_title" TEXT,
    "page_description" TEXT,
    "page_keywords" TEXT,
    "company_address" TEXT,
    "company_phone" TEXT,
    "company_email" TEXT,
    "company_fax" TEXT,
    "map_config" JSONB,
    "form_config" JSONB,
    "page_config" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_page_pkey" PRIMARY KEY ("page_id")
);
