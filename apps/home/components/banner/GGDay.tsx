import Image from "next/image";
import NeonText from "../utils/NeonText";

const GGDay = () => {
  return (
    <section className="relative flex flex-col items-center justify-start px-8 py-12 lg:py-24 gap-y-4 lg:grid lg:grid-cols-2">
      <div
        style={{
          backgroundImage: "url(/assets/GGDay.png)",
          //   backgroundPosition: "left",
          //   backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
        className="absolute inset-y-0 left-0 right-0 aspect-auto bg-no-repeat bg-center lg:bg-left blur-[2px]"
      ></div>
      <div className="absolute inset-0 bg-tertiary bg-gg-day lg:text-5xl z-0 opacity-70 lg:opacity-100"></div>
      <div className="lg:row-span-2 lg:h-full lg:grid lg:place-items-center">
        <h1
          data-text={"GG Day"}
          className="font-ranger lg:hidden text-center neon-text text-4xl z-10 relative before:contents lg:text-6xl w-content"
        >
          GG Day
        </h1>
        <div className="relative hidden lg:inline lg:text-7xl xl:text-9xl font-ranger text-center">
          <NeonText nofg>GG Day</NeonText>
        </div>
      </div>
      <h2 className="text-3xl lg:text-5xl font-bebas tracking-wide z-10">
        This 19th September @ IT KMITL
      </h2>
      <div className="z-10 col-start-2">
        <p className="font-kanit font-medium lg:text-lg">
          กิจกรรมมาพร้อมกับความยิ่งใหญ่กว่าใคร ด้วยธีมอะไรนั้น ขออุ๊บไว้ก่อน
          รอติดตามกิจกรรมครั้งนี้ได้เลย
        </p>
        <br />
      </div>
    </section>
  );
};

export default GGDay;
