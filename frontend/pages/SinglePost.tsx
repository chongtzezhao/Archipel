import React, {SyntheticEvent, useEffect, useState } from 'react';
import { Navigate, useParams } from "react-router-dom";
import "./SinglePost.css"

const SinglePost = (props: { username: string }) => {
  const username = props.username;
  const { id } = useParams();
  const [post, setPost] = useState<{title: string, username: string, bodyText: string, comments: any[]}>({
    title: '',
    username: '',
    bodyText: '',
    comments: [],
  });
  const [commentText, setCommentText] = useState('');
  const [reload, setReload] = useState(false);


  useEffect(() => {
    (
      async () => {
        
        const response = await fetch('http://localhost:8000/api/singlepost?' + new URLSearchParams({
          id: String(id),
        }), {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        const content = await response.json();

        setPost(content );
      }
    )();
  }, []);

  const postComment = async (e: SyntheticEvent) => {
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
    if (content.message == "success") {
      setReload(true);
    }
  }

  if (reload) {
    const s = "/post/" + id;
    // return <Navigate to={s} />;
    window.location.reload();
  }

  return (
    <main id="ocean">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{post.title}</h5>
          <h6 className="card-subtitle mb-2 text-muted">By {post.username}</h6>
          <p className="card-text">{post.bodyText}</p>
        </div>
        <div className='form-comment'>
          <form onClick={postComment}>
            <div className="mb-3">
              <label htmlFor="comment" className="form-label">Comment</label>
              <textarea className="form-control" id="comment" rows={3} onChange={
                e => {
                  console.log(e.target.value);
                  setCommentText(e.target.value);
                }
              }></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
        <div className="comments">
          {post.comments.map((comment, index) => (
            <div key={index} className="card">
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
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default SinglePost;