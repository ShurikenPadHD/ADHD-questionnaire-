'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import confetti from 'canvas-confetti'

const questions = [
  {
    type: 'multiple-choice',
    question: 'How often do you have difficulty getting things in order when you have to do a task that requires organization?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'],
  },
  {
    type: 'short-answer',
    question: 'Describe a recent situation where you felt overwhelmed by a task or project:',
  },
  {
    type: 'rating',
    question: 'On a scale of 1-5, how difficult is it for you to sit still during long meetings or classes?',
  },
]

export default function ADHDQuestionnaire() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const { toast } = useToast()

  useEffect(() => {
    // Trigger confetti when the questionnaire is completed
    if (currentStep === questions.length - 1 && Object.keys(answers).length === questions.length) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    }
  }, [currentStep, answers])

  const handleNext = () => {
    if (answers[currentStep] === undefined) {
      toast({
        title: "Please answer the question",
        description: "You need to provide an answer before moving to the next question.",
        variant: "destructive",
      })
      return
    }
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleAnswer = (answer) => {
    setAnswers({ ...answers, [currentStep]: answer })
  }

  const renderQuestion = () => {
    const question = questions[currentStep]
    switch (question.type) {
      case 'multiple-choice':
        return (
          <RadioGroup onValueChange={handleAnswer} value={answers[currentStep]}>
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )
      case 'short-answer':
        return (
          <Input
            placeholder="Type your answer here"
            value={answers[currentStep] || ''}
            onChange={(e) => handleAnswer(e.target.value)}
          />
        )
      case 'rating':
        return (
          <Slider
            min={1}
            max={5}
            step={1}
            value={[answers[currentStep] || 1]}
            onValueChange={(value) => handleAnswer(value[0])}
            className="max-w-md"
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-2xl backdrop-blur-lg bg-white/30 shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white">ADHD Quiz</CardTitle>
            <div className="w-full bg-white/30 rounded-full h-3 mb-4">
              <motion.div
                className="bg-white h-3 rounded-full"
                style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-semibold text-white">Question {currentStep + 1}</h2>
                <p className="text-xl text-white">{questions[currentStep].question}</p>
                {renderQuestion()}
              </motion.div>
            </AnimatePresence>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              onClick={handleBack}
              disabled={currentStep === 0}
              variant="outline"
              className="bg-white/20 text-white hover:bg-white/30"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={currentStep === questions.length - 1}
              className="bg-white text-purple-600 hover:bg-purple-100"
            >
              {currentStep === questions.length - 1 ? "Finish" : "Next"}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}