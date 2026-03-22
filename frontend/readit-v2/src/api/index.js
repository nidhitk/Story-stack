// ─────────────────────────────────────────────────────────────
// api/index.js — All backend API calls
//
// Mapped exactly to your FastAPI backend:
//
//  POST   /Title                          createTitle(title, content)
//  POST   /posts?parent_id=ID             createPost(parentId, title, content)
//  GET    /titile/:id/allposts            getTitleWithPosts(titleId)
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

// ── Internal helper (don't export this) ──────────────────────
async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || `Error ${response.status}`);
  }

  return response.status === 204 ? null : response.json();
}


// ── TITLES ────────────────────────────────────────────────────

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
export async function createPost(parentId, title, content) {
  return request(`/posts?parent_id=${parentId}`, {
    method: 'POST',
    body: JSON.stringify({ title, content }),
  });
}

// PATCH /editposts?post_id=ID
// Your backend schema: postupdate { title?, content? }
export async function editPost(postId, { title, content }) {
  return request(`/editposts?post_id=${postId}`, {
    method: 'PATCH',
    body: JSON.stringify({ title, content }),
  });
}

// DELETE /deletepost?post_id=ID
export async function deletePost(postId) {
  return request(`/deletepost?post_id=${postId}`, {
    method: 'DELETE',
  });
}
