// ─────────────────────────────────────────────────────────────
// components/TitleGroup.jsx — One title card with all its posts
//
// Your backend Content model has: id, title, content
// Your backend Posts model has:   post_id, title, content, parent_id
//
// ✏️  EDIT THIS FILE when:
//   - You want to add an "Edit Title" button
//   - You want to change the title header layout
//
// Props:
//   group           — { id, title, content, posts: [] }
//   onDeleteTitle   — opens delete confirmation modal
//   onPostUpdated   — updates a post in local state (no refetch)
//   onPostDeleted   — removes a post from local state (no refetch)
//   deletingId      — id of title currently being deleted
//   toast           — notification function
// ─────────────────────────────────────────────────────────────
import PostCard from './PostCard';

export default function TitleGroup({
  group,
  onDeleteTitle,
  onPostUpdated,
  onPostDeleted,
  deletingId,
  toast,
}) {
  const isDeleting = deletingId === group.id;

  return (
    <section className="title-group">

      {/* ── Title header ── */}
      <div className="title-group-header">
        <div>
          <h2 className="title-group-name">
            {group.title}
            <span className="title-group-badge">
              {group.posts.length} {group.posts.length === 1 ? 'post' : 'posts'}
            </span>
          </h2>
          {/* Show title's own content/description if it has one */}
          {group.content && (
            <p className="title-group-desc">{group.content}</p>
          )}
        </div>

        <button
          className="btn btn-danger btn-sm"
          onClick={() => onDeleteTitle({ id: group.id, title: group.title })}
          disabled={isDeleting}
        >
          {isDeleting ? <span className="spinner" /> : '🗑'}
          {isDeleting ? 'Deleting…' : 'Delete title'}
        </button>
      </div>

      {/* ── Posts under this title ── */}
      {group.posts.length === 0 ? (
        <p className="no-posts">No posts yet in this title.</p>
      ) : (
        group.posts.map(post => (
          <PostCard
            key={post.post_id}
            post={post}
            onUpdated={onPostUpdated}
            onDeleted={onPostDeleted}
            toast={toast}
          />
        ))
      )}

    </section>
  );
}
