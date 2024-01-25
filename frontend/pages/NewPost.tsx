import React, { SyntheticEvent, useEffect, useState } from 'react';
import { Navigate, useParams } from "react-router-dom";
import { WithContext as ReactTags } from 'react-tag-input';
import { Post, postExample } from '../components/Post';

const NewPost = (props: { username: string, isNewPost: boolean }) => {
  const { id } = useParams();

  const [title, setTitle] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [redirectPost, setRedirectPost] = useState(false);
  const [tags, setTags] = useState<{ id: string, text: string }[]>([]);
  const [postId, setPostId] = useState('');
  const username = props.username;
  const isNewPost = props.isNewPost;

  if (!username) {
    return <Navigate to="/login" />;
  }

  const KeyCodes = {
    Comma: 188,
    Enter: 13,
    Tab: 9,
    Space: 32,
  };

  const submitPost = async (e: SyntheticEvent) => {
    e.preventDefault();
    const header = isNewPost ? 'http://localhost:8000/api/newpost' : 'http://localhost:8000/api/editpost';
    console.log("sending tags: " + JSON.stringify(tags));
    const response = await fetch(header, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        postID: postId,  // only for editing posts
        title,
        bodyText,
        topics: tags.map(tag => tag.text),
        username,
      })
    });

    const content = await response.json();
    if (isNewPost) setPostId(String(content.ID));
    console.log("CREATED USER POST: " + JSON.stringify(content));
    setRedirectPost(true);
  }

  if (!isNewPost) {
    useEffect(() => {
      (
        async () => {
          setPostId(String(id));
          const response = await fetch('http://localhost:8000/api/singlepost?' + new URLSearchParams({
            postID: String(id),
          }), {
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          });

          const content = await response.json();
          console.log("got post content", content);

          setTitle(content.title);
          setBodyText(content.bodyText);
          setTags(content.topics.map((topic: any) => ({ id: topic.name, text: topic.name })));  // might properly do it next time
        }
      )();
    }, []);
  }

  if (redirectPost) {
    console.log("redirecting from newpost to post/" + postId)
    return <Navigate to={"/post/" + postId} />;
  }

  return (
    // <main id="ocean">
    <div className="form-signin">
      <form onSubmit={submitPost}>
        {isNewPost ? <h1 className="h3 mb-3 fw-normal">New Post</h1> : <h1 className="h3 mb-3 fw-normal">Edit Post</h1>}
        <h3 className="h3 mb-3 fw-normal">Title</h3>
        <input type="text" className="form-control" placeholder="Your wonderful title" value={title} required
          onChange={e => setTitle(e.target.value)}
        />
        <h3 className="h3 mb-3 fw-normal">Body</h3>
        <textarea className="form-control" placeholder="Your engaging story" value={bodyText} required
          onChange={e => setBodyText(e.target.value)}
        ></textarea>

        <h3 className="h3 mb-3 fw-normal">Topics</h3>
        <ReactTags placeholder="Concepts, ideas, and topics"
          tags={tags}
          handleDelete={(i) => { setTags(tags.filter((tag, index) => index !== i)); }}
          handleAddition={(tag) => { setTags([...tags, tag]) }}
          handleDrag={(tag, currPos, newPos) => {
            const newTags = tags.slice();

            newTags.splice(currPos, 1);
            newTags.splice(newPos, 0, tag);

            setTags(newTags);
          }}
          delimiters={[KeyCodes.Enter, KeyCodes.Tab, KeyCodes.Comma, KeyCodes.Space]}
        />
        {isNewPost ? <button className="w-100 btn btn-lg btn-primary" type="submit">Publish</button>
          : <button className="w-100 btn btn-lg btn-primary" type="submit">Update</button>}
      </form>
    </div>
    // </main>
  );
};

export default NewPost;