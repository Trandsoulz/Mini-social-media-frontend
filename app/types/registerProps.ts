export interface RegisterProps {
  full_name: string;
  email: string;
  phone_number: number | string | null;
  password: string;
  confirm_password: string | undefined;
}

export interface LoginProps {
  email : string;
  password : string;
}
