import Image from "next/image";
import HashTag from "./Hashtag";
export default function PostCard() {
  return (
    <div className="w-4/5 mx-auto  rounded-4xl p-6 bg-white  shadow-card">
      <section className="flex justify-between">
        <h1 className="text-2xl font-bold max-w-4xl text-text">
          Trouble shooting when using picam2.capture_array to take picture and
          put them into RAM
        </h1>
        <div className="flex gap-1 items-center">
          <a href="">
            <Image src="/views.svg" alt="Views" width={45} height={45} />
            <p className="text-center ">325</p>
          </a>
          <a href="">
            <Image src="/comment.svg" alt="Comments" width={45} height={45} />
            <p className="text-center ">30</p>
          </a>
          <a href="">
            <Image src="/starNoFill.svg" alt="Stars" width={45} height={45} />
            <p className="text-center ">200</p>
          </a>
        </div>
      </section>
      <section className="mt-1.5">
        <p className="text-justify  font-medium text-primary">
          I am using my raspberry pi to try to complete the task, which is
          taking a picture in, then use the function get_angle to find the angle
          of reference of the blue dots in the picture. Then, turing the survo
          motor to aim the angle. However when I run my program I got this
          error:
        </p>
      </section>
      <section className="flex gap-2 mt-3">
        <HashTag>python</HashTag>
        <HashTag>raspberry-pi</HashTag>
      </section>
      <section className=" mt-2">
        <p className="text-primary font-light">Hace 6 días</p>
      </section>
    </div>
  );
}
