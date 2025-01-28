import React, { useEffect, useState } from 'react';
import { Input, List, Avatar, message, Button, Modal, Form } from 'antd';
import { useAxios } from '../hook/useAxios';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

const { Search } = Input;

interface Blog {
  _id: string;
  title: string;
  short_description: string;
  created_by: string;
  created_at: string;
}

const BlogPage: React.FC = () => {
  const axios = useAxios();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [userData, setUserData] = useState<any>(null); // Foydalanuvchi ma'lumotlarini saqlash

  useEffect(() => {
    const fetchBlogs = async (search: string = "") => {
      try {
        const response = await axios({
          url: '/user/blog',
          method: 'GET',
          params: {
            search: search, // Qidiruv so'rovini yuborish
          },
        });
        console.log(response);
        
        setBlogs(response.data);
        setFilteredBlogs(response.data);
      } catch (error) {
        message.error('Failed to fetch blogs');
      }
    };

    fetchBlogs(); // Dastlabki bloglarni olish
  }, []);

  const handleSearch = async (value: string) => {
    try {
      const response = await axios({
        url: '/user/blog',
        method: 'GET',
        params: {
          search: value, // Qidiruv so'rovini yuborish
        },
      });
      setFilteredBlogs(response.data); // Qidiruv natijalarini yangilash
    } catch (error) {
      message.error('Failed to fetch blogs');
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    try {
      await axios({
        url: `/user/blog`, // O'chirish uchun URL
        method: 'DELETE',
        body: {
          _id: blogId, // O'chiriladigan blog ID
        },
      });
      message.success('Blog deleted successfully!');
      // O'chirilgandan so'ng bloglar ro'yxatini yangilang
      setBlogs(blogs.filter(blog => blog._id !== blogId));
      setFilteredBlogs(filteredBlogs.filter(blog => blog._id !== blogId));
    } catch (error) {
      message.error('Failed to delete blog');
    }
  };

  const handleAddBlog = async (values: any) => {
    try {
      const response = await axios({
        url: '/user/blog', // Yangi blog qo'shish uchun URL
        method: 'POST',
        body: {
          title: values.title,
          content: values.content,
          short_description: values.content.substring(0, 100), // 100 ta belgidan iborat qisqa tavsif
        },
      });
      message.success('Blog added successfully!');
      setBlogs([...blogs, response.data]); // Yangi blogni ro'yxatga qo'shish
      setFilteredBlogs([...filteredBlogs, response.data]); // Qidiruv natijalariga qo'shish
      setIsModalVisible(false); // Modalni yopish
      form.resetFields(); // Formani tozalash
    } catch (error) {
      message.error('Failed to add blog');
    }
  };



  return (
    <div className="max-w-[1440px] mx-auto py-8">
      <Header />
      <h1 className="text-2xl font-bold mb-4">Blogs</h1>
      <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: '20px' }}>
        Add Blog
      </Button>
      <Search
        placeholder="Search by title or description"
        onSearch={handleSearch}
        style={{ marginBottom: '20px' }}
      />
      <List
        itemLayout="horizontal"
        dataSource={filteredBlogs}
        renderItem={item => (
          <List.Item
            actions={[
              <button onClick={() => handleDeleteBlog(item._id)} style={{ color: 'red' }}>Delete</button>,
              <Link to={`/user/${item.created_by}`} style={{ color: 'blue' }}>View User</Link>, // Foydalanuvchi profiliga o'tish
            ]}
          >
            <List.Item.Meta
              avatar={<Avatar src={`https://api.adorable.io/avatars/40/${item.created_by}.png`} />}
              title={<Link to={`/blog/${item._id}`}>{item.title}</Link>}
              description={item.short_description}
            />
          </List.Item>
        )}
      />

      {/* Modal for adding a new blog */}
      <Modal
        title="Add New Blog"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAddBlog}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please input the title!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Content"
            name="content"
            rules={[{ required: true, message: 'Please input the content!' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Blog
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BlogPage;
