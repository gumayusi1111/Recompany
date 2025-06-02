-- CreateTable
CREATE TABLE "materials_page" (
    "page_id" TEXT NOT NULL,
    "page_title" TEXT,
    "page_description" TEXT,
    "page_keywords" TEXT,
    "page_intro" TEXT,
    "materials" JSONB,
    "categories" JSONB,
    "page_config" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "materials_page_pkey" PRIMARY KEY ("page_id")
);

-- CreateTable
CREATE TABLE "reviews_page" (
    "page_id" TEXT NOT NULL,
    "page_title" TEXT,
    "page_description" TEXT,
    "page_keywords" TEXT,
    "page_intro" TEXT,
    "reviews" JSONB,
    "statistics" JSONB,
    "page_config" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_page_pkey" PRIMARY KEY ("page_id")
);
