export interface V2EXPost {
  id: number;
  title: string;
  url: string;
  content: string;
  content_rendered: string;
  member: {
    id: number;
    username: string;
    avatar_large: string;
  };
  node: {
    id: number;
    name: string;
    title: string;
  };
  replies: number;
  created: number;
  last_modified: number;
}

export interface V2EXReply {
  id: number;
  content: string;
  content_rendered: string;
  member: {
    id: number;
    username: string;
    avatar_large: string;
  };
  created: number;
}

export interface V2EXResponse {
  success: boolean;
  message?: string;
  data?: V2EXPost[];
}