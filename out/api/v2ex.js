"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchHotPosts = fetchHotPosts;
exports.fetchLatestPosts = fetchLatestPosts;
exports.fetchPostDetail = fetchPostDetail;
exports.fetchReplies = fetchReplies;
const axios_1 = __importDefault(require("axios"));
const BASE_URL = 'https://www.v2ex.com/api';
async function fetchHotPosts() {
    try {
        const response = await axios_1.default.get(`${BASE_URL}/topics/hot.json`, {
            headers: {
                'User-Agent': 'V2EX-Fish/0.1.0'
            }
        });
        return response.data;
    }
    catch (error) {
        console.error('Failed to fetch hot posts:', error);
        return [];
    }
}
async function fetchLatestPosts() {
    try {
        const response = await axios_1.default.get(`${BASE_URL}/topics/latest.json`, {
            headers: {
                'User-Agent': 'V2EX-Fish/0.1.0'
            }
        });
        return response.data;
    }
    catch (error) {
        console.error('Failed to fetch latest posts:', error);
        return [];
    }
}
async function fetchPostDetail(id) {
    try {
        const response = await axios_1.default.get(`${BASE_URL}/topics/show.json?id=${id}`, {
            headers: {
                'User-Agent': 'V2EX-Fish/0.1.0'
            }
        });
        return response.data[0] || null;
    }
    catch (error) {
        console.error('Failed to fetch post detail:', error);
        return null;
    }
}
async function fetchReplies(topicId) {
    try {
        const response = await axios_1.default.get(`${BASE_URL}/replies/show.json?topic_id=${topicId}`, {
            headers: {
                'User-Agent': 'V2EX-Fish/0.1.0'
            }
        });
        return response.data;
    }
    catch (error) {
        console.error('Failed to fetch replies:', error);
        return [];
    }
}
//# sourceMappingURL=v2ex.js.map