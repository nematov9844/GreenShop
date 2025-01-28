import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { message, Button,  } from 'antd';
import { useAxios } from '../hook/useAxios';

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const axios = useAxios();
  const [user, setUser] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [sopList ,setShopList]= useState<any>([])
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios({
          url: `/user/by_id/${id}`,
          method: 'GET',
        });
        setUser(response.data);
        setIsFollowing(response.data.followers.includes("64ea18e295085f00ce1714bc"));
      } catch (error) {
        message.error('Failed to fetch user details');
      }
    };

    fetchUser();
  }, [id]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios({
          url: '/user/wishlist',
          method: 'GET',
        });
        console.log(response);
        
        setWishlist(response.data);
      } catch (error) {
        message.error('Failed to fetch wishlist');
      }
    };
    
    fetchWishlist();
  }, [id]);
//   useEffect(() => {
//     const fetchWishlist = async () => {
//       try {
//         const response = await axios({
//           url: '/user/wishlist',
//           method: 'GET',
//         });
//         console.log(response);
        
//         setShopList(response.data);
//       } catch (error) {
//         message.error('Failed to fetch wishlist');
//       }
//     };
    
//     fetchWishlist();
//   }, [id]);


  const handleFollow = async () => {
    try {
      await axios({
        url: '/user/follow',
        method: 'POST',
        body: {
          _id: id,
        },
      });
      message.success('You are now following this user!');
      setIsFollowing(true);
    } catch (error) {
      message.error('Failed to follow user');
    }
  };

  const handleUnfollow = async () => {
    try {
      await axios({
        url: '/user/unfollow',
        method: 'POST',
        body: {
          _id: id,
        },
      });
      message.success('You have unfollowed this user!');
      setIsFollowing(false);
    } catch (error) {
      message.error('Failed to unfollow user');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <img src={user.profile_photo} alt="Profile" className="w-32 h-32 rounded-full border-2 border-green-500 mr-4" />
        <div>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-gray-600">{user.username}</p>
          <p className="text-gray-600">Followers: {user.followers.length}</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-4">
        <h2 className="text-xl font-semibold mb-4">About</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone_number}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-4">
        <h2 className="text-xl font-semibold mb-4">Shop List</h2>
        <ul>
          {user.shopList && user.shopList.map((item: any) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-4">
        <h2 className="text-xl font-semibold mb-4">Wishlist</h2>
 <div className="flex w-full overflow-x-scroll h-[200px] gap-4 p-4">
  {wishlist.map((item: any) => (
    item?.main_image && ( // Rasmni tekshirish
      <div
        className="flex-shrink-0 flex items-center gap-4 p-4 border rounded-lg shadow-md bg-white w-[300px]"
        key={item?._id}
      >
        {/* Chap tomonda rasm */}
        <img
          alt={item?.title}
          src={item?.main_image}
          className="w-24 h-24 object-cover rounded-md"
        />

        {/* O'ng tomonda title, description va price */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">{item?.title}</h3>
          <p className="text-gray-600 text-sm mb-2">
            {item?.short_description.length > 20
              ? `${item?.short_description.slice(0, 20)}...`
              : item?.short_description}
          </p>
          <p className="text-gray-800 font-medium">
            <strong>Price:</strong> ${item?.price}
          </p>
        </div>

      </div>
    )
  ))}
</div>



      </div>
      {isFollowing ? (
        <Button type="default" className="mt-4" onClick={handleUnfollow}>Unfollow</Button>
      ) : (
        <Button type="primary" className="mt-4" onClick={handleFollow}>Follow</Button>
      )}
      <Button type="default" className="mt-4 ml-4">Send Invitation</Button>
    </div>
  );
};

export default UserDetail; 