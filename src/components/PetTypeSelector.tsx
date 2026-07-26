import React from 'react';
import { PetType } from '../types';
import { Dog, Cat, Bird, Fish, Rabbit, HelpCircle } from 'lucide-react';

interface Props {
  onSelect: (type: PetType) => void;
}

export default function PetTypeSelector({ onSelect }: Props) {
  const types: { type: PetType; icon: React.ElementType }[] = [
    { type: 'Dog', icon: Dog },
    { type: 'Cat', icon: Cat },
    { type: 'Bird', icon: Bird },
    { type: 'Rabbit', icon: Rabbit },
    { type: 'Fish', icon: Fish },
    { type: 'Other', icon: HelpCircle },
  ];

  return (
    <div className="max-w-2xl mx-auto w-full p-8 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-serif text-[#3A3A2E] mb-4">Welcome to PetCare AI.</h2>
        <p className="text-[#7D8471] text-lg">Your intelligent virtual assistant for pet care. Which pet do you have?</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {types.map(({ type, icon: Icon }) => (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className="flex flex-col items-center justify-center p-8 bg-white rounded-[32px] border border-[#E5E0D5] shadow-sm hover:border-[#7D8471] transition-all group cursor-pointer"
          >
            <div className="bg-[#F5F2ED] w-20 h-20 flex items-center justify-center rounded-2xl group-hover:bg-[#E5E0D5] transition-colors mb-6">
              <Icon className="w-8 h-8 text-[#7D8471] group-hover:text-[#3A3A2E] transition-colors" />
            </div>
            <span className="font-serif text-xl text-[#3A3A2E]">{type}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
