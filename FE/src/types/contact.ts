export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface AtelierHub {
  id: string;
  name: string;
  address: string;
  note: string;
  isPrimary?: boolean;
}

export interface ContactChannelInfo {
  hotline: string;
  hotlineDisplay: string;
  emailConcierge: string;
  emailB2b: string;
  weekdayHours: string;
  weekendNote: string;
  slaResponseTime: string;
  slaSurveyTime: string;
}
