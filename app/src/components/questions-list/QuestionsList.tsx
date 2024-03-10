const QuestionsList = ({ questions }: { questions: string[] }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold">Questions</h1>
      <ul>
        {questions.map((q: string, i: number) => {
          return <li key={i}>{q}</li>;
        })}
      </ul>
    </div>
  );
};

export default QuestionsList;
