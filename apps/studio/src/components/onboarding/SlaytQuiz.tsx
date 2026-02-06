'use client';

import React, { useState, useCallback } from 'react';
import styles from './SlaytQuiz.module.css';

interface QuizQuestion {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    traits: {
      orisha?: string;
      sephira?: string;
      trajectory?: string;
      aesthetic?: string;
    };
  }[];
}

interface QuizResult {
  suggestedOrisha: string;
  suggestedSephira: string;
  suggestedTrajectory: string;
  suggestedAesthetic: string;
  confidence: number;
  insights: string[];
}

interface SlaytQuizProps {
  onComplete: (result: QuizResult) => void;
  onSkip?: () => void;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'When facing a crossroads in life, you tend to...',
    options: [
      {
        id: 'q1a',
        text: 'Embrace chaos and find opportunity in uncertainty',
        traits: { orisha: 'Èṣù', trajectory: 'emergence', aesthetic: 'liminal' },
      },
      {
        id: 'q1b',
        text: 'Forge ahead with determination and decisive action',
        traits: { orisha: 'Ògún', trajectory: 'transformation', aesthetic: 'industrial' },
      },
      {
        id: 'q1c',
        text: 'Seek harmony and nurture connections with others',
        traits: { orisha: 'Ọ̀ṣun', trajectory: 'integration', aesthetic: 'organic' },
      },
      {
        id: 'q1d',
        text: 'Reflect deeply and seek wisdom before moving',
        traits: { orisha: 'Obàtálá', trajectory: 'transcendence', aesthetic: 'minimal' },
      },
    ],
  },
  {
    id: 'q2',
    question: 'Your creative expression is best described as...',
    options: [
      {
        id: 'q2a',
        text: 'Bold, electric, and commanding attention',
        traits: { orisha: 'Ṣàngó', sephira: 'Geburah', aesthetic: 'maximalist' },
      },
      {
        id: 'q2b',
        text: 'Fluid, transformative, and boundary-breaking',
        traits: { orisha: 'Ọya', sephira: 'Binah', aesthetic: 'avant-garde' },
      },
      {
        id: 'q2c',
        text: 'Nurturing, protective, and deeply emotional',
        traits: { orisha: 'Yemọja', sephira: 'Chesed', aesthetic: 'oceanic' },
      },
      {
        id: 'q2d',
        text: 'Precise, strategic, and purposefully designed',
        traits: { orisha: 'Ọ̀rúnmìlà', sephira: 'Chokmah', aesthetic: 'structured' },
      },
    ],
  },
  {
    id: 'q3',
    question: 'What draws you to create characters?',
    options: [
      {
        id: 'q3a',
        text: 'Exploring the depths of human psychology',
        traits: { sephira: 'Yesod', trajectory: 'emergence', aesthetic: 'psychological' },
      },
      {
        id: 'q3b',
        text: 'Building worlds and complex narratives',
        traits: { sephira: 'Malkuth', trajectory: 'integration', aesthetic: 'epic' },
      },
      {
        id: 'q3c',
        text: 'Expressing ideas and philosophical concepts',
        traits: { sephira: 'Tiphereth', trajectory: 'transcendence', aesthetic: 'conceptual' },
      },
      {
        id: 'q3d',
        text: 'Creating connections and emotional resonance',
        traits: { sephira: 'Netzach', trajectory: 'integration', aesthetic: 'emotive' },
      },
    ],
  },
];

export function SlaytQuiz({ onComplete, onSkip }: SlaytQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  const calculateResult = useCallback((allAnswers: Record<string, string>): QuizResult => {
    const traits: Record<string, Record<string, number>> = {
      orisha: {},
      sephira: {},
      trajectory: {},
      aesthetic: {},
    };

    // Tally up traits from all answers
    Object.entries(allAnswers).forEach(([questionId, optionId]) => {
      const question = QUIZ_QUESTIONS.find((q) => q.id === questionId);
      const option = question?.options.find((o) => o.id === optionId);

      if (option?.traits) {
        Object.entries(option.traits).forEach(([category, value]) => {
          if (value) {
            traits[category][value] = (traits[category][value] || 0) + 1;
          }
        });
      }
    });

    // Get top result for each category
    const getTop = (category: Record<string, number>): string => {
      const entries = Object.entries(category);
      if (entries.length === 0) return 'Unknown';
      return entries.sort((a, b) => b[1] - a[1])[0][0];
    };

    const suggestedOrisha = getTop(traits.orisha);
    const suggestedSephira = getTop(traits.sephira);
    const suggestedTrajectory = getTop(traits.trajectory);
    const suggestedAesthetic = getTop(traits.aesthetic);

    // Calculate confidence based on how decisive the answers were
    const maxPossible = QUIZ_QUESTIONS.length;
    const topScores = [
      Math.max(...Object.values(traits.orisha), 0),
      Math.max(...Object.values(traits.sephira), 0),
      Math.max(...Object.values(traits.trajectory), 0),
    ];
    const avgTopScore = topScores.reduce((a, b) => a + b, 0) / topScores.length;
    const confidence = Math.min(Math.round((avgTopScore / maxPossible) * 100 + 40), 95);

    // Generate insights
    const insights: string[] = [
      `Your responses suggest a strong resonance with ${suggestedOrisha} energy`,
      `The ${suggestedSephira} position on the Tree of Life aligns with your creative vision`,
      `Your character arc naturally gravitates toward ${suggestedTrajectory}`,
    ];

    return {
      suggestedOrisha,
      suggestedSephira,
      suggestedTrajectory,
      suggestedAesthetic,
      confidence,
      insights,
    };
  }, []);

  const handleSelectOption = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleNext = () => {
    if (!selectedOption) return;

    const newAnswers = {
      ...answers,
      [QUIZ_QUESTIONS[currentQuestion].id]: selectedOption,
    };
    setAnswers(newAnswers);
    setIsTransitioning(true);

    setTimeout(() => {
      if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedOption(null);
      } else {
        // Calculate and show result
        const quizResult = calculateResult(newAnswers);
        setResult(quizResult);
        setShowResult(true);
      }
      setIsTransitioning(false);
    }, 300);
  };

  const handleComplete = () => {
    if (result) {
      onComplete(result);
    }
  };

  const question = QUIZ_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100;

  if (showResult && result) {
    return (
      <div className={styles.container}>
        <div className={styles.resultCard}>
          <div className={styles.resultHeader}>
            <h2 className={styles.resultTitle}>Your Creative Profile</h2>
            <div className={styles.confidenceBadge}>
              {result.confidence}% Match
            </div>
          </div>

          <div className={styles.resultGrid}>
            <div className={styles.resultItem}>
              <div className={styles.resultLabel}>Primary Orisha</div>
              <div className={styles.resultValue}>{result.suggestedOrisha}</div>
            </div>
            <div className={styles.resultItem}>
              <div className={styles.resultLabel}>Sephira Position</div>
              <div className={styles.resultValue}>{result.suggestedSephira}</div>
            </div>
            <div className={styles.resultItem}>
              <div className={styles.resultLabel}>Trajectory</div>
              <div className={styles.resultValue} style={{ textTransform: 'capitalize' }}>
                {result.suggestedTrajectory}
              </div>
            </div>
            <div className={styles.resultItem}>
              <div className={styles.resultLabel}>Aesthetic</div>
              <div className={styles.resultValue} style={{ textTransform: 'capitalize' }}>
                {result.suggestedAesthetic}
              </div>
            </div>
          </div>

          <div className={styles.insightsSection}>
            <h3 className={styles.insightsTitle}>Insights</h3>
            <ul className={styles.insightsList}>
              {result.insights.map((insight, i) => (
                <li key={i} className={styles.insightItem}>
                  <span className={styles.insightBullet} />
                  {insight}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.resultActions}>
            <button
              type="button"
              onClick={handleComplete}
              className={styles.primaryButton}
            >
              Apply to Character Creation
            </button>
            <button
              type="button"
              onClick={() => {
                setShowResult(false);
                setCurrentQuestion(0);
                setAnswers({});
                setSelectedOption(null);
                setResult(null);
              }}
              className={styles.secondaryButton}
            >
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Discover Your Creative DNA</h2>
          <p className={styles.subtitle}>
            Answer 3 questions to unlock personalized character recommendations
          </p>
        </div>
        {onSkip && (
          <button type="button" onClick={onSkip} className={styles.skipButton}>
            Skip
          </button>
        )}
      </div>

      {/* Progress */}
      <div className={styles.progressContainer}>
        <div className={styles.progressInfo}>
          <span>Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className={`${styles.questionCard} ${isTransitioning ? styles.transitioning : ''}`}>
        <h3 className={styles.questionText}>{question.question}</h3>

        <div className={styles.optionsGrid}>
          {question.options.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => handleSelectOption(option.id)}
              className={`${styles.optionCard} ${selectedOption === option.id ? styles.selected : ''}`}
            >
              <span className={styles.optionText}>{option.text}</span>
              <span className={styles.optionIndicator}>
                {selectedOption === option.id ? 'X' : ''}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className={styles.navigation}>
        <button
          type="button"
          onClick={handleNext}
          disabled={!selectedOption}
          className={styles.nextButton}
        >
          {currentQuestion === QUIZ_QUESTIONS.length - 1 ? 'See Results' : 'Next Question'}
        </button>
      </div>
    </div>
  );
}
