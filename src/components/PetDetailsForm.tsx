import React, { useState } from 'react';
import { PetType, PetProfile } from '../types';
import { ArrowLeft, Check } from 'lucide-react';

interface Props {
  petType: PetType;
  onSubmit: (details: Omit<PetProfile, 'type'>) => void;
  onBack: () => void;
}

export default function PetDetailsForm({ petType, onSubmit, onBack }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    weight: '',
    gender: 'Unknown' as 'Male' | 'Female' | 'Unknown',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-md mx-auto w-full p-8 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto">
      <button 
        onClick={onBack}
        className="flex items-center text-sm font-semibold text-[#7D8471] hover:text-[#3A3A2E] mb-8 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </button>

      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-[#E5E0D5]">
        <h2 className="text-3xl font-serif text-[#3A3A2E] mb-2">Tell us about your {petType}.</h2>
        <p className="text-[#7D8471] mb-8 italic">These details help personalize my recommendations.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs uppercase tracking-widest font-bold opacity-60 text-[#3A3A2E] mb-2">Pet's Name</label>
            <input
              required
              type="text"
              className="w-full px-4 py-3 bg-[#FAF9F6] rounded-xl border border-[#E5E0D5] focus:ring-1 focus:ring-[#7D8471] focus:border-[#7D8471] outline-none transition-all text-[#3A3A2E]"
              placeholder="e.g. Bruno"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-xs uppercase tracking-widest font-bold opacity-60 text-[#3A3A2E] mb-2">Breed</label>
            <input
              required
              type="text"
              className="w-full px-4 py-3 bg-[#FAF9F6] rounded-xl border border-[#E5E0D5] focus:ring-1 focus:ring-[#7D8471] focus:border-[#7D8471] outline-none transition-all text-[#3A3A2E]"
              placeholder="e.g. Labrador"
              value={formData.breed}
              onChange={e => setFormData({ ...formData, breed: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest font-bold opacity-60 text-[#3A3A2E] mb-2">Age</label>
              <input
                required
                type="text"
                className="w-full px-4 py-3 bg-[#FAF9F6] rounded-xl border border-[#E5E0D5] focus:ring-1 focus:ring-[#7D8471] focus:border-[#7D8471] outline-none transition-all text-[#3A3A2E]"
                placeholder="e.g. 2 Years"
                value={formData.age}
                onChange={e => setFormData({ ...formData, age: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest font-bold opacity-60 text-[#3A3A2E] mb-2">Weight</label>
              <input
                required
                type="text"
                className="w-full px-4 py-3 bg-[#FAF9F6] rounded-xl border border-[#E5E0D5] focus:ring-1 focus:ring-[#7D8471] focus:border-[#7D8471] outline-none transition-all text-[#3A3A2E]"
                placeholder="e.g. 24 kg"
                value={formData.weight}
                onChange={e => setFormData({ ...formData, weight: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest font-bold opacity-60 text-[#3A3A2E] mb-3">Gender</label>
            <div className="flex gap-6">
              {['Male', 'Female', 'Unknown'].map((g) => (
                <label key={g} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={formData.gender === g}
                    onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-4 h-4 text-[#7D8471] focus:ring-[#7D8471] border-[#E5E0D5] bg-[#FAF9F6]"
                  />
                  <span className="text-sm font-medium text-[#3A3A2E]">{g}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-8 bg-[#7D8471] hover:bg-opacity-90 text-white text-sm font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            Start Chatting <Check className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
