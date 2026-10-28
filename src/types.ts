export type PageTab = 'home' | 'about' | 'services' | 'industries' | 'careers' | 'contact' | 'workspace';

export type AIPersona = 'general' | 'architect' | 'strategist' | 'auditor';

export interface GroundingSource {
  title: string;
  url: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
  sources?: GroundingSource[];
  isGrounded?: boolean;
}

export type WorkspaceMode = 'general' | 'research' | 'coding' | 'business' | 'documents';
export type WorkspaceModel = 'auto' | 'fast' | 'deep';

export interface AttachedFile {
  name: string;
  mime: string;
  data: string; // base64
  text?: string;
  size?: number;
}

export interface WorkspaceConversation {
  id: string;
  title: string;
  mode: WorkspaceMode;
  persona?: AIPersona;
  enableSearch?: boolean;
  messages: ChatMessage[];
  created: number;
  updated: number;
}

export interface ServiceItem {
  id: string;
  num: string;
  tag: 'AI SERVICE' | 'SOFTWARE';
  name: string;
  desc: string;
  icon: string;
}

export interface IndustryItem {
  id: string;
  icon: string;
  name: string;
  challenge: string;
  solution: string;
  color: string;
}

export interface JobOpening {
  id: string;
  title: string;
  location: string;
  type: string;
  experience: string;
  emailSubject: string;
}
