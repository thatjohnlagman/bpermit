-- Enable the pgcrypto extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create TAXPAYER_INFO table
CREATE TABLE IF NOT EXISTS taxpayer_info (
    taxpayer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    taxpayer_name VARCHAR(255) NOT NULL,
    taxpayer_telephone_no VARCHAR(20) NOT NULL,
    taxpayer_address TEXT NOT NULL,
    taxpayer_barangay_no VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create BUSINESS_INFO table
CREATE TABLE IF NOT EXISTS business_info (
    business_account_no UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_capital NUMERIC(15, 2) NOT NULL,
    business_trade_name VARCHAR(255) NOT NULL,
    business_telephone_no VARCHAR(20) NOT NULL,
    business_fax_no VARCHAR(20),
    commercial_address_building_name VARCHAR(255) NOT NULL,
    commercial_address_building_no VARCHAR(20) NOT NULL,
    commercial_address_street VARCHAR(255) NOT NULL,
    commercial_address_barangay_no VARCHAR(20) NOT NULL,
    main_line_of_business VARCHAR(255) NOT NULL,
    main_products_services TEXT NOT NULL,
    other_lines_of_business TEXT,
    other_products_services TEXT,
    business_ownership_type VARCHAR(50) NOT NULL CHECK (business_ownership_type IN ('Sole Proprietorship', 'Partnership', 'Corporation')),
    no_of_employees INTEGER DEFAULT 0,
    sec_registration_no VARCHAR(100),
    sec_registration_file_url TEXT,
    dti_registration_no VARCHAR(100),
    dti_registration_file_url TEXT,
    taxpayer_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_taxpayer FOREIGN KEY (taxpayer_id) REFERENCES taxpayer_info(taxpayer_id) ON DELETE CASCADE
);

-- Create BUSINESS_APPLICATION_INFO table
CREATE TABLE IF NOT EXISTS business_application_info (
    application_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_account_no UUID NOT NULL,
    date_of_application DATE NOT NULL,
    official_receipt_date DATE NOT NULL,
    amount_paid NUMERIC(10,2) DEFAULT 1500,
    barangay_clearance_file_url TEXT NOT NULL,
    insurance_issuing_company VARCHAR(255),
    insurance_date DATE,
    proof_of_ownership_type VARCHAR(255) NOT NULL,
    is_owned_property BOOLEAN NOT NULL DEFAULT FALSE,
    property_registered_name VARCHAR(255),
    real_property_tax_receipt_no VARCHAR(100),
    period_date DATE,
    owned_property_document_file_url TEXT,
    is_leased_property BOOLEAN NOT NULL DEFAULT FALSE,
    lessor_name VARCHAR(255),
    leased_area_sq_meter NUMERIC(10,2),
    rent_per_month NUMERIC(10,2),
    leased_property_document_file_url TEXT,
    applicant_name VARCHAR(255),
    applicant_position VARCHAR(100),
    business_plate_no VARCHAR(100) UNIQUE,
    business_plate_date DATE,
    mayor_permit_no VARCHAR(100) NOT NULL,
    mayor_permit_received_by VARCHAR(255) NOT NULL,
    mayor_permit_date DATE NOT NULL,
    mayor_permit_file_url TEXT NOT NULL,
    permit_date_of_release DATE,
    permit_time_of_release TIME,
    permit_released_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_business_info FOREIGN KEY (business_account_no) REFERENCES business_info(business_account_no) ON DELETE CASCADE
);

-- Create REVIEWED_BY_OFFICE table
CREATE TABLE IF NOT EXISTS reviewed_by_office (
    reviewed_by_office_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL,
    office_name VARCHAR(100) NOT NULL,
    remarks_and_recommendation TEXT,
    office_reviewed_by VARCHAR(255) NOT NULL,
    office_reviewed_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_application FOREIGN KEY (application_id) REFERENCES business_application_info(application_id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_business_info_taxpayer_id ON business_info(taxpayer_id);
CREATE INDEX IF NOT EXISTS idx_business_application_info_business_account_no ON business_application_info(business_account_no);
CREATE INDEX IF NOT EXISTS idx_reviewed_by_office_application_id ON reviewed_by_office(application_id);
CREATE INDEX IF NOT EXISTS idx_business_application_info_business_plate_no ON business_application_info(business_plate_no);
CREATE INDEX IF NOT EXISTS idx_business_application_info_mayor_permit_no ON business_application_info(mayor_permit_no);
