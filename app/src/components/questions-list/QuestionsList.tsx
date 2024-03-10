import useLocalStorage from "@/hooks/use-local-storage";

const QuestionsList = () => {
  const [questions, _] = useLocalStorage("questions", []);
  return (
    <div>
      <h1>Questions</h1>
      <ul>
        {questions.map((q: string, i: number) => {
          return <li key={i}>{q}</li>;
        })}
      </ul>
    </div>
  );
};

export default QuestionsList;
