"use client";

import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import useFetch from "@/hooks/useFetch";
import useSubmit from "@/hooks/useSubmit";
import styles from "../../public/assets/css/dashboard/blog-management.module.css";

const categories = [
  "New car review",
  "First Drives",
  "Technology",
  "Races and chases",
  "Recalls",
];

const initialPost = {
  title: "",
  category: "New car review",
  excerpt: "",
  content: "",
  imageFile: null,
  imagePreview: "",
  imagePath: "",
  isFeatured: false,
  authorName: "Admin",
};

const slugify = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");

const statusBadgeClass = (status) =>
  status === "published" ? styles.badgePublished : styles.badgeDraft;

const BlogManagement = () => {
  const [post, setPost] = useState(initialPost);
  const [editingId, setEditingId] = useState(null);
  const { data, loading, refetch } = useFetch("/blogs", { immediate: true });
  const { submit, loading: saving } = useSubmit();

  const blogs = useMemo(() => (Array.isArray(data?.data) ? data.data : []), [data]);

  const resetForm = () => {
    setPost(initialPost);
    setEditingId(null);
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose a valid image file");
      return;
    }

    setPost((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
      imagePath: "",
    }));
  };

  const handleRemoveImage = () => {
    setPost((prev) => ({
      ...prev,
      imageFile: null,
      imagePreview: "",
      imagePath: "",
    }));
  };

  const savePost = async (status) => {
    const title = post.title.trim();
    const content = post.content.trim();

    if (!title) {
      toast.error("Post title is required");
      return;
    }

    if (!content) {
      toast.error("Article content is required");
      return;
    }

    // Check if image is provided (either new file or existing path)
    if (!post.imageFile && !post.imagePath) {
      toast.error("Featured image is mandatory - please upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slugify(title));
    formData.append("category", post.category);
    formData.append("excerpt", post.excerpt.trim());
    formData.append("content", content);
    formData.append("status", status);
    formData.append("is_featured", post.isFeatured ? "1" : "0");
    formData.append("author_name", post.authorName.trim() || "Admin");

    if (post.imageFile) {
      formData.append("image", post.imageFile);
    }

    if (post.imagePath) {
      formData.append("existing_image_path", post.imagePath);
    }

    const endpoint = editingId ? `/blogs/${editingId}` : "/blogs";
    const method = editingId ? "PUT" : "POST";

    const response = await submit(endpoint, formData, { method });

    if (!response) {
      return;
    }

    toast.success(editingId ? "Blog updated" : "Blog created");
    resetForm();
    refetch("/blogs");
  };

  const handleEdit = (blog) => {
    setEditingId(blog.id);
    setPost({
      title: blog.title || "",
      category: blog.category || "New car review",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      imageFile: null,
      imagePreview: blog.image_url || "",
      imagePath: blog.image_path || "",
      isFeatured: Boolean(blog.is_featured),
      authorName: blog.author_name || "Admin",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this blog post?");
    if (!confirmed) {
      return;
    }

    const response = await submit(`/blogs/${id}`, {}, { method: "DELETE" });
    if (!response) {
      return;
    }

    toast.success("Blog deleted");

    if (editingId === id) {
      resetForm();
    }

    refetch("/blogs");
  };

  return (
    <div className={styles.adminContainer}>
      <header className={styles.adminHeader}>
        <div>
          <h1>{editingId ? "Edit Blog Post" : "Create New Post"}</h1>
          <p>Draft and publish automotive content from your CMS dashboard</p>
        </div>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() => savePost("draft")}
            disabled={saving}
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => savePost("published")}
            className={styles.btnPrimary}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Update & Publish"
                : "Publish Post"}
          </button>
        </div>
      </header>

      <form
        className={styles.editorLayout}
        onSubmit={(event) => event.preventDefault()}
      >
        <div className={styles.mainEditor}>
          <div className={styles.inputGroup}>
            <label>Post Title</label>
            <input
              type="text"
              placeholder="e.g. Alfa Romeo will drop the offset plate"
              className={styles.titleInput}
              value={post.title}
              onChange={(event) =>
                setPost((prev) => ({ ...prev, title: event.target.value }))
              }
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Excerpt (Short Summary)</label>
            <textarea
              placeholder="Brief description for the blog list page..."
              className={styles.excerptInput}
              value={post.excerpt}
              onChange={(event) =>
                setPost((prev) => ({ ...prev, excerpt: event.target.value }))
              }
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Article Content</label>
            <textarea
              placeholder="Start writing your story..."
              className={styles.contentInput}
              value={post.content}
              onChange={(event) =>
                setPost((prev) => ({ ...prev, content: event.target.value }))
              }
            />
          </div>
        </div>

        <aside className={styles.editorSidebar}>
          <div className={styles.sidebarCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Post Settings</h3>
              <span className={styles.statusBadge}>
                {editingId ? "Editing" : "New"}
              </span>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.fieldLabel}>Category</label>
              <select
                className={styles.selectInput}
                value={post.category}
                onChange={(event) =>
                  setPost((prev) => ({ ...prev, category: event.target.value }))
                }
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.fieldLabel}>Author</label>
              <input
                type="text"
                className={styles.selectInput}
                value={post.authorName}
                onChange={(event) =>
                  setPost((prev) => ({
                    ...prev,
                    authorName: event.target.value,
                  }))
                }
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.fieldLabel}>Featured Image <span style={{ color: "red" }}>*</span></label>
              <div className={styles.imageUploadWrapper}>
                {post.imagePreview ? (
                  <div className={styles.previewContainer}>
                    <img
                      src={post.imagePreview}
                      alt="Preview"
                      className={styles.imagePreview}
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className={styles.removeImgBtn}
                    >
                      x
                    </button>
                  </div>
                ) : (
                  <label className={styles.uploadPlaceholder}>
                    <div className={styles.uploadIcon}>📸</div>
                    <span>Upload Hero Image (Required)</span>
                    <small>JPG, PNG, WEBP or GIF</small>
                    <input
                      type="file"
                      className={styles.fileHidden}
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="featured"
                checked={post.isFeatured}
                onChange={(event) =>
                  setPost((prev) => ({
                    ...prev,
                    isFeatured: event.target.checked,
                  }))
                }
              />
              <label htmlFor="featured" className={styles.checkboxText}>
                Featured Post
              </label>
            </div>

            {editingId ? (
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={resetForm}
                style={{ width: "100%", marginTop: "12px" }}
              >
                Cancel Editing
              </button>
            ) : null}
          </div>

          <div className={`${styles.sidebarCard} ${styles.seoCard}`}>
            <h3 className={styles.cardTitle}>Search Engine Preview</h3>
            <div className={styles.seoPreviewBox}>
              <span className={styles.googleUrl}>
                autodecar.com/blog/{slugify(post.title) || "pending"}
              </span>
              <h4 className={styles.googleTitle}>
                {post.title || "Your Post Title Here"}
              </h4>
              <p className={styles.googleDesc}>
                {post.excerpt ||
                  "Add a meta description to preview how this post appears in search results."}
              </p>
            </div>
          </div>
        </aside>
      </form>

      <section className={styles.blogListSection}>
        <div className={styles.blogListHeader}>
          <h2>All Posts</h2>
          <span>{loading ? "Loading..." : `${blogs.length} post(s)`}</span>
        </div>

        {!loading && !blogs.length ? (
          <div className={styles.emptyState}>No blog posts yet.</div>
        ) : (
          <div className={styles.blogListTableWrap}>
            <table className={styles.blogListTable}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog.id}>
                    <td>{blog.title}</td>
                    <td>{blog.category || "-"}</td>
                    <td>
                      <span
                        className={`${styles.statusPill} ${statusBadgeClass(blog.status)}`}
                      >
                        {blog.status || "draft"}
                      </span>
                    </td>
                    <td>
                      {blog.updated_at
                        ? new Date(blog.updated_at).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>
                      <div className={styles.rowActions}>
                        <button type="button" onClick={() => handleEdit(blog)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(blog.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default BlogManagement;
