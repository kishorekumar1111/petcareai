/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { PetProfile, PetType } from './types';
import PetTypeSelector from './components/PetTypeSelector';
import PetDetailsForm from './components/PetDetailsForm';
import ChatInterface from './components/ChatInterface';
import { Bot } from 'lucide-react';

export default function App() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [petProfile, setPetProfile] = useState<PetProfile>({
    type: null,
    name: '',
    breed: '',
    age: '',
    weight: '',
    gender: 'Unknown',
  });

  const handleTypeSelect = (type: PetType) => {
    setPetProfile(prev => ({ ...prev, type }));
    setStep(2);
  };

  const handleDetailsSubmit = (details: Omit<PetProfile, 'type'>) => {
    setPetProfile(prev => ({ ...prev, ...details }));
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans text-[#3A3A2E]">
      <header className="bg-[#F9F7F2] shadow-sm border-b border-[#E5E0D5] py-4 px-8 flex items-center gap-3 shrink-0">
        <div className="bg-[#7D8471] p-2 rounded-full">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-2xl font-serif italic tracking-tight text-[#3A3A2E]">PetCare AI</h1>
      </header>
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {step === 1 && <PetTypeSelector onSelect={handleTypeSelect} />}
        {step === 2 && (
          <PetDetailsForm 
            petType={petProfile.type!} 
            onSubmit={handleDetailsSubmit} 
            onBack={() => setStep(1)} 
          />
        )}
        {step === 3 && (
          <ChatInterface 
            petProfile={petProfile} 
            onReset={() => {
              setStep(1);
              setPetProfile({ type: null, name: '', breed: '', age: '', weight: '', gender: 'Unknown' });
            }}
          />
        )}
      </main>
    </div>
  );
}
