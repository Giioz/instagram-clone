import Image from "next/image";

export default function LoginLeftSide() {
  return (
    <div className="w-full h-full relative flex items-center justify-center">
      <div className="absolute top-14 left-14">
        <Image
          src="/Instagram-Gradient-Logo-PNG.png"
          alt="Instagram"
          width={82}
          height={82}
        />
      </div>

      <div className="flex flex-col items-center justify-center  mt-[15%] ">
        <div className="text-center text-white ml-13">
          <h1 className="text-[40px] font-normal mb-3.5">
            See everyday moments from
          </h1>

          <p className="text-[40px] text-white">
            <span className="font-normal">your </span>
            <span className="bg-linear-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              close friends
            </span>
            .
          </p>
        </div>
        <div className="flex items-center justify-center ">
          <Image
            src="/TZyiZuKrlQL.png"
            alt="Friends"
            width={520}
            height={520}
          />
        </div>
      </div>
    </div>
  );
}
