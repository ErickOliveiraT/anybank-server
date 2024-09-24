-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "phone_whatsapp" BOOLEAN NOT NULL,
    "email" TEXT NOT NULL,
    "birthdate" TEXT NOT NULL,
    "document_type" TEXT NOT NULL,
    "document_value" TEXT NOT NULL,
    "document_expedition_date" TEXT,
    "document_expedition_org" TEXT,
    "mother_name" TEXT NOT NULL,
    "father_name" TEXT NOT NULL,
    "marital_status" TEXT NOT NULL,
    "marital_type" TEXT,
    "birth_country" TEXT NOT NULL,
    "birth_state" TEXT NOT NULL,
    "birth_city" TEXT NOT NULL,
    "address_street" TEXT NOT NULL,
    "address_street_number" TEXT NOT NULL,
    "address_complement" TEXT NOT NULL,
    "address_city" TEXT NOT NULL,
    "address_state" TEXT NOT NULL,
    "address_country" TEXT NOT NULL,
    "address_postal_code" TEXT NOT NULL,
    "monthly_income" REAL NOT NULL
);
