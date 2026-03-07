import Image from "next/image";

export default function LoginLeftSide() {
  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center">
      <div className="absolute top-12 left-12">
        <Image
          src="/Instagram-Gradient-Logo-PNG.png"
          alt="Instagram"
          width={75}
          height={75}
        />
      </div>

      <div className="flex flex-col items-center text-center text-white ml-7.5 mt-[18%]">
        <h1 className="text-[36px] font-normal mb-3">
          See everyday moments from
        </h1>
        <p className="text-[36px]">
          <span className="font-normal">your </span>
          <span className="bg-linear-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            close friends
          </span>
          .
        </p>

        <div className=" flex items-center justify-center">
          <Image
            src="/TZyiZuKrlQL.png"
            alt="Friends"
            width={470}
            height={470}
          />
        </div>
      </div>
    </div>
  );
}
