import axios from 'axios';
import type { V2EXPost, V2EXReply } from '../types';

const BASE_URL = 'https://www.v2ex.com/api';

export async function fetchHotPosts(): Promise<V2EXPost[]> {
  try {
    const response = await axios.get(`${BASE_URL}/topics/hot.json`, {
      headers: {
        'User-Agent': 'V2EX-Fish/0.1.0'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch hot posts:', error);
    return [];
  }
}

export async function fetchLatestPosts(): Promise<V2EXPost[]> {
  try {
    const response = await axios.get(`${BASE_URL}/topics/latest.json`, {
      headers: {
        'User-Agent': 'V2EX-Fish/0.1.0'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch latest posts:', error);
    return [];
  }
}

export async function fetchPostDetail(id: number): Promise<V2EXPost | null> {
  try {
    const response = await axios.get(`${BASE_URL}/topics/show.json?id=${id}`, {
      headers: {
        'User-Agent': 'V2EX-Fish/0.1.0'
      }
    });
    return response.data[0] || null;
  } catch (error) {
    console.error('Failed to fetch post detail:', error);
    return null;
  }
}

export async function fetchReplies(topicId: number): Promise<V2EXReply[]> {
  try {
    const response = await axios.get(`${BASE_URL}/replies/show.json?topic_id=${topicId}`, {
      headers: {
        'User-Agent': 'V2EX-Fish/0.1.0'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch replies:', error);
    return [];
  }
}