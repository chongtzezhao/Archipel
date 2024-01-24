import React, { SyntheticEvent, useState } from 'react';
import { Navigate } from "react-router-dom";
import { WithContext as ReactTags } from 'react-tag-input';

const NewPost = (props: { username: string }) => {
  const [title, setTitle] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [tags, setTags] = useState<{ id: string, text: string }[]>([]);
  const username = props.username;

  const KeyCodes = {
    Comma: 188,
    Enter: 13,
    Tab: 9,
    Space: 32,
  };

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8000/api/newpost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        title,
        bodyText,
        topics: tags.map(tag => tag.text),
        username,
      })
    });

    const content = await response.json();
    console.log("CREATED USER POST: " + JSON.stringify(content));
    setRedirect(true);
  }

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <main id="ocean">
      <div className="form-signin">
        <form onSubmit={submit}>
          <h1 className="h3 mb-3 fw-normal">New Post</h1>
          <h3 className="h3 mb-3 fw-normal">Title</h3>
          <input type="text" className="form-control" placeholder="Your wonderful title" required
            onChange={e => setTitle(e.target.value)}
          />
          <h3 className="h3 mb-3 fw-normal">Body</h3>
          <textarea className="form-control" placeholder="Your engaging story" required
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

          <button className="w-100 btn btn-lg btn-primary" type="submit">Publish</button>
        </form>
      </div>
    </main>
  );
};

export default NewPost;