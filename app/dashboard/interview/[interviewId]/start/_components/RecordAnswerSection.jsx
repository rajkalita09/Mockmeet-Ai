"use client";
import React, { useState, useEffect } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { Button } from '@/components/ui/button'
import {  Mic } from 'lucide-react'
import { UserAnswer } from '@/utils/schema'
import { chatSession } from '@/utils/GeminiAiModal'
import { db } from '@/utils/db'
import moment from 'moment'
import { useUser } from '@clerk/nextjs'
import Webcam from 'react-webcam';
import Image from 'next/image';

export default function RecordAnswerSection({ mockInterviewQuestions, activeQuestionIndex, interviewData }) {
  const { user } = useUser()

  const {
    transcript,
    interimTranscript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition()

  const [finalAnswer, setFinalAnswer] = useState('')
  const [hasSpoken, setHasSpoken] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedAnswers, setSubmittedAnswers] = useState(new Set())

  useEffect(() => {
    resetTranscript()
    setFinalAnswer('')
    setHasSpoken(false)
  }, [activeQuestionIndex])

  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser does not support Speech Recognition.</span>
  }

  const startListening = () => {
    resetTranscript()
    setFinalAnswer('')
    setHasSpoken(false)
    SpeechRecognition.startListening({ continuous: true, language: 'en-US' })
  }

  const stopListening = () => {
    SpeechRecognition.stopListening()
    const trimmedTranscript = transcript.trim()
    setFinalAnswer(trimmedTranscript)
    setHasSpoken(trimmedTranscript.length > 0)
  }

  const handleSubmit = async () => {
    if (!finalAnswer.trim()) {
      alert('Please speak something before submitting.')
      return
    }

    const questionData = mockInterviewQuestions[activeQuestionIndex]
    if (!questionData) {
      alert('Interview question not found. Cannot submit feedback.')
      return
    }

    const question = questionData.question
    setIsSubmitting(true)

    try {
      const feedbackPrompt =
        `The interview question is: "${question}"\n` +
        `The user's answer is: "${finalAnswer}"\n\n` +
        `Instructions:\n` +
        `- If the question is in Hindi, then provide feedback in Hindi only don't write the feedback in English even if the user gives the answer in English".\n` +
        `- If the question is in English, then provide feedback in English only.\n\n` +
        `Return the response in JSON format as:\n` +
        `{\n  "rating": "X/10",\n  "feedback": "your feedback text here in 5-7 lines"\n}`

      const result = await chatSession.sendMessage(feedbackPrompt)
      const responseText = await result.response.text()

      console.log("🟡 Raw Gemini response:", responseText)

      let rawJson = responseText.match(/```json([\s\S]*?)```/)?.[1]?.trim() || responseText.trim()

      rawJson = rawJson.replace(
        /"feedback"\s*:\s*"([\s\S]*?)"\s*(,|\})/,
        (_, feedbackText, endChar) => {
          const fixedFeedback = feedbackText.replace(/(?<!\\)"/g, '\\"')
          return `"feedback": "${fixedFeedback}"${endChar}`
        }
      )

      let JsonFeedbackResponse
      try {
        JsonFeedbackResponse = JSON.parse(rawJson)
        console.log("🟢 Parsed Gemini JSON:", JsonFeedbackResponse)
      } catch (e) {
        console.error("🔴 Malformed JSON from Gemini:\n", rawJson)
        alert("AI response was malformed. Please try again.")
        return
      }

      const response = await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: question,
        correctAns: questionData.answer,
        userAns: finalAnswer,
        feedback: JsonFeedbackResponse?.feedback,
        rating: JsonFeedbackResponse?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-YYYY HH:mm:ss'),
      })

      if (response) {
        const updatedSet = new Set(submittedAnswers)
        updatedSet.add(activeQuestionIndex)
        setSubmittedAnswers(updatedSet)
      } else {
        alert('Failed to submit your answer. Please try again.')
      }

    } catch (error) {
      console.error('❌ Error submitting answer:', error)
      alert('An error occurred while submitting your answer. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">

      {/* ANSWER TEXTAREA */}
      <textarea
        className="w-[90%] max-w-xl h-40 border border-gray-400 rounded-lg p-4 mt-7"
        style={{ color: listening ? 'green' : 'black' }}
        value={listening ? (transcript + interimTranscript) : finalAnswer}
        readOnly={listening}
        placeholder={listening ? "Listening... you can't edit now" : "Your answer will appear here"}
        onChange={e => !listening && setFinalAnswer(e.target.value)}
      />

      {/* MODIFICATION MESSAGE */}
      {!listening && finalAnswer && (
        <div className="w-[90%] max-w-xl mt-2 border-t border-gray-400 pt-2 text-gray-600 italic text-sm">
          You can modify your answer now.
        </div>
      )}

     

      {/* RECORD + SUBMIT BUTTONS */}
      <div className="flex flex-col items-center gap-3 my-3">
        <Button
          variant="outline"
          onClick={listening ? stopListening : startListening}
        >
          {listening ? (
            <h2 className="text-red-500 flex items-center gap-2">
              <Mic /> Stop Recording...
            </h2>
          ) : (
            'Record Answer'
          )}

        </Button>
          <div className="flex flex-col mt-4 justify-center items-center bg-black rounded-lg p-2 relative">
        <Image src="/Webcam.png" alt="Webcam Icon" width={100} height={100} className="absolute" />
        <Webcam mirrored style={{ height:200, width: '100%', zIndex: 10 }} />
      </div>

        <Button
          onClick={handleSubmit}
          disabled={listening || !hasSpoken || isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Answer'}
        </Button>
        </div>

        {/* SUCCESS MESSAGE */}
        {submittedAnswers.has(activeQuestionIndex) && (
        <div className="w-[90%] max-w-xl mt-2 text-green-600 flex justify-center items-center mx-auto text-sm font-semibold">
        ✅ Answer saved successfully!
        </div>
          )}

      </div>
  )
}
