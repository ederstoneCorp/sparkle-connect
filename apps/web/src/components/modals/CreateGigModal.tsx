import React, { useState } from 'react';
import { useSparkle } from '../../context/SparkleContext';
import { X, Briefcase, DollarSign, Calendar, Wrench, Send } from 'lucide-react';

interface CreateGigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateGigModal: React.FC<CreateGigModalProps> = ({ isOpen, onClose }) => {
  const { createGig } = useSparkle();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budgetKes, setBudgetKes] = useState(3500);
  const [category, setCategory] = useState('TECH');
  const [deadline, setDeadline] = useState('In 3 days');
  const [skillsInput, setSkillsInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    createGig(
      title.trim(),
      description.trim(),
      Number(budgetKes),
      category,
      deadline.trim(),
      skills.length > 0 ? skills : ['General Campus Task']
    );

    setTitle('');
    setDescription('');
    setBudgetKes(3500);
    setSkillsInput('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Post a Student Gig</h3>
              <p className="text-[11px] text-slate-500">Hire talented Kenyan campus comrades</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Gig Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Build Responsive Landing Page for Tech Club"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Gig Description</label>
            <textarea
              required
              rows={3}
              placeholder="Outline project deliverables, scope, and requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Budget (KES)
              </label>
              <div className="relative">
                <span className="text-xs font-bold text-slate-400 absolute left-3 top-1/2 -translate-y-1/2">
                  KES
                </span>
                <input
                  type="number"
                  required
                  min={200}
                  step={100}
                  value={budgetKes}
                  onChange={(e) => setBudgetKes(Number(e.target.value))}
                  className="w-full pl-12 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-semibold"
              >
                <option value="TECH">Software & Coding</option>
                <option value="DESIGN">Graphic & UI/UX Design</option>
                <option value="WRITING">Academic & Content Writing</option>
                <option value="TUTORING">Peer Tutoring</option>
                <option value="MEDIA">Photography & Video</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Timeline / Deadline</label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. By Friday, In 3 days"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Skills Needed</label>
              <div className="relative">
                <Wrench className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="React, Figma, Tailwind"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-extrabold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post Gig</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
