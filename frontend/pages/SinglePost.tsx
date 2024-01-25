import React, { SyntheticEvent, useEffect, useState } from 'react';
import { Navigate, useParams, useNavigate } from "react-router-dom";
import { Post, postExample } from '../components/Post';
import ConfirmModal from '../components/ConfirmModal';
import "./SinglePost.css"

const SinglePost = (props: { username: string }) => {
  const username = props.username;
  const { id } = useParams();
  const [post, setPost] = useState<Post>(postExample);

  const [commentText, setCommentText] = useState('');
  const [reload, setReload] = useState(false);
  const [deleteDialog, showDeleteDialog] = useState(false);
  const [delCommentDialog, showDelCommentDialog] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    (
      async () => {

        const response = await fetch('http://localhost:8000/api/singlepost?' + new URLSearchParams({
          postID: String(id),
        }), {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        const content = await response.json();

        setPost(content);
      }
    )();
  }, []);

  const newComment = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!username) return;

    console.log("commentText: " + commentText);
    console.log("POSTING COMMENT NOW");

    const response = await fetch('http://localhost:8000/api/newcomment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        username,
        bodyText: commentText,
        postID: id,
      })
    });

    const content = await response.json();
    console.log("CREATED COMMENT: " + JSON.stringify(content));
    if (content.message == "success") {
      setReload(true);
    }
  }

  const deletePost = async (e: SyntheticEvent) => {
    e.preventDefault();
    console.log("DELETING POST NOW");
    const response = await fetch('http://localhost:8000/api/deletepost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        postID: id,
      })
    });

    const content = await response.json();
    console.log(content);
    if (content.message == "success") {
      setRedirect(true)
    }
  }

  const deleteComment = async (e: SyntheticEvent, commentId: number) => {
    e.preventDefault();
    console.log("DELETING COMMENT NOW");
    const response = await fetch('http://localhost:8000/api/deletecomment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        commentID: String(commentId),
      })
    });

    const content = await response.json();
    console.log(content);
    if (content.message == "success") {
      setReload(true)
    }
  }

  if (reload) {
    window.location.reload();
  }

  if (redirect) {
    return <Navigate to="/" />;
  }

  let postEdit;

  if (post.username == username) {
    postEdit = (
      <div className="edit-post">
        <button type="button" className="btn btn-primary" onClick={() => navigate("/editpost/" + id)}>Edit Post</button>
        <button type="button" className="btn btn-danger" onClick={() => { showDeleteDialog(true); }}>Delete Post</button>
      </div>
    )
  }

  const commentEdit = (
    <div className="edit-comment">
      {/* <button type="button" className="btn btn-primary">Edit Comment</button> */}
      <button type="button" className="btn btn-danger" onClick={() => { showDelCommentDialog(true) }}>Delete Comment</button>
    </div>
  )

  console.log("deleteDialog: " + deleteDialog);
  return (
    // <main id="ocean">
    <div className="card">
      {deleteDialog ? <ConfirmModal action="Delete" confirm={deletePost} cancel={() => showDeleteDialog(false)} /> : null}
      <div className="card-body">
        <h5 className="card-title">{post.title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">By {post.username}</h6>
        <p className="card-text">{post.bodyText}</p>
        {/* {show post topics} */}
        <div className="post-topics">
          {post.topics.map((topic, index) => (
            <div key={index} className="topic">
              <span>#{topic.name}</span>
            </div>
          ))}
        </div>
        {postEdit}
      </div>
      <div className='form-comment'>
        <form onSubmit={newComment}>
          <div className="mb-3">
            <label htmlFor="comment" className="form-label">Comment</label>
            <textarea className="form-control" id="comment" rows={3} onChange={
              e => {
                setCommentText(e.target.value);
              }
            }></textarea>
          </div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
      <div className="comments">
        {post.comments.map((comment, index) => (
          <div key={index} className="card comment">
            {delCommentDialog ? <ConfirmModal action="Delete" confirm={(e: SyntheticEvent) => deleteComment(e, comment.ID)} cancel={() => showDelCommentDialog(false)} /> : null}
            <div className="card-body">
              <h6 className="card-subtitle mb-2 text-muted">{comment.username}</h6>
              <p className="card-text">{comment.bodyText}</p>
              {/* {comment.replies.map((reply, index) => (
                  <div key={index} className="card">
                    <div className="card-body">
                      <h6 className="card-subtitle mb-2 text-muted">{reply.username}</h6>
                      <p className="card-text">{reply.text}</p>
                    </div>
                  </div>
                ))} */}
            </div>
            {/* {comment delete button with dialog} */}
            {comment.username == username ? commentEdit : null}
          </div>
        ))}
      </div>
    </div>
    // </main>
  );
};

export default SinglePost;