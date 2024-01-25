import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PostsList from '../components/PostsList';

const Home = (props: { searchQuery: string, getMode: string, username: string }) => {
  const { state } = useLocation();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    (
      async () => {
        if (state !== null) {
          props.searchQuery = state.searchQuery;
          props.getMode = state.getMode;
        }
        console.log(props.searchQuery + " " + props.getMode);
        const response = await fetch('http://localhost:8000/api/posts?' + new URLSearchParams({
          searchQuery: props.searchQuery,
          getMode: props.getMode,
        }), {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        const posts = await response.json();
        console.log(JSON.stringify(posts))

        setPosts(posts)
      }
    )();
  }, []);


  return (
    <PostsList posts={posts} />
  );
};

export default Home;