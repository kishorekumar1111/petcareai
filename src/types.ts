export type PetType = 'Dog' | 'Cat' | 'Bird' | 'Rabbit' | 'Fish' | 'Other';

export interface PetProfile {
  type: PetType | null;
  name: string;
  breed: string;
  age: string;
  weight: string;
  gender: 'Male' | 'Female' | 'Unknown';
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}
