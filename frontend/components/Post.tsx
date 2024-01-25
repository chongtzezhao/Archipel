export interface Post {
  title: string,
  username: string,
  bodyText: string,
  comments: any[],
  topics: any[],
}

export const postExample = {
  title: '',
  username: '',
  bodyText: '',
  comments: [],
  topics: [],
}


// const [post, setPost] = useState<{title: string, username: string, bodyText: string, comments: any[]}>({
//   title: '',
//   username: '',
//   bodyText: '',
//   comments: [],
// });
