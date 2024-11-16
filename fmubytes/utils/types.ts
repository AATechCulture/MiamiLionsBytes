// types.ts
export type ChecklistItemTimeframe = 'immediate' | 'within_week' | 'within_month';
export type ChecklistItemPriority = 'high' | 'medium' | 'low';
export type ChecklistItemCategory = 'documentation' | 'consultation' | 'filing' | 'action';

// types.ts
export type ChecklistItem = {
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    timeframe: 'immediate' | 'within_week' | 'within_month';
    category: 'documentation' | 'consultation' | 'filing' | 'action';
};

export type Checklist = {
    items: ChecklistItem[];
    summary: string;
};

export type ChecklistProps = {
    checklist: Checklist;
};