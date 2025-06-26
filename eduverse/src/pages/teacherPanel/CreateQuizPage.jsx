import React from "react";
import CreateQuizForm from "../../components/quiz/CreateQuizForm";


const CreateQuizPage = () => {
  return (
    <div className="p-5">
      <h1 className="text-xl font-semibold mb-4">Yeni Quiz Yarat</h1>
      <CreateQuizForm />
    </div>
  );
};

export default CreateQuizPage;
