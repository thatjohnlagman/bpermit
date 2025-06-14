export interface TaxpayerInfo {
  taxpayer_id?: string
  taxpayer_name: string
  taxpayer_telephone_no: string
  taxpayer_address: string
  taxpayer_barangay_no: string
}

export interface BusinessInfo {
  business_account_no?: string
  business_capital: number
  business_trade_name: string
  business_telephone_no: string
  business_fax_no?: string
  commercial_address_building_name: string
  commercial_address_building_no: string
  commercial_address_street: string
  commercial_address_barangay_no: string
  main_line_of_business: string
  main_products_services: string
  other_lines_of_business?: string
  other_products_services?: string
  business_ownership_type: "Sole Proprietorship" | "Partnership" | "Corporation"
  no_of_employees?: number
  taxpayer_id?: string
  sec_registration_no?: string
  sec_registration_file_url?: string
  dti_registration_no?: string
  dti_registration_file_url?: string
}

export interface BusinessApplicationInfo {
  application_id?: string
  business_account_no?: string
  date_of_application?: string
  official_receipt_date?: string
  amount_paid?: number
  barangay_clearance_file_url: string
  insurance_issuing_company?: string
  insurance_date?: string
  proof_of_ownership_type: string
  is_owned_property: boolean
  property_registered_name?: string
  real_property_tax_receipt_no?: string
  period_date?: string
  owned_property_document_file_url?: string
  is_leased_property: boolean
  lessor_name?: string
  leased_area_sq_meter?: number
  rent_per_month?: number
  leased_property_document_file_url?: string
  applicant_name?: string
  applicant_position?: string
  business_plate_no?: string
  business_plate_date?: string
  mayor_permit_no: string
  mayor_permit_received_by: string
  mayor_permit_date: string
  mayor_permit_file_url: string
  permit_date_of_release?: string
  permit_time_of_release?: string
  permit_released_by?: string
}

export interface OfficeReview {
  reviewed_by_office_id?: string
  application_id?: string
  office_name: string
  remarks_and_recommendation?: string
  office_reviewed_by: string
  office_reviewed_date: string
}

export interface ApplicationFormData {
  taxpayerInfo: TaxpayerInfo
  businessInfo: BusinessInfo
  applicationInfo: BusinessApplicationInfo
  officeReviews: OfficeReview[]
}
