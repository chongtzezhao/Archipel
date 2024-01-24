import React, {useEffect, useState} from 'react';
import PostsList from '../components/PostsList';

const Home = (props: { username: string }) => {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    (
      async () => {
        const response = await fetch('http://localhost:8000/api/posts', {
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        setPosts(await response.json());
      }
    )();
  });


  return (
    <main id="ocean">
      {/* {show user posts} */}
      <PostsList posts={posts}/>
    </main>
  );
};

export default Home;