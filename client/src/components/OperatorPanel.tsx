import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Edit3, Save, Download, RefreshCw, Shield, FileText, Bell, CheckCircle2, MessageSquare, Send, PlusCircle, Check } from 'lucide-react';

export const OperatorPanel: React.FC = () => {
  const {
    isOperator,
    setIsOperator,
    briefing,
    updateBriefingText,
    exportJSON,
    resetAllData,
    handoffs,
    resolveHandoff,
    createNewCase
  } = useApp();

  const [isEditingBriefing, setIsEditingBriefing] = useState(false);
  const [briefingEN, setBriefingEN] = useState(briefing.prose);

  // State for Handoff queue management
  const [handoffTab, setHandoffTab] = useState<'pending' | 'resolved'>('pending');
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  if (!isOperator) return null;

  const handleSaveBriefing = () => {
    // English-only build: store the English text across all locale fields so
    // the (retained) I18nText shape stays consistent.
    updateBriefingText(briefingEN);
    setIsEditingBriefing(false);
  };

  const pendingHandoffs = handoffs.filter((h) => !h.resolved);
  const resolvedHandoffs = handoffs.filter((h) => h.resolved);

  const handleReplyChange = (id: string, text: string) => {
    setReplyInputs((prev) => ({ ...prev, [id]: text }));
  };

  const handleSendResponse = (id: string) => {
    const replyText = replyInputs[id]?.trim();
    if (!replyText) return;
    resolveHandoff(id, replyText);
    setReplyInputs((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleCreateCaseFromHandoff = (h: any) => {
    createNewCase({
      emoji: '🛎️',
      title: h.clientQuestion,
      clientState: '✅ In our hands',
      internalStatus: 'Open',
      priority: 'High',
      isRecurring: false,
      nextStep: 'Client inquiry converted into active case by Mimo.'
    });
    resolveHandoff(h.id, 'Converted into a new executive case.');
  };

  return (
    <div className="bg-[#0E3F3A] text-white rounded-3xl p-5 border border-[#B8912E]/40 shadow-xl space-y-4 my-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1A7067] pb-3">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#B8912E]" />
          <div>
            <h3 className="font-serif-display font-bold text-base text-[#F7F5F1]">
              Operator Panel · Movsum "Mimo"
            </h3>
            <p className="text-[10px] text-[#E2DDD5]/70">
              Executive Concierge & Case Management Center
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOperator(false)}
          className="text-xs text-[#E2DDD5] bg-black/30 hover:bg-black/50 px-3 py-1 rounded-full border border-white/10 transition"
        >
          Close Operator Mode
        </button>
      </div>

      {/* Concierge Handoffs Queue Section */}
      <div className="space-y-3 bg-black/25 p-4 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-semibold text-[#B8912E] flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-[#B8912E]" />
            <span>Handoff Queue (Concierge AI questions)</span>
          </span>

          {/* Queue Filter Tabs */}
          <div className="flex items-center gap-1 bg-black/30 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setHandoffTab('pending')}
              className={`px-3 py-1 rounded-lg font-medium transition flex items-center gap-1.5 ${
                handoffTab === 'pending'
                  ? 'bg-[#145A52] text-white shadow-xs'
                  : 'text-[#E2DDD5]/70 hover:text-white'
              }`}
            >
              <span>Pending</span>
              <span className="bg-amber-500 text-black text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {pendingHandoffs.length}
              </span>
            </button>

            <button
              onClick={() => setHandoffTab('resolved')}
              className={`px-3 py-1 rounded-lg font-medium transition flex items-center gap-1.5 ${
                handoffTab === 'resolved'
                  ? 'bg-[#145A52] text-white shadow-xs'
                  : 'text-[#E2DDD5]/70 hover:text-white'
              }`}
            >
              <span>Resolved</span>
              <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {resolvedHandoffs.length}
              </span>
            </button>
          </div>
        </div>

        {/* Tab Content: Pending Handoff Queue */}
        {handoffTab === 'pending' && (
          <div className="space-y-3 pt-1 text-xs">
            {pendingHandoffs.length > 0 ? (
              pendingHandoffs.map((h) => (
                <div
                  key={h.id}
                  className="bg-black/40 p-3.5 rounded-xl border border-amber-500/40 space-y-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[10px] bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded-md border border-amber-500/30">
                          <MessageSquare className="w-3 h-3 text-amber-300" />
                          Client Question
                        </span>
                        <span className="text-[10px] text-[#E2DDD5]/60 font-mono">
                          Language: {h.language.toUpperCase()} • {new Date(h.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="font-sans text-[#F7F5F1] font-medium text-xs leading-relaxed pl-0.5">
                        "{h.clientQuestion}"
                      </p>
                    </div>
                  </div>

                  {/* Direct Reply Input for Mimo */}
                  <div className="space-y-2 pt-1">
                    <textarea
                      value={replyInputs[h.id] || ''}
                      onChange={(e) => handleReplyChange(h.id, e.target.value)}
                      placeholder="Type your direct reply to Layla..."
                      rows={2}
                      className="w-full p-2.5 bg-[#F7F5F1] text-[#1C2826] placeholder:text-gray-400 rounded-xl border border-white/20 text-xs focus:outline-none focus:ring-1 focus:ring-[#B8912E]"
                    />

                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <button
                        onClick={() => handleCreateCaseFromHandoff(h)}
                        className="text-[11px] bg-white/10 hover:bg-white/20 text-amber-200 px-2.5 py-1.5 rounded-lg border border-amber-500/30 transition flex items-center gap-1"
                      >
                        <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
                        <span>Convert to Case</span>
                      </button>

                      <div className="flex items-center gap-1.5 ml-auto">
                        <button
                          onClick={() => resolveHandoff(h.id)}
                          className="text-[11px] text-[#E2DDD5]/70 hover:text-white px-2.5 py-1.5 bg-black/20 hover:bg-black/40 rounded-lg transition"
                          title="Mark resolved without sending text"
                        >
                          Resolve without Reply
                        </button>

                        <button
                          onClick={() => handleSendResponse(h.id)}
                          disabled={!replyInputs[h.id]?.trim()}
                          className="text-xs bg-[#B8912E] hover:bg-[#d1a73d] disabled:opacity-40 text-[#0E3F3A] font-bold px-3.5 py-1.5 rounded-lg transition shadow-xs flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Reply & Sync</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#E2DDD5]/70 italic bg-black/10 p-3 rounded-xl border border-white/5">
                No pending requests right now. The Concierge answered every question from the data.
              </p>
            )}
          </div>
        )}

        {/* Tab Content: Resolved Handoffs */}
        {handoffTab === 'resolved' && (
          <div className="space-y-2 pt-1 text-xs">
            {resolvedHandoffs.length > 0 ? (
              resolvedHandoffs.map((h) => (
                <div
                  key={h.id}
                  className="bg-black/20 p-3 rounded-xl border border-white/10 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[10px] text-[#E2DDD5]/60">
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Resolved by Mimo
                    </span>
                    <span className="font-mono">
                      {h.resolvedAt ? new Date(h.resolvedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                    </span>
                  </div>

                  <p className="text-xs text-[#E2DDD5] font-medium">
                    <span className="text-[#B8912E] font-semibold">Question:</span> "{h.clientQuestion}"
                  </p>

                  {h.operatorResponse && (
                    <p className="text-xs text-emerald-200 bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/20 italic">
                      <span className="text-emerald-400 font-semibold not-italic">Mimo's Reply:</span> "{h.operatorResponse}"
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-[#E2DDD5]/70 italic bg-black/10 p-3 rounded-xl border border-white/5">
                No resolved handoff history yet.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Edit Briefing Section */}
      <div className="space-y-3 bg-black/20 p-4 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#B8912E] flex items-center gap-1.5">
            <FileText className="w-4 h-4" />
            {"Edit Today's Briefing"}
          </span>
          <button
            onClick={() => setIsEditingBriefing(!isEditingBriefing)}
            className="text-xs text-white bg-[#145A52] hover:bg-[#1A7067] px-3 py-1 rounded-lg transition font-medium"
          >
            {isEditingBriefing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {isEditingBriefing ? (
          <div className="space-y-3 pt-2 text-xs">
            <div>
              <label className="block text-[11px] text-[#E2DDD5] mb-1">Today's briefing:</label>
              <textarea
                value={briefingEN}
                onChange={(e) => setBriefingEN(e.target.value)}
                rows={4}
                className="w-full p-2.5 bg-[#F7F5F1] text-[#1C2826] rounded-xl border border-white/20 focus:outline-none font-sans"
              />
            </div>

            <button
              onClick={handleSaveBriefing}
              className="w-full py-2.5 bg-[#B8912E] text-[#0E3F3A] font-bold rounded-xl hover:bg-[#d1a73d] transition flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{"Save Briefing"}</span>
            </button>
          </div>
        ) : (
          <p className="text-xs text-[#E2DDD5] italic bg-black/10 p-3 rounded-xl border border-white/5">
            "{briefing.prose}"
          </p>
        )}
      </div>

      {/* Operator Data Actions */}
      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
        <button
          onClick={exportJSON}
          className="flex-1 py-2 px-3 bg-[#145A52] hover:bg-[#1A7067] rounded-xl text-white font-medium flex items-center justify-center gap-1.5 transition border border-white/10"
        >
          <Download className="w-3.5 h-3.5 text-[#B8912E]" />
          <span>{"Export Backup (JSON)"}</span>
        </button>

        <button
          onClick={() => {
            if (confirm('Really restore all data to the original seed version?')) {
              resetAllData();
            }
          }}
          className="py-2 px-3 bg-red-900/30 hover:bg-red-900/50 text-red-200 border border-red-500/30 rounded-xl font-medium flex items-center justify-center gap-1.5 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{"Reset Seed Data"}</span>
        </button>
      </div>

    </div>
  );
};

