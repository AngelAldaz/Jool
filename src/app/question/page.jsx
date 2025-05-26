import Footer from "@/components/Footer";
import QuestionHeading from "@/components/QuestionHeading";
import ReturnButton from "@/components/ReturnButton";
import StickyInteractions from "@/components/StickyInteractions";
export default function Home() {
  let title =
    "Trouble shooting when using picam2.capture_array to take picture and put them into RAM";
  let content =
    "I am using my raspberry pi to try to complete the task, which is taking a picture in, then use the function get_angle to find the angle of reference of the blue dots in the picture. Then, turing the survo motor to aim the angle. However when I run my program I got this error: You can see how I add a 'imshow' in the while loop and a 'print('no center of mass found')' in the function get_angle. I would expect the picture to show up for a second and the screen printing the message of 'no center of mass found' cause I just take a picture of the walls and there are no blue dots in the picture. Strange enough, it does not print out anything, and no pictures shows up. Also, it does not automatically end for after 10s. I am using my raspberry pi to try to complete the task, which is taking a picture in, then use the function get_angle to find the angle of reference of the blue dots in the picture. Then, turing the survo motor to aim the angle. However when I run my program I got this error: You can see how I add a 'imshow' in the while loop and a 'print('no center of mass found')' in the function get_angle. I would expect the picture to show up for a second and the screen printing the message of 'no center of mass found' cause I just take a picture of the walls and there are no blue dots in the picture. Strange enough, it does not print out anything, and no pictures shows up. Also, it does not automatically end for after 10s. I am using my raspberry pi to try to complete the task, which is taking a picture in, then use the function get_angle to find the angle of reference of the blue dots in the picture. Then, turing the survo motor to aim the angle. However when I run my program I got this error: You can see how I add a 'imshow' in the while loop and a 'print('no center of mass found')' in the function get_angle. I would expect the picture to show up for a second and the screen printing the message of 'no center of mass found' cause I just take a picture of the walls and there are no blue dots in the picture. Strange enough, it does not print out anything, and no pictures shows up. Also, it does not automatically end for after 10s. I am using my raspberry pi to try to complete the task, which is taking a picture in, then use the function get_angle to find the angle of reference of the blue dots in the picture. Then, turing the survo motor to aim the angle. However when I run my program I got this error: You can see how I add a 'imshow' in the while loop and a 'print('no center of mass found')' in the function get_angle. I would expect the picture to show up for a second and the screen printing the message of 'no center of mass found' cause I just take a picture of the walls and there are no blue dots in the picture. Strange enough, it does not print out anything, and no pictures shows up. Also, it does not automatically end for after 10s.";
  let user = "John Doe";
  let userImage = "https://images.dog.ceo/breeds/maltese/n02085936_6927.jpg";
  let time = "Hace 6 días";
  let views = "325";
  let comments = "30";
  let stars = 200;
  return (
    <>
      <main className=" flex-1 space-y-6 mt-5 w-4/5 mx-auto">
        <ReturnButton />
        <div className="relative space-y-6 pb-10">
          <StickyInteractions
            views={views}
            comments={comments}
            stars={stars}
            liked={false}
          />
          <section className="rounded-4xl p-6 md:p-8 bg-white  shadow-card flex flex-col gap-4">
            <QuestionHeading user={user} userImage={userImage} time={time} />
            <section className="bg-background rounded-xl p-5">
              <h1 className="text-xl md:text-2xl font-bold text-text break-words">
                {title}
              </h1>
            </section>
            <p className="text-justify md:text-lg text-base text-primary break-words">
              {content}
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
