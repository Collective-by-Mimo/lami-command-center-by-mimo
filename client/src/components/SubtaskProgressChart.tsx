import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from 'recharts';
import { useApp } from '../context/AppContext';
import { CaseItem, SubTask } from '../types';
import {
  CheckSquare,
  Square,
  Plus,
  CheckCircle2,
  ListTodo,
  PieChart as PieIcon,
  BarChart2,
  Trash2,
  Sparkles
} from 'lucide-react';

interface SubtaskProgressChartProps {
  caseItem: CaseItem;
}

export const SubtaskProgressChart: React.FC<SubtaskProgressChartProps> = ({ caseItem }) => {
  const { language, updateCaseDetails, isOperator, showToast, isRTL } = useApp();
  const [chartType, setChartType] = useState<'donut' | 'bar'>('donut');
  const [newTitle, setNewTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const subtasks = caseItem.subtasks || [];
  const totalCount = subtasks.length;
  const completedCount = subtasks.filter((s) => s.completed).length;
  const pendingCount = totalCount - completedCount;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleToggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = subtasks.map((s) => {
      if (s.id === subtaskId) {
        const nextState = !s.completed;
        return {
          ...s,
          completed: nextState,
          completedAt: nextState ? new Date().toISOString().split('T')[0] : undefined
        };
      }
      return s;
    });

    updateCaseDetails({
      ...caseItem,
      subtasks: updatedSubtasks
    });
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newSubtask: SubTask = {
      id: `st-${Date.now()}`,
      title: newTitle.trim(),
      completed: false
    };

    const updatedSubtasks = [...subtasks, newSubtask];
    updateCaseDetails({
      ...caseItem,
      subtasks: updatedSubtasks
    });

    setNewTitle('');
    setIsAdding(false);
    showToast(
      'New sub-task added!'
    );
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    const updatedSubtasks = subtasks.filter((s) => s.id !== subtaskId);
    updateCaseDetails({
      ...caseItem,
      subtasks: updatedSubtasks
    });
  };

  const handleToggleAll = (complete: boolean) => {
    const updatedSubtasks = subtasks.map((s) => ({
      ...s,
      completed: complete,
      completedAt: complete ? new Date().toISOString().split('T')[0] : undefined
    }));

    updateCaseDetails({
      ...caseItem,
      subtasks: updatedSubtasks
    });
  };

  // Recharts Data formatting
  const pieData = [
    {
      name: 'Completed',
      value: completedCount,
      color: '#145A52'
    },
    {
      name: 'Pending',
      value: pendingCount,
      color: '#E2DDD5'
    }
  ];

  const renderPieData = totalCount === 0
    ? [{ name: 'Sem tarefas', value: 1, color: '#F3F0EA' }]
    : pieData;

  const barData = [
    {
      name: 'Progresso',
      Completed: completedCount,
      Pending: pendingCount
    }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E2DDD5] shadow-sm space-y-5">
      
      {/* Header with Title and View Switcher */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#E2DDD5] pb-3">
        <div className="flex items-center gap-2">
          <ListTodo className="w-5 h-5 text-[#145A52]" />
          <div>
            <h2 className="font-serif-display text-xl font-bold text-[#1C2826]">
              {'Sub-task Progress & Milestones'}
            </h2>
            <span className="text-xs text-[#62726F]">
              {completedCount} of {totalCount} steps completed ({percentage}%)
            </span>
          </div>
        </div>

        {/* View Switcher: Donut vs Bar */}
        <div className="flex items-center gap-1 bg-[#F7F5F1] p-1 rounded-xl border border-[#E2DDD5]">
          <button
            onClick={() => setChartType('donut')}
            className={`p-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
              chartType === 'donut'
                ? 'bg-[#145A52] text-white shadow-xs'
                : 'text-[#62726F] hover:text-[#1C2826]'
            }`}
            title="Donut chart"
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Rosca</span>
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`p-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
              chartType === 'bar'
                ? 'bg-[#145A52] text-white shadow-xs'
                : 'text-[#62726F] hover:text-[#1C2826]'
            }`}
            title="Bar chart"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Barras</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Recharts Chart / Right Stats & Action Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center bg-[#F7F5F1]/60 p-4 rounded-2xl border border-[#E2DDD5]">
        
        {/* Recharts Visualization Column */}
        <div className="md:col-span-5 relative flex items-center justify-center min-h-[170px]">
          {chartType === 'donut' ? (
            <div className="relative w-full h-[170px]">
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie
                    data={renderPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={46}
                    outerRadius={66}
                    paddingAngle={totalCount > 0 ? 4 : 0}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    animationDuration={800}
                  >
                    {renderPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length && totalCount > 0) {
                        const data = payload[0];
                        return (
                          <div className="bg-[#0E3F3A] text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-lg border border-[#B8912E]/40">
                            <span>{data.name}: </span>
                            <span className="text-[#B8912E]">{data.value}</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Text displaying completion % */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-serif-display text-2xl font-bold text-[#145A52]">
                  {percentage}%
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#62726F]">
                  {completedCount}/{totalCount}
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full space-y-2 py-2">
              <span className="text-xs font-bold text-[#145A52] block text-center">
                Progress Distribution ({percentage}%)
              </span>
              <ResponsiveContainer width="100%" height={80}>
                <BarChart
                  data={barData}
                  layout="vertical"
                  margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                >
                  <XAxis type="number" hide domain={[0, totalCount || 1]} />
                  <YAxis type="category" dataKey="name" hide />
                  <Tooltip
                    formatter={(value: any, name: any) => [
                      value,
                      name === 'Completed'
                        ? 'Completed'
                        : 'Pending'
                    ]}
                    contentStyle={{ backgroundColor: '#0E3F3A', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="Completed" stackId="a" fill="#145A52" radius={[6, 0, 0, 6]} />
                  <Bar dataKey="Pending" stackId="a" fill="#E2DDD5" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>

              <div className="flex items-center justify-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#145A52]" />
                  <span className="text-[#1C2826] font-medium">Completed ({completedCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#E2DDD5]" />
                  <span className="text-[#62726F] font-medium">Pending ({pendingCount})</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Breakdown Stats & Direct Quick Toggle Actions */}
        <div className="md:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#145A52] uppercase tracking-wider">
              {'Overall Status'}
            </span>

            {totalCount > 0 && (
              <div className="flex items-center gap-2 text-[11px]">
                <button
                  onClick={() => handleToggleAll(true)}
                  className="text-[#145A52] hover:underline font-semibold"
                >
                  Marcar todas
                </button>
                <span className="text-[#E2DDD5]">|</span>
                <button
                  onClick={() => handleToggleAll(false)}
                  className="text-[#62726F] hover:underline"
                >
                  Clear selection
                </button>
              </div>
            )}
          </div>

          {/* Progress Bar Line */}
          <div className="w-full bg-[#E2DDD5] h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#145A52] to-[#B8912E] h-full transition-all duration-500 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <p className="text-xs text-[#1C2826] leading-relaxed">
            {percentage === 100 ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {'All sub-tasks have been completed!'}
              </span>
            ) : (
              <span>
                {`${pendingCount} milestone(s) remaining for complete closure.`}
              </span>
            )}
          </p>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#145A52] bg-white border border-[#E2DDD5] px-3 py-1.5 rounded-xl hover:bg-[#145A52] hover:text-white transition shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add subtask</span>
          </button>
        </div>
      </div>

      {/* Add New Subtask Form */}
      {isAdding && (
        <form onSubmit={handleAddSubtask} className="bg-[#F7F5F1] p-3.5 rounded-2xl border border-[#E2DDD5] flex items-center gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Type the new subtask description..."
            className="flex-1 p-2 bg-white border border-[#E2DDD5] rounded-xl text-xs text-[#1C2826] focus:outline-none focus:border-[#145A52]"
            autoFocus
          />
          <button
            type="submit"
            disabled={!newTitle.trim()}
            className="bg-[#145A52] text-white px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-[#0E3F3A] transition disabled:opacity-40 shrink-0"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="text-xs text-[#62726F] hover:text-[#1C2826] px-2 py-2"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Interactive Sub-task Checkbox List */}
      <div className="space-y-2 pt-1">
        {subtasks.length > 0 ? (
          subtasks.map((st, index) => {
            const stTitle = st.title;

            return (
              <div
                key={st.id}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  st.completed
                    ? 'bg-emerald-50/60 border-emerald-200/80'
                    : 'bg-[#F7F5F1] border-[#E2DDD5] hover:border-[#145A52]/40'
                }`}
              >
                <div
                  onClick={() => handleToggleSubtask(st.id)}
                  className="flex items-center gap-3 cursor-pointer flex-1 select-none"
                >
                  <button
                    type="button"
                    className="shrink-0 focus:outline-none"
                    aria-label="Toggle completed"
                  >
                    {st.completed ? (
                      <CheckSquare className="w-5 h-5 text-[#145A52] fill-[#145A52]/10" />
                    ) : (
                      <Square className="w-5 h-5 text-[#62726F]" />
                    )}
                  </button>

                  <span
                    className={`text-xs font-medium transition ${
                      st.completed
                        ? 'line-through text-emerald-950 font-semibold'
                        : 'text-[#1C2826]'
                    }`}
                  >
                    {stTitle}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {st.completedAt && (
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                      {st.completedAt}
                    </span>
                  )}

                  {isOperator && (
                    <button
                      onClick={() => handleDeleteSubtask(st.id)}
                      className="text-[#62726F] hover:text-red-600 p-1 rounded-lg transition"
                      title="Delete sub-task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-4 bg-[#F7F5F1]/50 rounded-2xl border border-dashed border-[#E2DDD5] text-xs text-[#62726F]">
            No subtasks recorded for this case yet. Tap "Add subtask" to start mapping the steps.
          </div>
        )}
      </div>

    </div>
  );
};
