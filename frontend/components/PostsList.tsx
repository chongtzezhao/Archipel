import React from 'react';
import { Link } from 'react-router-dom';
import './PostsList.css'; // Import your CSS file

const PostsList = ({ posts }) => {
  return (
    <div className='posts-list'>
      {posts.map((post) => (
        <div key={post.ID} className="post-item">
          <Link to={`/post/${post.ID}`} className="post-link">
            {post.title}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default PostsList;
