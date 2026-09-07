export interface Participant {
  id: number;
  meeting_id: number;
  name: string;
  email: string | null;
}

export interface TranscriptLine {
  id: number;
  meeting_id: number;
  speaker: string;
  text: string;
  start_time: number;
  end_time: number;
  sequence: number;
}

export interface ActionItem {
  id: number;
  meeting_id: number;
  text: string;
  assignee: string | null;
  due_date: string | null;
  completed: boolean;
  created_at: string;
}

export interface Summary {
  id: number;
  meeting_id: number;
  overview: string | null;
  key_topics: string | null;  // JSON string: {title, description}[]
  chapters: string | null;    // JSON string: {title, start_time}[]
  created_at: string;
}

export interface MeetingListItem {
  id: number;
  title: string;
  date: string;
  duration: number;
  participant_count: number;
  participants: Participant[];
  transcript_line_count: number;
  created_at: string;
}

export interface MeetingDetail {
  id: number;
  title: string;
  date: string;
  duration: number;
  participants: Participant[];
  transcript_lines: TranscriptLine[];
  summary: Summary | null;
  action_items: ActionItem[];
  created_at: string;
  updated_at: string;
}

export interface KeyTopic {
  title: string;
  description: string;
}

export interface Chapter {
  title: string;
  start_time: number;
}

export interface MeetingFilters {
  search: string;
  date_from: string;
  date_to: string;
  participant: string;
  sort: "date_desc" | "date_asc";
}
