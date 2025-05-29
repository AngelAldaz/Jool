export default function QuestionHeading({ user, userImage, time }) {
  return (
    <header className="flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <img
          src={userImage}
          alt={user}
          width={40}
          height={40}
          className="rounded-full"
        />
        <p className="font-light tracking-wide text-sm md:text-base">{user}</p>
      </div>
      <p className="text-primary font-light text-sm md:text-base">{time}</p>
    </header>
  );
}
