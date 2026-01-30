import { useEffect, useState } from "react";
import "./App.css";

const SafeImage = ({ src, alt }) => {
  const [error, setError] = useState(false);

  if (!src || error) return null;

  return (
    <div
      style={{
        width: 200,
        height: 200,
        overflow: "hidden",
        borderRadius: 6,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        src={src}
        alt={alt}
        onError={() => setError(true)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
    </div>
  );
};

function App() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newText, setNewText] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  async function loadComments() {
    try {
      const res = await fetch("http://127.0.0.1:8000/comments");
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadComments();
  }, []);

  async function createComment() {
    const text = newText.trim();
    if (!text) return;

    try {
      await fetch("http://127.0.0.1:8000/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, author: "Admin" }),
      });
      setNewText("");
      await loadComments();
    } catch (err) {
      console.error(err);
    }
  }

  async function startEdit(comment) {
    const id = comment.id;
    setEditingId(id);
    setEditText(comment.text || "");
  }

  async function cancelEdit() {
    setEditingId(null);
    setEditText("");
  }

  async function saveEdit(id) {
    const text = editText.trim();

    if (!text) return;

    try {
      await fetch(`http://127.0.0.1:8000/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      cancelEdit();
      await loadComments();
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteComment(comment) {
    const id = comment.id;
    try {
      await fetch(`http://127.0.0.1:8000/comments/${id}`, {
        method: "DELETE",
      });
      setComments((prev) => prev.filter((c) => (c.comment_id ?? c.id) !== id));
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  return (
    <div class={"center-div"} style={{ margin: "auto", padding: 20 }}>
      <h1>All Comments</h1>
      <input
        value={newText}
        onChange={(e) => setNewText(e.target.value)}
        placeholder="New comment (Admin)"
      />
      <button class="add-button" onClick={createComment}>
        Add
      </button>
      {comments.map((comment) => (
        <div
          key={comment.id}
          style={{
            border: "1px solid #ddd",
            padding: 12,
            marginBottom: 12,
            borderRadius: 7,
          }}
        >
          <div style={{ fontWeight: "bold" }}>{comment.author}</div>
          <div style={{ marginTop: 6 }}>
            {editingId === comment.id ? (
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
            ) : (
              comment.text
            )}
          </div>
          <div
            style={{ marginTop: 2, display: "flex", justifyContent: "center" }}
          >
            <SafeImage src={comment.image} alt="Comment Picture" />
          </div>
          <div class="container">
            <div
              class="left-item"
              style={{ fontSize: 12, color: "#666", marginTop: 6 }}
            >
              {new Date(comment.created_at).toLocaleString()}
            </div>
            <div class="right-item">👍🏻{comment.likes}</div>
            {editingId === comment.id ? (
              <>
                <button class="add-button" onClick={() => saveEdit(comment.id)}>
                  Save
                </button>
                <button class="delete-button" onClick={cancelEdit}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  class="action-button"
                  onClick={() => startEdit(comment)}
                >
                  Edit
                </button>
                <button
                  class="delete-button"
                  onClick={() => deleteComment(comment)}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
