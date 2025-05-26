import Footer from "@/components/Footer";
import QuestionHeading from "@/components/QuestionHeading";
import ReturnButton from "@/components/ReturnButton";
import StickyInteractions from "@/components/StickyInteractions";
import ReactMarkdown from "react-markdown";
import Answer from "@/components/Answer";
export default function Home() {
  let title =
    "Trouble shooting when using picam2.capture_array to take picture and put them into RAM";
  let content =
    "I am using my raspberry pi to try to complete the task, which is taking a picture in, then use the function get_angle to find the angle of reference of the blue dots in the picture. Then, turing the survo motor to aim the angle. However when I run my program I got this error: You can see how I add a 'imshow' in the while loop and a 'print('no center of mass found')' in the function get_angle. I would expect the picture to show up for a second and the screen printing the message of 'no center of mass found' cause I just take a picture of the walls and there are no blue dots in the picture. Strange enough, it does not print out anything, and no pictures shows up. Also, it does not automatically end for after 10s. I am using my raspberry pi to try to complete the task, which is taking a picture in, then use the function get_angle to find the angle of reference of the blue dots in the picture. Then, turing the survo motor to aim the angle. However when I run my program I got this error: You can see how I add a 'imshow' in the while loop and a 'print('no center of mass found')' in the function get_angle. I would expect the picture to show up for a second and the screen printing the message of 'no center of mass found' cause I just take a picture of the walls and there are no blue dots in the picture. Strange enough, it does not print out anything, and no pictures shows up. Also, it does not automatically end for after 10s. I am using my raspberry pi to try to complete the task, which is taking a picture in, then use the function get_angle to find the angle of reference of the blue dots in the picture. Then, turing the survo motor to aim the angle. However when I run my program I got this error: You can see how I add a 'imshow' in the while loop and a 'print('no center of mass found')' in the function get_angle. I would expect the picture to show up for a second and the screen printing the message of 'no center of mass found' cause I just take a picture of the walls and there are no blue dots in the picture. Strange enough, it does not print out anything, and no pictures shows up. Also, it does not automatically end for after 10s. I am using my raspberry pi to try to complete the task, which is taking a picture in, then use the function get_angle to find the angle of reference of the blue dots in the picture. Then, turing the survo motor to aim the angle. However when I run my program I got this error: You can see how I add a 'imshow' in the while loop and a 'print('no center of mass found')' in the function get_angle. I would expect the picture to show up for a second and the screen printing the message of 'no center of mass found' cause I just take a picture of the walls and there are no blue dots in the picture. Strange enough, it does not print out anything, and no pictures shows up. Also, it does not automatically end for after 10s.";
  let user = "John Doe";
  let userImage = "https://images.dog.ceo/breeds/maltese/n02085936_6927.jpg";
  let time = "Hace 6 días";
  let views = 325;
  let responses = 30;
  let stars = 200;
  let markdownContent = `
### 🔍 **1. El programa no imprime ni muestra nada**
Esto sugiere que tal vez el programa nunca llega a ejecutar las líneas dentro del \`while\` o dentro de la función \`get_angle\`.

- Asegúrate de que **sí estás llamando a la función \`get_angle\`** y que el código dentro del ciclo \`while\` realmente se ejecuta.
- Agrega un \`print("Iniciando bucle...")\` justo antes del \`while\` para confirmar si se está ejecutando.

---

### 🧪 **2. \`imshow\` no muestra la imagen**
\`cv2.imshow()\` necesita un entorno gráfico (GUI). **En Raspberry Pi, si estás corriendo tu script desde terminal sin escritorio gráfico (como SSH), no funcionará.**

**Solución:**
- Asegúrate de ejecutar tu script desde un entorno con GUI (como el escritorio de Raspbian o usando VNC).
- Alternativamente, guarda la imagen con \`cv2.imwrite("output.jpg", image)\` para verificar que se capturó correctamente.

---

### ⏱ **3. El programa no termina tras 10 segundos**
Puede que estés usando un \`while True:\` sin control de tiempo.

**Solución:**
Asegúrate de usar una condición como esta:
\`\`\`python
import time
start = time.time()
while time.time() - start < 10:
    # tu código aquí
\`\`\`

---

### 🔧 **4. \`get_angle\` no imprime**
Asegúrate de que la condición que evalúa si se encontró o no el centro de masa **realmente se cumple**. Si estás usando detección por color:

- Revisa si estás aplicando correctamente los umbrales del color azul.
- Puedes imprimir el resultado de la máscara (\`cv2.countNonZero(mask)\`) para saber si está detectando algo o no.

---

### 🛠 Recomendaciones adicionales
- Usa \`try/except\` para capturar errores que estén interrumpiendo tu programa.
- Usa \`cv2.waitKey(1000)\` después de \`imshow()\` para dar tiempo a que se muestre.
- Usa \`print()\` dentro de cada parte crítica para verificar flujo.
`;

  return (
    <>
      <main className=" flex-1 space-y-6 mt-5 w-4/5 mx-auto">
        <ReturnButton />
        <div className="relative space-y-6 ">
          <StickyInteractions
            views={views}
            responses={responses}
            stars={stars}
            liked={false}
          />
          <section className="rounded-4xl p-6 md:p-8 bg-white  shadow-card flex flex-col gap-4 ">
            <QuestionHeading user={user} userImage={userImage} time={time} />
            <section className="bg-background rounded-xl p-5">
              <h1 className="text-xl md:text-2xl font-bold text-text break-words">
                {title}
              </h1>
            </section>
            {/* <p className="text-justify md:text-lg text-base text-primary break-words">
              {content}
            </p> */}
            <div className="flex flex-col gap-4">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </section>
        </div>
        <h1 className="text-xl md:text-2xl font-bold">Best Answer</h1>
        <Answer
          userImage={userImage}
          user={user}
          time={time}
          stars={stars}
          markdownContent={markdownContent}
          correct={true}
        />
        <h1 className="text-xl md:text-2xl font-bold">{responses} Responses</h1>
        <Answer
          userImage={userImage}
          user={user}
          time={time}
          stars={stars}
          markdownContent={markdownContent}
          correct={false}
        />
        <Answer
          userImage={userImage}
          user={user}
          time={time}
          stars={stars}
          markdownContent={markdownContent}
          correct={false}
        />
      </main>
      <Footer />
    </>
  );
}
