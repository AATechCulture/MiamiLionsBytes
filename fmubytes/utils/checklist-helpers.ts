//utils/checklist-helpers.ts
import { z } from "zod";
import { colors } from '@/theme/colors'


// Define Zod schema for structured output
const ChecklistItemSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    priority: z.enum(['high', 'medium', 'low']),
    timeframe: z.enum(['immediate', 'within_week', 'within_month']),
    category: z.enum(['documentation', 'consultation', 'filing', 'action'])
});

export const ChecklistSchema = z.object({
    items: z.array(ChecklistItemSchema),
    summary: z.string()
});


// First, let's create TypeScript types from the Zod schemas
type ChecklistItem = z.infer<typeof ChecklistItemSchema>;

// Now update the helper functions with proper typing
const priorityLabels = {
    high: "Urgent Priority",
    medium: "Normal Priority",
    low: "Low Priority"
} as const;

const timeframeLabels = {
    immediate: "Needs Immediate Attention",
    within_week: "Complete Within a Week",
    within_month: "Complete Within a Month"
} as const;

const categoryLabels = {
    documentation: "Document Preparation",
    consultation: "Legal Consultation",
    filing: "Court Filing",
    action: "Legal Action Required"
} as const;

// Updated helper functions with correct typing
export const getFriendlyPriority = (priority: ChecklistItem["priority"]) =>
    priorityLabels[priority];

export const getFriendlyTimeframe = (timeframe: ChecklistItem["timeframe"]) =>
    timeframeLabels[timeframe];

export const getFriendlyCategory = (category: ChecklistItem["category"]) =>
    categoryLabels[category];

// Using the correct color references from your theme
export const priorityColors = {
    high: colors.status.error, // Using defined status.error
    medium: colors.status.warning, // Using defined status.warning
    low: colors.status.info // Using defined status.info
} as const;

export const categoryColors = {
    documentation: colors.primary, // Using primary (was lightBlue)
    consultation: colors.text, // Using text (was mediumPurple)
    filing: colors.primaryDark, // Using primaryDark (was darkPurple)
    action: colors.accent // Using accent (was brightRed)
} as const;

export const getPriorityColor = (priority: ChecklistItem["priority"]) =>
    priorityColors[priority];

export const getCategoryColor = (category: ChecklistItem["category"]) =>
    categoryColors[category];

// Complete helper function
export const getItemDisplayProperties = (item: ChecklistItem) => ({
    ...item,
    priorityLabel: getFriendlyPriority(item.priority),
    priorityColor: getPriorityColor(item.priority),
    timeframeLabel: getFriendlyTimeframe(item.timeframe),
    categoryLabel: getFriendlyCategory(item.category),
    categoryColor: getCategoryColor(item.category)
});

// Type for the return value of getItemDisplayProperties
export type ChecklistItemDisplay = ReturnType<typeof getItemDisplayProperties>;