"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCcw,
  Trophy,
  Clock,
  Star,
  Brain,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MemoryCard {
  id: string;
  content: string;
  match: string;
  isFlipped: boolean;
  isMatched: boolean;
  type: 'concept' | 'definition';
}

interface MemoryGameProps {
  onClose: () => void;
}

export default function MemoryGame({ onClose }: MemoryGameProps) {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'completed'>('menu');
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matches, setMatches] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const cardPairs = useMemo(() => ({
    easy: [
      { concept: "Conductismo", definition: "La conducta se explica como respuestas observables a estímulos" },
      { concept: "Psicoanálisis", definition: "Explora procesos inconscientes que influyen en la conducta" },
      { concept: "Gestalt", definition: "Percibimos totalidades con leyes de buena forma y cierre" },
      { concept: "Disonancia Cognitiva", definition: "Inconsistencia entre actitudes y conductas" },
      { concept: "Cultura Organizacional", definition: "Presunciones aprendidas para resolver adaptación externa e interna" },
      { concept: "Emociones Básicas", definition: "Ira, miedo, tristeza, felicidad, repugnancia y sorpresa" },
    ],
    medium: [
      { concept: "Condicionamiento Operante", definition: "Skinner: modificación mediante refuerzos y castigos" },
      { concept: "Aprendizaje Observacional", definition: "Bandura: adquisición por observación y ejecución posterior" },
      { concept: "Neuronas Espejo", definition: "Base neurológica para resonancia emocional y empatía" },
      { concept: "Cinco Grandes", definition: "Extroversión, afabilidad, meticulosidad, estabilidad, apertura" },
      { concept: "Institucionalización", definition: "Externalización, objetivación e internalización (Berger-Luckmann)" },
      { concept: "Niveles de Schein", definition: "Artefactos, valores y presunciones básicas" },
      { concept: "Sesgos Cognitivos", definition: "Anclaje, confirmación, disponibilidad y exceso de confianza" },
      { concept: "Hofstede", definition: "Distancia al poder, individualismo, masculinidad, incertidumbre" },
    ],
    hard: [
      { concept: "Células Fusiformes", definition: "Facilitan respuestas rápidas en interacción social" },
      { concept: "Osciladores", definition: "Sincronizan movimientos y favorecen conexión" },
      { concept: "Reificación", definition: "Oculta el origen humano de las instituciones" },
      { concept: "Legitimación", definition: "Tradición, explicaciones, teorías y universos simbólicos" },
      { concept: "Racionalidades", definition: "Política, afectiva, técnica, económica, ideológica y estructural" },
      { concept: "Trabajo Emocional", definition: "Actuación superficial vs profunda, TEA e inteligencia emocional" },
      { concept: "Escalamiento del Compromiso", definition: "Persistir en decisiones fallidas por inversión previa" },
      { concept: "Aversión al Riesgo", definition: "Preferencia por opciones seguras sobre potencialmente mejores" },
      { concept: "Valencias de Lewin", definition: "Atracción/evitación en regiones del espacio vital" },
      { concept: "Meta Control", definition: "Control de valores que genera doble discurso organizacional" },
    ]
  }), []);

  const initializeGame = (selectedDifficulty: 'easy' | 'medium' | 'hard') => {
    const pairs = cardPairs[selectedDifficulty];
    const gameCards: MemoryCard[] = [];
    
    pairs.forEach((pair, index) => {
      gameCards.push({
        id: `concept-${index}`,
        content: pair.concept,
        match: `definition-${index}`,
        isFlipped: false,
        isMatched: false,
        type: 'concept'
      });
      gameCards.push({
        id: `definition-${index}`,
        content: pair.definition,
        match: `concept-${index}`,
        isFlipped: false,
        isMatched: false,
        type: 'definition'
      });
    });

    // Shuffle cards
    const shuffled = [...gameCards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setGameState('playing');
    setFlippedCards([]);
    setMatches(0);
    setAttempts(0);
    setTimeElapsed(0);
    setDifficulty(selectedDifficulty);
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing') {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  // Check for matches
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      const firstCard = cards.find(c => c.id === first);
      const secondCard = cards.find(c => c.id === second);

      if (firstCard && secondCard && firstCard.match === second) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isMatched: true }
              : card
          ));
          setMatches(prev => prev + 1);
          setFlippedCards([]);
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1500);
      }
      setAttempts(prev => prev + 1);
    }
  }, [flippedCards, cards]);

  // Check for game completion
  useEffect(() => {
    const totalPairs = cardPairs[difficulty].length;
    if (matches === totalPairs && gameState === 'playing') {
      setGameState('completed');
    }
  }, [matches, cardPairs, difficulty, gameState]);

  const handleCardClick = (cardId: string) => {
    if (flippedCards.length >= 2) return;
    if (flippedCards.includes(cardId)) return;
    
    const card = cards.find(c => c.id === cardId);
    if (card?.isMatched) return;

    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));
    setFlippedCards(prev => [...prev, cardId]);
  };

  const resetGame = () => {
    setGameState('menu');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPerformanceMessage = () => {
    const accuracy = matches > 0 ? (matches / attempts) * 100 : 0;
    if (accuracy >= 80) return "¡Excelente memoria! 🧠";
    if (accuracy >= 60) return "¡Buen trabajo! 👍";
    return "Sigue practicando 💪";
  };

  if (gameState === 'menu') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <Card className="w-full max-w-2xl mx-4">
          <CardHeader className="text-center bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Brain className="w-8 h-8" />
              Juego de Memoria
            </CardTitle>
            <p className="text-pink-100">Conecta conceptos con sus definiciones</p>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold mb-4">Selecciona la dificultad:</h3>
            
            <div className="grid gap-4">
              <Button
                onClick={() => initializeGame('easy')}
                className="p-6 text-left bg-green-50 border-2 border-green-200 hover:border-green-400 text-green-800"
                variant="outline"
              >
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6" />
                  <div>
                    <div className="font-semibold">Fácil</div>
                    <div className="text-sm text-green-600">6 pares • Conceptos básicos</div>
                  </div>
                </div>
              </Button>

              <Button
                onClick={() => initializeGame('medium')}
                className="p-6 text-left bg-yellow-50 border-2 border-yellow-200 hover:border-yellow-400 text-yellow-800"
                variant="outline"
              >
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6" />
                  <div>
                    <div className="font-semibold">Medio</div>
                    <div className="text-sm text-yellow-600">8 pares • Teorías importantes</div>
                  </div>
                </div>
              </Button>

              <Button
                onClick={() => initializeGame('hard')}
                className="p-6 text-left bg-red-50 border-2 border-red-200 hover:border-red-400 text-red-800"
                variant="outline"
              >
                <div className="flex items-center gap-3">
                  <Trophy className="w-6 h-6" />
                  <div>
                    <div className="font-semibold">Difícil</div>
                    <div className="text-sm text-red-600">10 pares • Conceptos avanzados</div>
                  </div>
                </div>
              </Button>
            </div>

            <div className="pt-4 border-t">
              <Button onClick={onClose} variant="outline" className="w-full">
                Volver al estudio
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (gameState === 'playing') {
    const totalPairs = cardPairs[difficulty].length;
    const progress = (matches / totalPairs) * 100;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-6 h-6" />
                Juego de Memoria - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatTime(timeElapsed)}
                </div>
                <div>Intentos: {attempts}</div>
                <div>Pares: {matches}/{totalPairs}</div>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className={`grid gap-3 ${
              difficulty === 'easy' ? 'grid-cols-3 md:grid-cols-4' : 
              difficulty === 'medium' ? 'grid-cols-4 md:grid-cols-4' : 
              'grid-cols-4 md:grid-cols-5'
            }`}>
              <AnimatePresence>
                {cards.map((card) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
                    whileTap={{ scale: card.isMatched ? 1 : 0.95 }}
                    className={`aspect-square cursor-pointer rounded-lg border-2 transition-all duration-300 ${
                      card.isMatched
                        ? 'border-green-500 bg-green-50'
                        : card.isFlipped
                        ? card.type === 'concept'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 bg-gray-100 hover:border-gray-400'
                    }`}
                    onClick={() => handleCardClick(card.id)}
                  >
                    <div className="h-full flex items-center justify-center p-2">
                      {card.isFlipped || card.isMatched ? (
                        <div className="text-center">
                          <div className={`text-xs font-medium mb-1 ${
                            card.type === 'concept' ? 'text-blue-600' : 'text-purple-600'
                          }`}>
                            {card.type === 'concept' ? 'CONCEPTO' : 'DEFINICIÓN'}
                          </div>
                          <div className={`font-semibold ${
                            difficulty === 'hard' ? 'text-xs' : 'text-sm'
                          } leading-tight`}>
                            {card.content}
                          </div>
                        </div>
                      ) : (
                        <div className="text-2xl">🧠</div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                💡 Conecta cada concepto con su definición correcta
              </div>
              <Button onClick={resetGame} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reiniciar
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (gameState === 'completed') {
    const totalPairs = cardPairs[difficulty].length;
    const accuracy = (matches / attempts) * 100;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <Card className="w-full max-w-2xl mx-4">
          <CardHeader className="text-center bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Trophy className="w-8 h-8" />
              ¡Juego Completado!
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 text-center space-y-6">
            <div className="space-y-4">
              <div className="text-4xl">🎉</div>
              <p className="text-xl text-gray-700">{getPerformanceMessage()}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl">⏱️</div>
                <div className="text-blue-800 font-semibold">Tiempo</div>
                <div className="text-2xl font-bold text-blue-600">{formatTime(timeElapsed)}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl">🎯</div>
                <div className="text-green-800 font-semibold">Precisión</div>
                <div className="text-2xl font-bold text-green-600">{Math.round(accuracy)}%</div>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-purple-800 font-semibold">Estadísticas</div>
              <div className="text-sm text-purple-600">
                {matches} pares correctos en {attempts} intentos
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => initializeGame(difficulty)} className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                Jugar otra vez
              </Button>
              <Button onClick={resetGame} variant="outline" className="flex-1">
                Cambiar dificultad
              </Button>
              <Button onClick={onClose} variant="outline" className="flex-1">
                Volver al estudio
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return null;
}