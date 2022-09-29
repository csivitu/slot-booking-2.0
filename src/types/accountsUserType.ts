export interface AccountsUserType {
  name: string;
  email: string;
}

export interface GravitasUserType {
  "Receipt No.": string;
  "Participant Type": string;
  Name: string;
  "Registration No.": string;
  "E-Mail": string;
  "Mobile No.": number;
  "No. of Co-Participants": number;
  "Payment Status": "Paid" | "Not Paid";
}

export enum ScopeTypes {
  ADMIN = "admin",
  USER = "user",
}
