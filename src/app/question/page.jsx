"use client";

import Footer from "@/components/Footer";
import QuestionHeading from "@/components/QuestionHeading";
import ReturnButton from "@/components/ReturnButton";
import StickyInteractions from "@/components/StickyInteractions";
import ReactMarkdown from "react-markdown";
import Answer from "@/components/Answer";
import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
export default function Home() {
  // Estado para el formulario de nueva respuesta
  const [newResponse, setNewResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

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

  // Función para manejar el envío de la nueva respuesta
  const handleSubmitResponse = async (e) => {
    e.preventDefault();

    if (!newResponse.trim()) {
      setSubmitMessage("Por favor, escribe una respuesta antes de enviar.");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");
    setSubmitMessage("¡Respuesta enviada correctamente!");
    setNewResponse(""); // Limpiar el formulario
    setIsSubmitting(false);

    // try {
    //   // Aquí haces el POST a tu API
    //   const response = await fetch("/api/responses", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       content: newResponse,
    //       questionId: "question-id", // Reemplaza con el ID real de la pregunta
    //       userId: "current-user-id", // Reemplaza con el ID del usuario actual
    //     }),
    //   });

    //   if (response.ok) {
    //     setSubmitMessage("¡Respuesta enviada correctamente!");
    //     setNewResponse(""); // Limpiar el formulario
    //   } else {
    //     throw new Error("Error al enviar la respuesta");
    //   }
    // } catch (error) {
    //   console.error("Error:", error);
    //   setSubmitMessage("Error al enviar la respuesta. Inténtalo de nuevo.");
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

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
            <div className="flex flex-col gap-4">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </section>
        </div>
        <h1 className="text-xl md:text-2xl font-bold" id="answers">
          Best Answer
        </h1>
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

        {/* Formulario para nueva respuesta */}
        <section className="rounded-4xl p-6 md:p-8 bg-white shadow-sm">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Tu respuesta</h2>
          <form onSubmit={handleSubmitResponse} className="space-y-4">
            <div data-color-mode="light">
              <label
                htmlFor="response-input"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Escribe tu respuesta (puedes usar Markdown)
              </label>
              <MDEditor value={newResponse} onChange={setNewResponse} />
            </div>

            {/* Vista previa del markdown
            {newResponse && (
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Vista previa:
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg ">
                  <ReactMarkdown>{newResponse}</ReactMarkdown>
                </div>
              </div>
            )} */}

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={isSubmitting || !newResponse.trim()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors hover:cursor-pointer"
              >
                {isSubmitting ? "Enviando..." : "Publicar respuesta"}
              </button>

              {submitMessage && (
                <p
                  className={`text-sm ${
                    submitMessage.includes("Error")
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {submitMessage}
                </p>
              )}
            </div>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
