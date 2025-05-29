export default function QuestionHeading({ question, formatDate }) {
  // Obtener la fecha formateada y otros datos del objeto question
  const time = formatDate ? formatDate(question?.date) : "";
  const user = question?.user_name || "Usuario";
  const userImage = question?.user_image || "https://images.dog.ceo/breeds/maltese/n02085936_6927.jpg";
  const title = question?.title || "";

  return (
    <div className="space-y-4">
      <header className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <img
            src={userImage}
            alt={user}
            width={40}
            height={40}
            className="rounded-full border-2 border-white shadow-sm"
          />
          <p className="font-medium text-gray-700 text-sm md:text-base">{user}</p>
        </div>
        <p className="text-primary font-medium text-sm md:text-base">{time}</p>
      </header>
      
      <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 break-words">
          {title}
        </h1>
      </div>
    </div>
  );
}
