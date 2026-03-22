// ─────────────────────────────────────────────────────────────
// pages/Home.jsx — Main page
//
// HOW DATA FLOWS IN YOUR BACKEND:
//
//   1. You create a Title  → POST /Title  { title, content }
//   2. You create a Post   → POST /posts?parent_id=ID  { title, content }
//   3. To see everything   → GET /titile/:id/allposts  per title
//
// Because your backend has no "get ALL titles" or "get ALL posts"
// endpoint, this page:
//   - Keeps a local list of titles (added during the session)
//   - Fetches posts per title when a title is added or on load
//   - Stores everything in local state
//
// ✏️  EDIT THIS FILE when:
//   - You want to add a new section to the page
//   - You want to add search or filters
// ─────────────────────────────────────────────────────────────
import { useState,useEffect } from 'react';
import { createTitle, createPost, deleteTitle, getTitleWithPosts,getAllTitles } from '../api';
import TitleGroup  from '../components/TitleGroup';
import DeleteModal from '../components/DeleteModal';

export default function Home({ toast }) {

  // ── All titles with their posts ───────────────────────────
  // Shape: [{ id, title, content, posts: [] }]
  const [groups, setGroups] = useState([]);

  // ── "Create Title" form ───────────────────────────────────
  const [newTitleName,    setNewTitleName]    = useState('');
  const [newTitleContent, setNewTitleContent] = useState('');
  const [addingTitle,     setAddingTitle]     = useState(false);

  // ── "Create Post" form ────────────────────────────────────
  const [postParentId,  setPostParentId]  = useState('');
  const [postTitle,     setPostTitle]     = useState('');
  const [postContent,   setPostContent]   = useState('');
  const [addingPost,    setAddingPost]    = useState(false);

  // ── Delete modal ──────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState(null);  // { id, title }
  const [deletingId,   setDeletingId]   = useState(null);
  // ── Load all data from DB on page load / refresh ──────────
  useEffect(() => {
    const loadAll = async () => {
      try {
        const data = await getAllTitles();
        setGroups(data.map(item => ({
          id:      item.id,
          title:   item.title,
          content: item.content,
          posts:   item.posts || [],
        })));
      } catch (e) {
        toast(e.message, 'error');
      }
    };
    loadAll();
  }, []); // [] means run once when page first opens

  


  // ── Helper: fetch posts for a title and update state ─────
  const loadTitlePosts = async (titleId) => {
    try {
      const data = await getTitleWithPosts(titleId);
      // data = { titile: { id, title, content }, posts: [...] }
      setGroups(prev => {
        const exists = prev.find(g => g.id === titleId);
        const updated = {
          id:      data.titile.id,
          title:   data.titile.title,
          content: data.titile.content,
          posts:   data.posts || [],
        };
        if (exists) return prev.map(g => g.id === titleId ? updated : g);
        return [...prev, updated];
      });
    } catch (e) {
      toast(e.message, 'error');
    }
  };


  // ── Create a new title ────────────────────────────────────
  const handleAddTitle = async () => {
    if (!newTitleName.trim()) return;
    setAddingTitle(true);
    try {
      const created = await createTitle(newTitleName.trim(), newTitleContent.trim());
      // Add it to our groups list with empty posts
      setGroups(prev => [...prev, {
        id:      created.id,
        title:   created.title,
        content: created.content,
        posts:   [],
      }]);
      toast(`Title "${created.title}" created!`);
      setNewTitleName('');
      setNewTitleContent('');
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setAddingTitle(false);
    }
  };


  // ── Create a new post ─────────────────────────────────────
  const handleAddPost = async () => {
    if (!postParentId || !postContent.trim()) return;
    setAddingPost(true);
    try {
      const created = await createPost(
        Number(postParentId),
        postTitle.trim(),
        postContent.trim()
      );
      // Add new post directly into the right group (no refetch needed)
      setGroups(prev => prev.map(g =>
        g.id === Number(postParentId)
          ? { ...g, posts: [...g.posts, created] }
          : g
      ));
      toast('Post published!');
      setPostTitle('');
      setPostContent('');
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setAddingPost(false);
    }
  };


  // ── Delete a title ────────────────────────────────────────
  const handleDeleteConfirm = async (forced) => {
    setDeletingId(deleteTarget.id);
    try {
      await deleteTitle(deleteTarget.id, forced);
      setGroups(prev => prev.filter(g => g.id !== deleteTarget.id));
      toast(`"${deleteTarget.title}" deleted!`);
      setDeleteTarget(null);
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setDeletingId(null);
    }
  };


  // ── Optimistic post update (no refetch) ───────────────────
  const handlePostUpdated = (postId, newTitle, newContent) => {
    setGroups(prev => prev.map(g => ({
      ...g,
      posts: g.posts.map(p =>
        p.post_id === postId
          ? { ...p, title: newTitle, content: newContent }
          : p
      ),
    })));
  };


  // ── Optimistic post delete (no refetch) ──────────────────
  const handlePostDeleted = (postId) => {
    setGroups(prev => prev.map(g => ({
      ...g,
      posts: g.posts.filter(p => p.post_id !== postId),
    })));
  };


  // ── Render ────────────────────────────────────────────────
  return (
    <>
      {/* Delete confirmation modal */}
      {deleteTarget && (
        <DeleteModal
          titleName={deleteTarget.title}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          loading={!!deletingId}
        />
      )}

      {/* ══ CREATE TITLE FORM ══════════════════════════════ */}
      <div className="card">
        <p className="card-label">New Title</p>

        <div className="form-row" style={{ marginBottom: 10 }}>
          <div className="form-group">
            <label htmlFor="title-name">Title name *</label>
            <input
              id="title-name"
              type="text"
              value={newTitleName}
              placeholder="e.g. Gaming, Science, News…"
              onChange={e => setNewTitleName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddTitle()}
              disabled={addingTitle}
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 12 }}>
          <label htmlFor="title-content">Description (optional)</label>
          <input
            id="title-content"
            type="text"
            value={newTitleContent}
            placeholder="A short description of this community…"
            onChange={e => setNewTitleContent(e.target.value)}
            disabled={addingTitle}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleAddTitle}
          disabled={addingTitle || !newTitleName.trim()}
        >
          {addingTitle && <span className="spinner" />}
          {addingTitle ? 'Creating…' : '+ Create Title'}
        </button>
      </div>


      {/* ══ CREATE POST FORM ════════════════════════════════ */}
      <div className="card">
        <p className="card-label">New Post</p>

        <div className="form-row" style={{ marginBottom: 10 }}>
          <div className="form-group">
            <label htmlFor="post-parent">Post under *</label>
            <select
              id="post-parent"
              value={postParentId}
              onChange={e => setPostParentId(e.target.value)}
              disabled={addingPost}
            >
              <option value="">— select a title —</option>
              {groups.map(g => (
                <option key={g.id} value={g.id}>{g.title}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="post-title">Post title (optional)</label>
            <input
              id="post-title"
              type="text"
              value={postTitle}
              placeholder="Give your post a title…"
              onChange={e => setPostTitle(e.target.value)}
              disabled={addingPost}
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 12 }}>
          <label htmlFor="post-content">Content *</label>
          <textarea
            id="post-content"
            value={postContent}
            placeholder="What's on your mind?"
            onChange={e => setPostContent(e.target.value)}
            disabled={addingPost}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleAddPost}
          disabled={addingPost || !postParentId || !postContent.trim()}
        >
          {addingPost && <span className="spinner" />}
          {addingPost ? 'Posting…' : 'Post'}
        </button>
      </div>


      {/* ══ TITLES & POSTS FEED ═════════════════════════════ */}
      <div className="divider">All Titles & Posts</div>

      {groups.length === 0 ? (
        <div className="state-box">
          <span className="state-icon">📭</span>
          <span>No titles yet — create one above to get started!</span>
        </div>
      ) : (
        groups.map(group => (
          <TitleGroup
            key={group.id}
            group={group}
            onDeleteTitle={setDeleteTarget}
            onPostUpdated={handlePostUpdated}
            onPostDeleted={handlePostDeleted}
            deletingId={deletingId}
            toast={toast}
          />
        ))
      )}
    </>
  );
}
