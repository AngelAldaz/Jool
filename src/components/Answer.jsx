import ReactMarkdown from "react-markdown";
import AnswerInfo from "./AnswerInfo";
export default function Answer({
  userImage,
  user,
  time,
  stars,
  markdownContent,
  correct,
}) {
  return (
    <section
      className={`rounded-4xl p-6 md:p-8 ${
        correct ? "bg-green-50" : "bg-white"
      } border-2 border-green-200 shadow-sm flex flex-col md:flex-row gap-4  text-primary`}
    >
      <AnswerInfo
        userImage={userImage}
        user={user}
        time={time}
        stars={stars}
        liked={false}
      />
      <div className="flex flex-col gap-4 break-all">
        <ReactMarkdown>{markdownContent}</ReactMarkdown>
      </div>
    </section>
  );
}
