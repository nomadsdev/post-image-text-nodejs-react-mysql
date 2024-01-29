import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios';

function App() {

  const [posts, setPosts] = useState([]);
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3001/posts')
            .then(res => {
                setPosts(res.data);
            })
            .catch(err => console.error(err));
    }, []);

    const handleDelete = (postId) => {
        axios.delete(`http://localhost:3001/posts/${postId}`)
            .then(res => {
                setPosts(posts.filter(post => post.id !== postId));
            })
            .catch(err => console.error(err));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('text', text);
        formData.append('image', image);

        axios.post('http://localhost:3001/posts', formData)
            .then(res => {
                setPosts([...posts, res.data]);
                setText('');
                setImage(null);
            })
            .catch(err => console.error(err));
    };

  return (
    <>
      <div className='flex justify-center'>
        <div className='p-10'>
          <h1 className='text-red-600 text-2xl'>Post</h1>
          <div className='bg-red-600 w-5 h-1 rounded-full'></div>
        </div>
      </div>
      <div className='flex justify-center'>
        <form onSubmit={handleSubmit}>
            <div className='flex justify-center gap-10'>
            <input 
            type="text" 
            value={text} 
            className='border border-red-600 rounded-md pl-2 text-zinc-600'
            onChange={(e) => setText(e.target.value)} 
            />
            <input 
            type="file" 
            className='text-white bg-red-600 px-5 rounded-full'
            onChange={(e) => setImage(e.target.files[0])} 
            />
            </div>
            <div className='flex justify-center p-5'>
            <button type="submit" className='shadow-md text-white bg-red-600 px-5 rounded-full'>Post</button>
            </div>
        </form>
      </div>
      <div className='flex justify-center'>
        {posts.map(post => (
        <div key={post.id}>
            <img className='w-96 rounded-xl shadow-md p-4' src={`http://localhost:3001/uploads/${post.image}`} alt="post" />
            <p className='text-red-600 py-4'>{post.text}</p>
            <div>
            <button onClick={() => handleDelete(post.id)} className='bg-red-600 text-white px-5 rounded-md'>Delete</button>
            </div>
        </div>
        ))}
        </div>
    </>
  )
}

export default App
