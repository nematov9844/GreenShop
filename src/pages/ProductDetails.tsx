import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAxios } from "../hook/useAxios";
import { useDispatch, useSelector } from "react-redux";
import { addToCartAsync, addToWishlist } from "../redux/shopSlice";
import { Button, Image, message } from "antd";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import Header from "../components/Header";
import { AppDispatch, RootState } from '../redux/store';

interface ProductType {
    _id?: string;
    title?: string;
    main_image?: string | undefined;
    detailed_images?: string[];
    price?: number;
    discount?: boolean;
    discount_price?: string | number;
    description?: string | undefined;
    size?: string;
    sku?: string;
    category?: string;
}

export default function ProductDetails() {
    const { id, category } = useParams();
    const [product, setProduct] = useState<ProductType | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | undefined>("");
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const axiosRequest = useAxios();
    const dispatch = useDispatch<AppDispatch>();
    const { loginData } = useSelector((state: RootState) => state.loginData);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await axiosRequest({
                    url: `/flower/category/${category}/${id}`,
                    method: "GET"
                });

                if (!response) {
                    setProduct(null);
                    return;
                }

                setProduct(response.data);
                setSelectedImage(response.data.main_image || response.data.detailed_images?.[0]);
            } catch (err) {
                console.error("Mahsulot yuklashda xatolik:", err);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        if (id && category) {
            fetchProduct();
        }
    }, [id, category]);

    if (loading) {
        return (
            <>
                <Header />
                <div className="h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green"></div>
                </div>
            </>
        );
    }

    if (!product) {
        return (
            <>
                <Header />
                <div className="h-screen flex flex-col items-center justify-center">
                    <img
                        src="/empty-product.png"
                        alt="Empty Product"
                        className="w-64 mb-4"
                    />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Mahsulot topilmadi
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Kechirasiz, siz qidirayotgan mahsulot mavjud emas
                    </p>
                    <Link
                        to="/shop"
                        className="px-6 py-2 bg-green text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                        Do'konga qaytish
                    </Link>
                </div>
            </>
        );
    }
    
    const handleAddToCart = async () => {
        try {
            if (!loginData) {
                message.error('Please login first');
                return;
            }

            if (!product) {
                message.error('Product not found');
                return;
            }

            await dispatch(addToCartAsync({
                _id: product?._id,
                title: product?.title,
                main_image: product?.main_image,
                price: product?.price,
                discount: product?.discount,
                discount_price: Number(product?.discount_price)
            })).unwrap();

            message.success('Added to cart');
        } catch (error) {
            console.error('Add to cart error:', error);
            message.error('Failed to add to cart');
        }
    };

    const handleAddToWishlist = () => {
        console.log(product);
        
        dispatch(addToWishlist(product));
        message.success("Added to wishlist");
    };

    return (
        <>
            <Header />
            <div className="max-w-[1280px] mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Link to="/" className="text-gray-500 hover:text-green">Home</Link>
                    <span className="mx-2">/</span>
                    <Link to="/shop" className="text-gray-500 hover:text-green">Shop</Link>
                    <span className="mx-2">/</span>
                    <span className="text-green">{product.title}</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 justify-between w-full">
                    {/* Left Side - Images */}
                    <div className="w-full flex flex-row-reverse justify-between lg:w-1/2">
                        <div className="mb-4 w-full bg-gray-100 flex justify-center items-center p-4">
                            <Image
                                src={selectedImage}
                                alt={product.title}
                                className="w-full !h-[400px] rounded-lg"
                            />
                        </div>
                        <div className="flex flex-col gap-2 md:gap-4">
                            {product?.detailed_images && product.detailed_images.length > 0 ? (
                                product.detailed_images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(img)}
                                        className={`border rounded-lg p-1 md:p-2 ${
                                            selectedImage === img ? "border-green" : ""
                                        }`}
                                    >
                                        <img
                                            src={img}
                                            alt={`${product.title} ${index + 1}`}
                                            className="w-full h-14 md:h-20 object-cover"
                                        />
                                    </button>
                                ))
                            ) : (
                                <button
                                    onClick={() => setSelectedImage(product?.main_image)}
                                    className="border rounded-lg p-1 md:p-2 border-green"
                                >
                                    <img
                                        src={product.main_image}
                                        alt={product.title}
                                        className="w-full h-14 md:h-20 object-cover"
                                    />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right Side - Product Info */}
                    <div className="w-full lg:w-1/2">
                        <h1 className="text-2xl md:text-3xl font-bold mb-4">{product.title}</h1>
                        <p className="text-xl md:text-2xl text-green font-bold mb-6">
                            ${product.discount ? product.discount_price : product.price}
                        </p>

                        <div className="space-y-4 mb-6">
                            <div className="flex gap-2">
                                <span className="font-medium">SKU:</span>
                                <span className="text-gray-600">{product.sku || product._id}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-medium">Category:</span>
                                <span className="text-gray-600">{product.category || "Plants"}</span>
                            </div>
                            <div className="flex gap-2">
                                <span className="font-medium">Size:</span>
                                <span className="text-gray-600">{product.size || "Medium"}</span>
                            </div>
                        </div>

                        <p className="text-gray-600 mb-6">
  {product?.description && product.description.length > 20
    ? product.description.slice(0, 20)
    : "The ceramic cylinder planters come with a wooden stand to help elevate your plants off the ground."}
</p>


                        {/* Quantity and Buttons */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                            <div className="flex items-center gap-2">
                                <button
                                    className="w-8 h-8 border bg-green text-white  rounded-full flex items-center justify-center"
                                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                                >
                                    -
                                </button>
                                <span className="w-8 text-center">{quantity}</span>
                                <button
                                    className="w-8 h-8 border bg-green text-white  rounded-full flex items-center justify-center"
                                    onClick={() => setQuantity(quantity + 1)}
                                >
                                    +
                                </button>
                            </div>

                            <div className="flex gap-2 w-full sm:w-auto">
                                <Button
                                    type="primary"
                                    icon={<ShoppingCartOutlined />}
                                    onClick={handleAddToCart}
                                    className="bg-green flex-1 sm:flex-none"
                                    loading={loading}
                                >
                                    ADD TO CART
                                </Button>

                                <Button
                                    icon={<HeartOutlined />}
                                    onClick={handleAddToWishlist}
                                    className="border-green text-green"
                                >
                                    ADD TO WISHLIST
                                </Button>
                            </div>
                        </div>

                        {/* Share */}
                        <div className="flex items-center gap-2 mt-8">
                            <span className="font-medium">Share this products:</span>
                            <div className="flex gap-4">
                                <a href="#" className="text-gray-600 hover:text-green text-xl">
                                    <i className="fab fa-facebook"></i>
                                </a>
                                <a href="#" className="text-gray-600 hover:text-green text-xl">
                                    <i className="fab fa-twitter"></i>
                                </a>
                                <a href="#" className="text-gray-600 hover:text-green text-xl">
                                    <i className="fab fa-linkedin"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 