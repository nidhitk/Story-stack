// ─────────────────────────────────────────────────────────────
// components/PostCard.jsx — A single post
//
// Your backend Posts model has: post_id, title, content, parent_id
//
// ✏️  EDIT THIS FILE when:
//   - You want to show more post fields
//   - You want to change how editing looks
//
// Props:
//   post        — { post_id, title, content, parent_id }
//   onUpdated   — called with (post_id, newTitle, newContent) after edit
//   onDeleted   — called with (post_id) after delete
//   toast       — notification function
// ─────────────────────────────────────────────────────────────
import { useState } from 'react';
import { editPost, deletePost } from '../api';

export default function PostCard({ post, onUpdated, onDeleted, toast }) {
  const [editing,  setEditing]  = useState(false);
  const [draftTitle,   setDraftTitle]   = useState(post.title   || '');
  const [draftContent, setDraftContent] = useState(post.content || '');
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ── Save edited post ──────────────────────────────────────
  const handleSave = async () => {
    if (!draftContent.trim()) return;
    setSaving(true);
    try {
      await editPost(post.post_id, {
        title:   draftTitle.trim()   || undefined,
        content: draftContent.trim() || undefined,
      });
      toast('Post updated!');
      onUpdated(post.post_id, draftTitle.trim(), draftContent.trim());
      setEditing(false);
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // ── Delete this post ──────────────────────────────────────
  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    setDeleting(true);
    try {
      await deletePost(post.post_id);
      toast('Post deleted!');
      onDeleted(post.post_id);
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setDraftTitle(post.title || '');
    setDraftContent(post.content || '');
  };

  return (
    <div className="post-card">
      {editing ? (
        // ── Edit mode ──────────────────────────────────────
        <div className="post-edit-area">
          <div className="form-group" style={{ marginBottom: 8 }}>
            <label>Post title</label>
            <input
              type="text"
              value={draftTitle}
              placeholder="Post title"
              onChange={e => setDraftTitle(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ marginBottom: 8 }}>
            <label>Content</label>
            <textarea
              rows={3}
              value={draftContent}
              placeholder="Post content"
              onChange={e => setDraftContent(e.target.value)}
              autoFocus
            />
          </div>
          <div className="post-edit-actions">
            <button className="btn btn-green btn-sm" onClick={handleSave} disabled={saving || !draftContent.trim()}>
              {saving && <span className="spinner" />}
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={handleCancel} disabled={saving}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        // ── View mode ──────────────────────────────────────
        <>
          {post.title && <p className="post-title">{post.title}</p>}
          <p className="post-content">{post.content}</p>
          <div className="post-footer">
            <span className="post-id">post #{post.post_id}</span>
            <div className="post-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => setEditing(true)}>
                ✏ Edit
              </button>
              <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={deleting}>
                {deleting ? <span className="spinner" /> : '🗑'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
