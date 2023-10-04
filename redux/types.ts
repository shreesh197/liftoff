//user
export interface BasicDetails {
  first_name: string;
  last_name: string;
  primary_contact: string;
  whatsapp_contact: string;
  emergency_contact: string;
  dob: string;
  gender: string;
  KodNest_id: string;
}

export interface AcademicDetails {
  usn_id: string;
  sslc_year_passout: string;
  sslc_percentage: string;
  sslc_school_name: string;
  puc_year_passout: string;
  puc_percentage: string;
  puc_school_name: string;
  graduation_course: string;
  graduation_branch: string;
  graduation_year_passout: string;
  graduation_percentage: string;
  graduation_cgpa: string;
  active_backlogs: string;
  college_name: string;
  post_graduation_course: string;
  post_graduation_branch: string;
  post_graduation_year_passout: string;
  post_graduation_percentage: string;
  post_graduation_cgpa: string;
  post_graduation_college_name: string;
  post_graduation_active_backlogs: string;
  academic_gap: string;
  working_professional: boolean;
  work_experience: string;
}

export interface DocumentDetails {
  photo: {
    file: string;
    content_type: string;
  };
  sslc_certificate: {
    file: string;
    content_type: string;
  };
  puc_certificate: {
    file: string;
    content_type: string;
  };
  graduation_certificate_all: {
    file: string;
    content_type: string;
  };
  post_graduation_certificate_all: {
    file: string;
    content_type: string;
  };
  aadhar_card: {
    file: string;
    content_type: string;
  };
  pan_card: {
    file: string;
    content_type: string;
  };
  declaration: boolean;
}

export interface OtherDetails {
  current_location_state: string;
  current_location_city: string;
  preferred_job_location: string[];
  tpo_contact: string;
  github_profile_url: string;
  linkedin_profile_url: string;
}

export interface UserProfile {
  id: string;
  basic_details: BasicDetails;
  academic_details: AcademicDetails;
  documents_details: DocumentDetails;
  other_details: OtherDetails;
  batch_id: string;
  batch_type: string;
  course_opted: string;
  email: string;
  fees_amount: string;
  fees_status: string;
  is_deleted: boolean;
  profile_type: string;
  profile_photo: string;
  is_profile_completed: false;
  placement_preference: string;
}

export interface Token {
  access_token: string;
  refresh_token: string;
}

export interface AddOnServices {
  service_type: string;
  template_name: string;
  template_id: string;
  categories: string[];
  product_id: string;
}

export interface Products {
  product_name: string;
  snapshot_id: string;
  price: number;
  product_id: string;
}

export interface BatchDetails {
  capacity: number;
  registration_end: string;
  addon_products: any[];
  end_date: string;
  batch_id: string;
  registration_open: string;
  delta: number;
  addon_services: AddOnServices[];
  products: Products[];
  start_date: string;
  batch_name: string;
  description: string;
}

export interface StoreState {
  route: string;
  routeRedirect: string;
  token: Token;
  profile: UserProfile;
  batchDetails: BatchDetails;
}
