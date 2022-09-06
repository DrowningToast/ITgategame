import Image from "next/image";
import { axiosBackendInstance } from "../axios/helper";

const Hero = () => {
  const signin = async () => {
    // console.log(await axiosBackendInstance.get("/users/all"));
  };

  return (
    <section className="bg-dark w-screen min-h-screen md:px-20 py-12 md:py-28 relative">
      <div className="flex flex-col gap-y-8 z-20">
        <div className="flex flex-col justify-center md:items-start items-center mx-auto md:mx-0 px-2  z-20">
          <h1 className="yellow-gradient-text leading-[240px] inline-block align-middle font-extrabold text-8xl md:text-[240px] font-ranger pr-8">
            ITGG
          </h1>
          <h2 className="yellow-gradient-text leading-[128px] transform -translate-y-32 md:-translate-y-16 table-cell text-6xl md:text-[128px] font-ranger  pr-8">
            2022
          </h2>
        </div>
        <div className="whitespace-pre w-screen md:w-auto text-center md:text-left text-sm md:text-2xl font-kanit z-20">
          <div className="md:static absolute top-1/3 left-1/2 transform -translate-x-1/2 md:translate-x-0 md:translate-y-0  tracking-widest">
            <span className="whitespace-pre text-tertiary font-kanit font-normal md:font-light">
              กลับมาอีกครั้งสำหรับการมหกรรมแข่งขันที่ใหญ่ที่สุด
            </span>
            <br />
            <span className=" text-tertiary font-kanit font-normal md:font-light">
              มันจะเป็นอีกครั้งที่คณะไอทีจะต้องลุกเป็นไฟ
            </span>
          </div>
          <button
            onClick={signin}
            className="text-white md:static absolute top-4 right-4 cursor-pointer my-4 tracking-widest inline-block font-light px-4 py-1 border-white border-2 md:border-4 rounded-md"
          >
            เข้าสู่ระบบ
          </button>
        </div>
      </div>
      <div className="absolute inset-0 overflow-hidden">
        {/* bg */}

        <div
          style={{
            backgroundImage: "url(/assets/hero.png)",
            backgroundPosition: "40% 35%",
          }}
          className="absolute inset-0 bg-no-repeat bg-center bg-cover blur-sm transform translate-y-1/3"
        ></div>
        {/* fire png */}
        <div
          style={{
            backgroundImage: "url(/assets/Fire.png)",
            // backgroundPosition: "50% 20%",
          }}
          className="absolute -inset-x-24 inset-y-0 md:inset-0 bg-no-repeat bg-center bg-cover blur-0 transform translate-y-1/4 md:scale-100 scale-75"
        ></div>
      </div>
      {/* Upper gradient */}
      <div className="upper-dark-gradient inset-0 bottom-[10%] absolute z-10"></div>
      {/* Bottom gradient */}
      <div className="bottom-dark-gradient bottom-0 top-3/4 inset-x-0 absolute z-10 transform translate-y-1"></div>
    </section>
  );
};

export default Hero;
