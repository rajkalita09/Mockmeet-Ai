import { Lightbulb, Volume2 } from 'lucide-react';
import React, { useState } from 'react';

function QuestionsSection({ mockInterviewQuestions, activeQuestionIndex, setActiveQuestionIndex }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const textToSpeech = (text) => {
    if (!('speechSynthesis' in window)) {
      alert('Sorry, your browser does not support text to speech');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const isHindi = /[\u0900-\u097F]/.test(text);
    utterance.lang = isHindi ? 'hi-IN' : 'en-US';

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return mockInterviewQuestions && (
    <div className='p-5 border rounded-xl my-6 bg-white shadow-lg w-full'>

      {/* QUESTION TABS */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4'>
        {mockInterviewQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => setActiveQuestionIndex(index)}
            className={`py-2 rounded-full text-xs md:text-sm transition-all duration-300 
              ${activeQuestionIndex === index
                ? 'bg-primary text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-primary/10'}`}
          >
            Question #{index + 1}
          </button>
        ))}
      </div>

      {/* ACTIVE QUESTION */}
      <div className='mb-2'>
        <p className='text-md text-gray-800 font-medium leading-snug'>
          {mockInterviewQuestions[activeQuestionIndex]?.question}
        </p>
      </div>

      {/* TEXT TO SPEECH BUTTON */}
      <div className="flex justify-end mb-4">
        <Volume2
          onClick={() => textToSpeech(mockInterviewQuestions[activeQuestionIndex]?.question)}
          className={`cursor-pointer min-w-[20px] text-xl ${
            isSpeaking ? 'text-green-600' : 'text-gray-500 hover:text-black'
          }`}
        />
      </div>

      {/* SEPARATOR */}
      <div className="border-t border-gray-300 my-4" />

      {/* NOTE SECTION */}
      <div className='border rounded-lg p-4 bg-blue-50'>
        <h2 className='flex gap-2 items-center text-blue-600 font-semibold'>
          <Lightbulb />
          Note:
        </h2>
        <p className='text-sm text-gray-700 mt-2 leading-relaxed'>
          To answer a question, first click <span className="text-red-500 font-semibold">"Record Answer"</span>, then speak clearly.
          Your voice will be converted to text. After stopping the recording, review and edit the text if needed.
          Once you're satisfied, click <span className="text-primary font-semibold">"Submit Answer"</span> to save your response.
        </p>
      </div>

      {/* SEPARATOR */}
      <div className="border-t border-gray-300 my-4" />

      {/* TIP */}
      <div className="text-sm text-gray-500 text-center italic">
        💡 Tip: Take a few seconds to structure your answer before speaking.
      </div>
    </div>
  );
}

export default QuestionsSection;
