import { Carousel } from 'antd';

const img = "https://s3-alpha-sig.figma.com/img/4575/e3df/52fa214db1f3ce519277860c13b11e21?Expires=1737331200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=W4MDyiNKgsK1QniEtChglnGSGdfXS-MULfIY3Xp-JRMyfGyTxKKTTZ4VtQ3XuEaYomdizNtJrM7YPl3cUjbPi2xPSGuXvpm3pqqbmV1m-~re8QcFt~M67rFVhLdLy0drRHzarRn5H2N5FI~Ayr2lESDMrqVN~gk6iHk-0iOGypRl-T1WYkrFnbq5dmEYH5yX37qWau6X2kfbhGgLJ7guU~EIUwcVMazFvY23yhrR~icaQAslsJKQUsQFVbKI5qAStsEWHPs2VNWCQRqcUr8lEw6G0ycMwhgUeUOHyvrmzEC~4cwU5arHL8fwFvxud5yMpyFwsDCWEI6BCdqXJo7j6g__"

export default function Hero() {


  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
      <Carousel
        autoplay
        autoplaySpeed={3000}
        dots={true}
        effect="scrollx"
        pauseOnHover
     
      >
 <div className='!flex-col-reverse p-5 nr:p-2 !flex nr:!flex-row items-center md:bg-white bg-gradient-to-r from-[rgba(70,222,163,0.2)] md:from-white to-[rgba(70,163,88,0.6)] md:to-white mx-auto rounded-3xl !w-[95%] max-w-[1280px] !h-auto md:!h-[80vh] md:!max-h-[600px]'>
  <div className='!flex !flex-col !justify-center items-start gap-4 lg:p-0 w-full sm:w-1/2 !h-full font-cera'>
    <div className='flex flex-col items-start gap-3'>
      <p className='font-medium text-[11px] text-[rgba(61,61,61,1)] md:!text-sm'>Welcome to GreenShop</p>
      <h1 className='font-black text-[24px] md:text-[70px] leading-[29px] md:leading-[70px]'>
        Let's Make a Better <span className='text-green'>Planet</span>
      </h1>
      <p className='text-[rgba(114,114,114,1)] text-xs md:text-sm hidden md:block '>We are an online plant shop offering a wide range of cheap and trendy plants. Use our plants to create a unique Urban Jungle. Order your favorite plants!</p>
  <p className='text-[rgba(114,114,114,1)] text-xs md:text-sm md:hidden'>We are an online plant shop offering a wide range </p>
    </div>
    <button className='bg-transparent md:bg-green rounded-md md:w-[140px] sm:h-[40px] font-bold text-green text-xs md:text-base md:text-white'>
      SHOP NOW
    </button>
  </div>
  <div className='w-full sm:w-1/2 h-full'>
    <div className='flex justify-center w-full h-[40vh] md:h-full'>
      <img src={img} alt="Plant Image" className="rounded-md h-full object-cover" />
    </div>
  </div>
</div>

<div className='!flex-col-reverse p-5 nr:p-2 !flex nr:!flex-row items-center md:bg-white bg-gradient-to-r from-[rgba(70,222,163,0.2)] md:from-white to-[rgba(70,163,88,0.6)] md:to-white mx-auto rounded-3xl !w-[95%] max-w-[1280px] !h-auto md:!h-[80vh] md:!max-h-[600px]'>
  <div className='!flex !flex-col !justify-center items-start gap-4 lg:p-0 w-full sm:w-1/2 !h-full font-cera'>
    <div className='flex flex-col items-start gap-3'>
      <p className='font-medium text-[11px] text-[rgba(61,61,61,1)] md:!text-sm'>Welcome to GreenShop</p>
      <h1 className='font-black text-[24px] md:text-[70px] leading-[29px] md:leading-[70px]'>
        Let's Make a Better <span className='text-green'>Planet</span>
      </h1>
      <p className='text-[rgba(114,114,114,1)] text-xs md:text-sm hidden md:block '>We are an online plant shop offering a wide range of cheap and trendy plants. Use our plants to create a unique Urban Jungle. Order your favorite plants!</p>
  <p className='text-[rgba(114,114,114,1)] text-xs md:text-sm md:hidden'>We are an online plant shop offering a wide range </p>
    </div>
    <button className='bg-transparent md:bg-green rounded-md md:w-[140px] sm:h-[40px] font-bold text-green text-xs md:text-base md:text-white'>
      SHOP NOW
    </button>
  </div>
  <div className='w-full sm:w-1/2 h-full'>
    <div className='flex justify-center w-full h-[40vh] md:h-full'>
      <img src={img} alt="Plant Image" className="rounded-md h-full object-cover" />
    </div>
  </div>
</div>
<div className='!flex-col-reverse p-5 nr:p-2 !flex nr:!flex-row items-center md:bg-white bg-gradient-to-r from-[rgba(70,222,163,0.2)] md:from-white to-[rgba(70,163,88,0.6)] md:to-white mx-auto rounded-3xl !w-[95%] max-w-[1280px] !h-auto md:!h-[80vh] md:!max-h-[600px]'>
  <div className='!flex !flex-col !justify-center items-start gap-4 lg:p-0 w-full sm:w-1/2 !h-full font-cera'>
    <div className='flex flex-col items-start gap-3'>
      <p className='font-medium text-[11px] text-[rgba(61,61,61,1)] md:!text-sm'>Welcome to GreenShop</p>
      <h1 className='font-black text-[24px] md:text-[70px] leading-[29px] md:leading-[70px]'>
        Let's Make a Better <span className='text-green'>Planet</span>
      </h1>
      <p className='text-[rgba(114,114,114,1)] text-xs md:text-sm hidden md:block '>We are an online plant shop offering a wide range of cheap and trendy plants. Use our plants to create a unique Urban Jungle. Order your favorite plants!</p>
  <p className='text-[rgba(114,114,114,1)] text-xs md:text-sm md:hidden'>We are an online plant shop offering a wide range </p>
    </div>
    <button className='bg-transparent md:bg-green rounded-md md:w-[140px] sm:h-[40px] font-bold text-green text-xs md:text-base md:text-white'>
      SHOP NOW
    </button>
  </div>
  <div className='w-full sm:w-1/2 h-full'>
    <div className='flex justify-center w-full h-[40vh] md:h-full'>
      <img src={img} alt="Plant Image" className="rounded-md h-full object-cover" />
    </div>
  </div>
</div>
      </Carousel>
    </div>
  )
}
