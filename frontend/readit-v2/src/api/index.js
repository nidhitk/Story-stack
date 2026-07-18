// ─────────────────────────────────────────────────────────────
// api/index.js — All backend API calls
//
// Mapped exactly to your FastAPI backend:
//
//  POST   /Title                          createTitle(title, content)
//  POST   /posts?parent_id=ID             createPost(parentId, title, content)
//  GET    /titile/:id/allposts            getTitleWithPosts(titleId)
//  GET    /titles                         getAllTitles()
//  PATCH  /editTitle?title_id=ID          editTitle(id, {title, content})
//  PATCH  /editposts?post_id=ID           editPost(id, {title, content})
//  DELETE /deletecontent?titile_id=ID     deleteTitle(id, forced)
//  DELETE /deletepost?post_id=ID          deletePost(id)
//
// ✏️  To add a new API call:
//   1. Write a new async function below (copy any as template)
//   2. Export it
//   3. Import it in the page/component that needs it
// ─────────────────────────────────────────────────────────────

import BASE_URL from '../config';

const ACCESS_TOKEN_KEY = 'storystack_access_token';
const REFRESH_TOKEN_KEY = 'storystack_refresh_token';

export function getStoredToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getStoredRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function storeToken(accessToken, refreshToken = null) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
}

export function clearStoredToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// ── Internal helper (don't export this) ──────────────────────
async function request(path, options = {}) {
  const { authToken, headers, ...fetchOptions } = options;
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
    ...fetchOptions,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || `Error ${response.status}`);
  }

  return response.status === 204 ? null : response.json();
}


// ── TITLES ────────────────────────────────────────────────────

export async function loginUser(username, password) {
  const body = new URLSearchParams();
  body.set('username', username);
  body.set('password', password);

  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || `Error ${response.status}`);
  }

  return response.json();
}

export async function registerUser(username, email, password) {
  const data = await request('/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  });

  if (data?.message && data.message !== 'user created') {
    throw new Error(data.message);
  }

  return data;
}

// POST /Title
// Your backend schema: ParentContent { title, content }
export async function createTitle(title, content) {
  return request('/Title', {
    method: 'POST',
    body: JSON.stringify({ title, content }),
  });
}

// GET /titile/:id/allposts   (note: "titile" typo is in your backend)
// Returns: { titile: { id, title, content }, posts: [...] }
export async function getTitleWithPosts(titleId) {
  return request(`/titile/${titleId}/allposts`);
}

// PATCH /editTitle?title_id=ID
// Your backend schema: titleupdate { title?, content? }
export async function editTitle(titleId, { title, content }) {
  return request(`/editTitle?title_id=${titleId}`, {
    method: 'PATCH',
    body: JSON.stringify({ title, content }),
  });
}

// DELETE /deletecontent?titile_id=ID&forced_delete=true/false
// forced = true  → deletes title AND all its posts
// forced = false → only deletes if no posts exist under it
export async function deleteTitle(titleId, forced = false) {
  return request(`/deletecontent?titile_id=${titleId}&forced_delete=${forced}`, {
    method: 'DELETE',
  });
}


// ── POSTS ─────────────────────────────────────────────────────

// POST /posts?parent_id=ID
// Your backend schema: ChildContent { title, content }
export async function createPost(parentId, title, content, authToken) {
  return request(`/posts?parent_id=${parentId}`, {
    method: 'POST',
    authToken,
    body: JSON.stringify({ title, content }),
  });
}

// PATCH /editposts?post_id=ID
// Your backend schema: postupdate { title?, content? }
export async function editPost(postId, { title, content }, authToken) {
  return request(`/editposts?post_id=${postId}`, {
    method: 'PATCH',
    authToken,
    body: JSON.stringify({ title, content }),
  });
}

// DELETE /deletepost?post_id=ID
export async function deletePost(postId, authToken) {
  return request(`/deletepost?post_id=${postId}`, {
    method: 'DELETE',
    authToken,
  });
}

// GET /titles — fetch all titles with their posts (used on page load)
export async function getAllTitles() {
  return request('/titles');
}
