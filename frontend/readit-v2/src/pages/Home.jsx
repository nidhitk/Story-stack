import { useEffect, useState } from 'react';
import {
  createTitle,
  createPost,
  deleteTitle,
  getAllTitles,
  getTitleWithPosts,
} from '../api';
import TitleGroup from '../components/TitleGroup';
import DeleteModal from '../components/DeleteModal';

export default function Home({ toast, authToken }) {
  const [groups, setGroups] = useState([]);
  const [newTitleName, setNewTitleName] = useState('');
  const [newTitleContent, setNewTitleContent] = useState('');
  const [addingTitle, setAddingTitle] = useState(false);
  const [postParentId, setPostParentId] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [addingPost, setAddingPost] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const loadAll = async () => {
      try {
        const data = await getAllTitles();
        setGroups(data.map(item => ({
          id: item.id,
          title: item.title,
          content: item.content,
          posts: item.posts || [],
        })));
      } catch (error) {
        toast(error.message, 'error');
      }
    };

    loadAll();
  }, [toast]);

  const loadTitlePosts = async titleId => {
    try {
      const data = await getTitleWithPosts(titleId);
      setGroups(prev => {
        const updated = {
          id: data.titile.id,
          title: data.titile.title,
          content: data.titile.content,
          posts: data.posts || [],
        };
        const exists = prev.some(group => group.id === titleId);
        return exists
          ? prev.map(group => (group.id === titleId ? updated : group))
          : [...prev, updated];
      });
    } catch (error) {
      toast(error.message, 'error');
    }
  };

  const handleAddTitle = async () => {
    if (!newTitleName.trim()) return;

    setAddingTitle(true);
    try {
      const created = await createTitle(newTitleName.trim(), newTitleContent.trim());
      setGroups(prev => [...prev, { ...created, posts: [] }]);
      toast(`Title "${created.title}" created!`);
      setNewTitleName('');
      setNewTitleContent('');
    } catch (error) {
      toast(error.message, 'error');
    } finally {
      setAddingTitle(false);
    }
  };

  const handleAddPost = async () => {
    if (!postParentId || !postContent.trim()) return;
    if (!authToken) {
      toast('Log in before creating a post.', 'error');
      return;
    }

    setAddingPost(true);
    try {
      const created = await createPost(
        Number(postParentId),
        postTitle.trim(),
        postContent.trim(),
        authToken
      );

      setGroups(prev => prev.map(group =>
        group.id === Number(postParentId)
          ? { ...group, posts: [...group.posts, created] }
          : group
      ));
      toast('Post published!');
      setPostTitle('');
      setPostContent('');
    } catch (error) {
      toast(error.message, 'error');
    } finally {
      setAddingPost(false);
    }
  };

  const handleDeleteConfirm = async forced => {
    setDeletingId(deleteTarget.id);
    try {
      await deleteTitle(deleteTarget.id, forced);
      setGroups(prev => prev.filter(group => group.id !== deleteTarget.id));
      toast(`"${deleteTarget.title}" deleted!`);
      setDeleteTarget(null);
    } catch (error) {
      toast(error.message, 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handlePostUpdated = (postId, newTitle, newContent) => {
    setGroups(prev => prev.map(group => ({
      ...group,
      posts: group.posts.map(post =>
        post.post_id === postId
          ? { ...post, title: newTitle, content: newContent }
          : post
      ),
    })));
  };

  const handlePostDeleted = postId => {
    setGroups(prev => prev.map(group => ({
      ...group,
      posts: group.posts.filter(post => post.post_id !== postId),
    })));
  };

  return (
    <>
      {deleteTarget && (
        <DeleteModal
          titleName={deleteTarget.title}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          loading={!!deletingId}
        />
      )}

      <div className="card">
        <p className="card-label">New Title</p>

        <div className="form-row" style={{ marginBottom: 10 }}>
          <div className="form-group">
            <label htmlFor="title-name">Title name *</label>
            <input
              id="title-name"
              type="text"
              value={newTitleName}
              placeholder="e.g. Gaming, Science, News..."
              onChange={event => setNewTitleName(event.target.value)}
              onKeyDown={event => event.key === 'Enter' && handleAddTitle()}
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
            placeholder="A short description of this community..."
            onChange={event => setNewTitleContent(event.target.value)}
            disabled={addingTitle}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleAddTitle}
          disabled={addingTitle || !newTitleName.trim()}
        >
          {addingTitle && <span className="spinner" />}
          {addingTitle ? 'Creating...' : '+ Create Title'}
        </button>
      </div>

      <div className="card">
        <p className="card-label">New Post</p>

        <div className="form-row" style={{ marginBottom: 10 }}>
          <div className="form-group">
            <label htmlFor="post-parent">Post under *</label>
            <select
              id="post-parent"
              value={postParentId}
              onChange={event => setPostParentId(event.target.value)}
              disabled={addingPost || !authToken}
            >
              <option value="">- select a title -</option>
              {groups.map(group => (
                <option key={group.id} value={group.id}>{group.title}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="post-title">Post title (optional)</label>
            <input
              id="post-title"
              type="text"
              value={postTitle}
              placeholder="Give your post a title..."
              onChange={event => setPostTitle(event.target.value)}
              disabled={addingPost || !authToken}
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 12 }}>
          <label htmlFor="post-content">Content *</label>
          <textarea
            id="post-content"
            value={postContent}
            placeholder={authToken ? "What's on your mind?" : 'Log in to write a post'}
            onChange={event => setPostContent(event.target.value)}
            disabled={addingPost || !authToken}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleAddPost}
          disabled={addingPost || !authToken || !postParentId || !postContent.trim()}
        >
          {addingPost && <span className="spinner" />}
          {addingPost ? 'Posting...' : 'Post'}
        </button>
      </div>

      <div className="divider">All Titles & Posts</div>

      {groups.length === 0 ? (
        <div className="state-box">
          <span className="state-icon">📭</span>
          <span>No titles yet - create one above to get started!</span>
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
            authToken={authToken}
            onRefreshTitle={loadTitlePosts}
          />
        ))
      )}
    </>
  );
}
