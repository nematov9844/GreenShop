import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { message } from 'antd';
import { useAxios } from '../hook/useAxios';

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const axios = useAxios();
  const [blog, setBlog] = useState<any>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios({
          url: `/user/blog/${id}`, // Blog tafsilotlarini olish
          method: 'GET',
        });
        setBlog(response.data.data);
      } catch (error) {
        message.error('Failed to fetch blog details');
      }
    };

    fetchBlog();
  }, [id, axios]);

  if (!blog) return <div>Loading...</div>;

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{blog.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      <p className="mt-4">Written by: {blog.created_by}</p>
    </div>
  );
};

export default BlogDetail; 