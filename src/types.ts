export interface Participant {
  id: number;
  name: string;
  avatar: string;
  status: string;
}

export interface Recommendation {
  id: string;
  name: string;
  match_score: number;
  tags: string[];
  image: string;
  price_level: string;
}

export interface BillItem {
  id: string;
  name: string;
  price: number;
  assigned_to: (number | string)[]; // participant ID or 'all'
}

export interface BillDetails {
  items: BillItem[];
  taxes: number;
  delivery: number;
}

export interface SessionData {
  session: {
    id: string;
    host_name: string;
    participants: Participant[];
  };
  recommendations: Recommendation[];
  bill_details: BillDetails;
}

export type AppStep = 'invitation' | 'lobby' | 'preference' | 'revelation' | 'voting';

