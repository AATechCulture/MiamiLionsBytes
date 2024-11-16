// @/store/constants.ts

import { SuggestedQuestion } from "@/components/ChatBot/types";

export const  SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
    {
        text: "Case Status",
        query: "What is the current status of my case?",
        icon: "briefcase",
        gradientColors: ['#4A90E2', '#63B8FF']
    },
    {
        text: "Legal Advice",
        query: "Can I get advice on my legal issue?",
        icon: "hammer",
        gradientColors: ['#F06292', '#F48FB1']
    },
    {
        text: "Document Review",
        query: "Can you review my legal documents?",
        icon: "document",
        gradientColors: ['#FFA07A', '#FFB74D']
    },
    {
        text: "Court Dates",
        query: "When is my next court date?",
        icon: "calendar",
        gradientColors: ['#9575CD', '#B39DDB']
    },
    {
        text: "Lawyer Contact",
        query: "How can I contact my lawyer?",
        icon: "person-outline",
        gradientColors: ['#81C784', '#A5D6A7']
    },
];