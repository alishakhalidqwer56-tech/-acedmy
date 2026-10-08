import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Badge } from '../../components/ui/Badge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../context/ToastContext';
import { fetchChatbotSettings, updateChatbotSettings } from '../../lib/dataService';
import { ChatbotSettings, ChatbotFAQ } from '../../types';
import { 
  Bot, 
  Save, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  ChevronRight, 
  MoveUp, 
  MoveDown,
  Eye,
  Sparkles,
  Send
} from 'lucide-react';

export const AdminChatbotPage: React.FC = () => {
  const [config, setConfig] = useState<ChatbotSettings | null>(null);
  const [faqs, setFaqs] = useState<ChatbotFAQ[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [isAddingFaq, setIsAddingFaq] = useState(false);
  const [faqToDeleteIndex, setFaqToDeleteIndex] = useState<number | null>(null);
  const toast = useToast();

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchChatbotSettings();
        setConfig(data);
        setFaqs(data.faqs || []);
      } catch {
        toast.error('Failed to load chatbot configuration');
      }
    }
    load();
  }, []);

  if (!config) {
    return (
      <PortalLayout pageTitle="Chatbot Settings" pageSubtitle="Loading configurations...">
        <div className="p-12 text-center text-slate-400">Loading AI Assistant parameters...</div>
      </PortalLayout>
    );
  }

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const payload: Partial<ChatbotSettings> = {
        ...config,
        faqs,
      };
      await updateChatbotSettings(payload);
      toast.success('Chatbot settings saved successfully! Widget updated live.');
    } catch {
      toast.error('Failed to update chatbot settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddNewFaq = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      toast.warning('Please provide both question and answer');
      return;
    }
    setFaqs(prev => [...prev, { question: newQuestion.trim(), answer: newAnswer.trim() }]);
    setNewQuestion('');
    setNewAnswer('');
    setIsAddingFaq(false);
    toast.success('FAQ added to list. Click Save All Settings to publish.');
  };

  const handleSaveEdit = (idx: number) => {
    if (!editQuestion.trim() || !editAnswer.trim()) {
      toast.warning('Fields cannot be empty');
      return;
    }
    const updated = [...faqs];
    updated[idx] = { question: editQuestion.trim(), answer: editAnswer.trim() };
    setFaqs(updated);
    setEditingIndex(null);
    toast.info('FAQ updated locally. Remember to click Save All Settings.');
  };

  const handleMoveFaq = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= faqs.length) return;
    const copy = [...faqs];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);
    setFaqs(copy);
  };

  const handleDeleteFaqConfirm = () => {
    if (faqToDeleteIndex === null) return;
    setFaqs(prev => prev.filter((_, idx) => idx !== faqToDeleteIndex));
    setFaqToDeleteIndex(null);
    toast.success('FAQ removed. Remember to save all settings.');
  };

  return (
    <PortalLayout
      pageTitle="Chatbot & FAQ Manager"
      pageSubtitle="Configure the floating website assistant (GA Assistant), bilingual quick replies, FAQs, and live theme styling"
    >
      <div className="space-y-6 max-w-6xl">
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4 border-b border-[#2a2a3e]">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-400" />
              GA Assistant Widget Settings
            </h3>
            <p className="text-xs text-slate-400">Controls the floating bot seen by visitors across all public pages</p>
          </div>
          <Button
            type="button"
            variant="primary"
            size="sm"
            isLoading={isSaving}
            onClick={handleSaveAll}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save All Settings
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Settings Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* General Parameters */}
            <Card className="p-6 bg-[#161625] border-[#2a2a3e] space-y-5">
              <h4 className="text-sm font-bold text-white">General Parameters</h4>

              {/* Enable Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#141422] border border-[#2a2a3e]">
                <div>
                  <span className="text-xs font-semibold text-white block">Enable Floating Chatbot Widget</span>
                  <span className="text-[11px] text-slate-400">Show floating launcher on homepage and public pages</span>
                </div>
                <button
                  type="button"
                  onClick={() => setConfig(prev => prev ? ({ ...prev, is_enabled: !prev.is_enabled }) : prev)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    config.is_enabled ? 'bg-purple-600' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      config.is_enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Bot Name *"
                  value={config.bot_name || ''}
                  onChange={(e) => setConfig(prev => prev ? ({ ...prev, bot_name: e.target.value }) : prev)}
                  placeholder="GA Assistant"
                />

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Primary Accent Color</label>
                  <div className="flex items-center gap-2.5">
                    <input
                      type="color"
                      value={config.primary_color || '#7c3aed'}
                      onChange={(e) => setConfig(prev => prev ? ({ ...prev, primary_color: e.target.value }) : prev)}
                      className="w-10 h-10 rounded-xl bg-transparent border border-[#2a2a3e] cursor-pointer"
                    />
                    <Input
                      value={config.primary_color || '#7c3aed'}
                      onChange={(e) => setConfig(prev => prev ? ({ ...prev, primary_color: e.target.value }) : prev)}
                      placeholder="#7c3aed"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Screen Position</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setConfig(prev => prev ? ({ ...prev, position: 'bottom-right' }) : prev)}
                    className={`p-3 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                      config.position !== 'bottom-left'
                        ? 'border-purple-500 bg-purple-500/10 text-white font-semibold'
                        : 'border-[#2a2a3e] text-slate-400 hover:text-white'
                    }`}
                  >
                    Bottom-Right (Standard)
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfig(prev => prev ? ({ ...prev, position: 'bottom-left' }) : prev)}
                    className={`p-3 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                      config.position === 'bottom-left'
                        ? 'border-purple-500 bg-purple-500/10 text-white font-semibold'
                        : 'border-[#2a2a3e] text-slate-400 hover:text-white'
                    }`}
                  >
                    Bottom-Left
                  </button>
                </div>
              </div>

              <Textarea
                label="Greeting / Welcome Message *"
                rows={3}
                value={config.welcome_message || ''}
                onChange={(e) => setConfig(prev => prev ? ({ ...prev, welcome_message: e.target.value }) : prev)}
                placeholder="Welcome to Girls Academy! How may I assist you today?"
              />
            </Card>

            {/* FAQs Manager */}
            <Card className="p-6 bg-[#161625] border-[#2a2a3e] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Frequently Asked Questions (Quick-Replies)</h4>
                  <p className="text-xs text-slate-400">Visitors can click these questions to receive instant automated answers</p>
                </div>
                {!isAddingFaq && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddingFaq(true)}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Add FAQ
                  </Button>
                )}
              </div>

              {/* Add FAQ form */}
              {isAddingFaq && (
                <div className="p-4 rounded-2xl bg-[#141422] border border-purple-500/40 space-y-3">
                  <Input
                    label="Question *"
                    placeholder="e.g. How can I apply for admission?"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                  />
                  <Textarea
                    label="Answer *"
                    rows={2}
                    placeholder="e.g. You can submit your application online through the Admissions page on our website."
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddingFaq(false)}>
                      Cancel
                    </Button>
                    <Button type="button" variant="primary" size="sm" onClick={handleAddNewFaq}>
                      Add to List
                    </Button>
                  </div>
                </div>
              )}

              {/* FAQ List */}
              <div className="space-y-2.5">
                {faqs.map((f, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#141422] border border-[#2a2a3e] hover:border-purple-500/30 transition-all flex flex-col gap-2"
                  >
                    {editingIndex === idx ? (
                      <div className="space-y-3">
                        <Input
                          label="Question"
                          value={editQuestion}
                          onChange={(e) => setEditQuestion(e.target.value)}
                        />
                        <Textarea
                          label="Answer"
                          rows={2}
                          value={editAnswer}
                          onChange={(e) => setEditAnswer(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="ghost" size="sm" onClick={() => setEditingIndex(null)}>
                            Cancel
                          </Button>
                          <Button type="button" variant="primary" size="sm" onClick={() => handleSaveEdit(idx)}>
                            Save FAQ
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-purple-500/20 text-purple-300 flex items-center justify-center text-[10px] font-bold shrink-0">
                              {idx + 1}
                            </span>
                            <h5 className="text-xs font-semibold text-white truncate">{f.question}</h5>
                          </div>
                          <p className="text-xs text-slate-300 pl-7 leading-relaxed">{f.answer}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleMoveFaq(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"
                            title="Move Up"
                          >
                            <MoveUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveFaq(idx, 'down')}
                            disabled={idx === faqs.length - 1}
                            className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30"
                            title="Move Down"
                          >
                            <MoveDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingIndex(idx);
                              setEditQuestion(f.question);
                              setEditAnswer(f.answer);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-white"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setFaqToDeleteIndex(idx)}
                            className="p-1 rounded text-rose-400 hover:text-rose-300"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column: Live Chatbot Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-300">
              <Eye className="w-4 h-4" />
              <span>Interactive Live Preview</span>
            </div>

            <div className="w-full h-[540px] bg-[#161625] border border-[#2a2a3e] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
              {/* Header */}
              <div
                style={{ backgroundColor: config.primary_color || '#7c3aed' }}
                className="p-4 flex items-center justify-between text-white"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold">{config.bot_name || 'GA Assistant'}</h5>
                    <span className="text-[10px] text-white/80">Online & Ready</span>
                  </div>
                </div>
                <Badge variant="purple" size="sm" className="bg-white/20 text-white border-transparent">
                  Preview
                </Badge>
              </div>

              {/* Chat Body */}
              <div className="flex-1 p-4 bg-[#12121e] overflow-y-auto space-y-3 text-xs">
                {/* Bot welcome */}
                <div className="flex gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-300 flex items-center justify-center text-[10px] shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="max-w-[85%] rounded-2xl rounded-bl-xs p-3 bg-[#1e1e30] border border-[#2a2a3e] text-slate-200">
                    <p className="leading-relaxed whitespace-pre-line">{config.welcome_message}</p>
                  </div>
                </div>

                {/* FAQ questions */}
                <div className="pt-2">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Quick-Reply Buttons:
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {faqs.map((faq, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-xl bg-[#18182a] border border-[#2a2a3e] text-purple-300 text-[11px] flex items-center justify-between"
                      >
                        <span>{faq.question}</span>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fallback tip */}
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[11px] text-slate-300">
                  <span className="font-semibold text-white block mb-0.5">Free-text fallback:</span>
                  If user asks an unlisted question, the assistant directs them to call the admissions desk or visit the admissions form.
                </div>
              </div>

              {/* Footer preview */}
              <div className="p-3 border-t border-[#2a2a3e] bg-[#161625] flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a question..."
                  disabled
                  className="flex-1 bg-[#12121e] border border-[#2a2a3e] rounded-xl px-3 py-1.5 text-xs text-white opacity-60"
                />
                <button
                  style={{ backgroundColor: config.primary_color || '#7c3aed' }}
                  className="px-3 py-1.5 rounded-xl text-white opacity-80"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation */}
        <ConfirmDialog
          isOpen={faqToDeleteIndex !== null}
          onClose={() => setFaqToDeleteIndex(null)}
          onConfirm={handleDeleteFaqConfirm}
          title="Remove FAQ?"
          message="Are you sure you want to remove this FAQ from the chatbot quick-replies?"
          confirmText="Remove"
        />
      </div>
    </PortalLayout>
  );
};
