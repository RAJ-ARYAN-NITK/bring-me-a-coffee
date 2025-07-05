import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="flex justify-center flex-col gap-4 items-center text-white h-[44vh] px-5 md:px-0 text-xs md:text-base">
        <div className="font-bold flex gap-2 md:gap-2 md:text-5xl justify-center items-center text-3xl">
            Buy Me a Coffee
          <span>
            <Image className="invertImg" src="/coffee.gif" alt="Coffee animation" width={80} height={80} unoptimized />
          </span>
        </div>
        <p className="text-xs">
          A crowd funding platform for creators to fund their projects.
   
        </p>
        <p className="text-center text-sm md:text-left">

          A place where your fans can buy you a coffee. Unleash the power of your fans and get your projects funded.
        </p>
        <div>
        <Link href={"/login"}>
          <button
            type="button"
            className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Start Here
          </button>
        </Link>
          <Link href={"/about"}>
          <button
            type="button"
            className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Read More
          </button>
          </Link>
        </div>
      </div>

      <div className="bg-white h-1 opacity-10"></div>

      <div className="text-white container mx-auto pb-32 pt-14">
        <h2 className="text-2xl font-bold text-center mb-14">
          Your fans can buy you a Coffee
        </h2>
        <div className="flex gap-5 justify-around">
          <div className="item space-y-3 flex flex-col items-center justify-center">
            <Image
              className="bg-slate-400 rounded-full p-2 text-black"
              width={90}
              height={60}
              src="/man.gif"
              alt="A man icon representing fans"
              unoptimized
            />
            <p className="font-bold">Fans want to help</p>
            <p className="text-center text-xs">Your fans are available to support you</p>
          </div>
          <div className="item space-y-3 flex flex-col items-center justify-center "> 
            <Image
              className="bg-slate-400 rounded-full p-2 text-black"
              width={90}
              height={60}
              src="/coin.gif"
              alt="A coin icon representing funding"
              unoptimized
            />
            <p className="font-bold">Fans want to contribute</p>
            <p className="text-center text-sm">Your fans are willing to contribute financially</p>
          </div>
          <div className="item space-y-3 flex flex-col items-center justify-center">
            <Image
              className="bg-slate-400 rounded-full p-2 text-black"
              width={90}
              height={60}
              src="/group.gif"
              alt="A group icon representing community"
              unoptimized
            />
            <p className="font-bold">Fans want to collaborate</p>
            <p className="text-center text-xs">Your fans are ready to collaborate with you</p>
          </div>
        </div>
      </div>

      <div className="bg-white h-1 opacity-10"></div>

      <div className="text-white container mx-auto pb-32 pt-14 flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-center mb-14"> Learn more about us </h2>
        <iframe width="720" height="609" src="https://www.youtube.com/embed/y9hQfMCwAvg" title="Let Us Support You | Albion Center for Professional Development" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
      </div>
    </div>
  );
}