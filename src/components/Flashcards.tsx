"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Shuffle,
  BookOpen,
  Eye,
  EyeOff,
  Trophy,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  difficulty: 'fácil' | 'medio' | 'difícil';
  mastered: boolean;
}

interface FlashcardsProps {
  onClose: () => void;
}

export default function Flashcards({ onClose }: FlashcardsProps) {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mastered, setMastered] = useState<Set<string>>(new Set());
  const [showMasteredOnly, setShowMasteredOnly] = useState(false);

  const allFlashcards: Flashcard[] = useMemo(() => [
    {
      id: "f1",
      front: "¿Qué es la Tríada Cognitiva?",
      back: "Modelo que incluye tres componentes interrelacionados:\n• Cognición (pensamientos)\n• Afecto (emociones)\n• Conducta (acciones)\n\nLa conducta depende de interpretaciones subjetivas de la realidad.",
      category: "Modelo Cognitivo",
      difficulty: "medio",
      mastered: false
    },
    {
      id: "f2",
      front: "Condicionamiento Operante (Skinner)",
      back: "Modifica la conducta mediante consecuencias:\n• Refuerzo positivo: Agregar algo deseado\n• Refuerzo negativo: Quitar algo indeseado\n• Castigo: Consecuencia desagradable\n• Extinción: Eliminación del refuerzo",
      category: "Conductismo",
      difficulty: "fácil",
      mastered: false
    },
    {
      id: "f3",
      front: "Tres Niveles de Cultura (Schein)",
      back: "1. ARTEFACTOS/CREACIONES (visible)\n   - Lo que se ve y oye\n2. VALORES (conscientes)\n   - Estrategias, metas, filosofías\n3. PRESUNCIONES BÁSICAS (inconscientes)\n   - Creencias automáticas e invisibles",
      category: "Cultura Organizacional",
      difficulty: "medio",
      mastered: false
    },
    {
      id: "f4",
      front: "Neuronas Espejo",
      back: "Base neurológica de la inteligencia social:\n• Permiten resonancia emocional\n• Facilitan la empatía\n• Se activan al observar acciones de otros\n• Fundamentales para el liderazgo efectivo\n\n(Goleman y Boyatzis)",
      category: "Inteligencia Social",
      difficulty: "difícil",
      mastered: false
    },
    {
      id: "f5",
      front: "6 Emociones Básicas Universales",
      back: "1. IRA\n2. MIEDO\n3. TRISTEZA\n4. FELICIDAD\n5. REPUGNANCIA\n6. SORPRESA\n\nSon innatas y se expresan de forma similar en todas las culturas.",
      category: "Emociones",
      difficulty: "medio",
      mastered: false
    },
    {
      id: "f6",
      front: "Disonancia Cognitiva",
      back: "DEFINICIÓN: Inconsistencia entre actitudes y conductas\n\nSE REDUCE CUANDO:\n• Alta importancia del tema\n• Poca influencia sobre la situación\n• Recompensas significativas\n\nGenera tensión psicológica que buscamos resolver.",
      category: "Actitudes",
      difficulty: "medio",
      mastered: false
    },
    {
      id: "f7",
      front: "Leyes de la Gestalt",
      back: "Principios de percepción:\n• BUENA FORMA: Figuras simétricas\n• CIERRE: Completamos figuras\n• SEMEJANZA: Agrupamos similares\n• PROXIMIDAD: Cercanía = relación\n• CONTINUIDAD: Seguimos líneas\n• FIGURA-FONDO: Distinguimos elementos",
      category: "Gestalt",
      difficulty: "difícil",
      mastered: false
    },
    {
      id: "f8",
      front: "Los Cinco Grandes (Personalidad)",
      back: "1. EXTROVERSIÓN: Sociabilidad, asertividad\n2. AFABILIDAD: Cooperación, confianza\n3. METICULOSIDAD: Organización, responsabilidad\n4. ESTABILIDAD EMOCIONAL: Calma, seguridad\n5. APERTURA: Creatividad, curiosidad intelectual",
      category: "Personalidad",
      difficulty: "medio",
      mastered: false
    },
    {
      id: "f9",
      front: "Proceso de Institucionalización",
      back: "DIALÉCTICO (Berger y Luckmann):\n\n1. EXTERNALIZACIÓN\n   - Creamos instituciones\n2. OBJETIVACIÓN\n   - Las instituciones se vuelven 'reales'\n3. INTERNALIZACIÓN\n   - Aprendemos las instituciones\n\nCiclo continuo de construcción social.",
      category: "Institucionalización",
      difficulty: "difícil",
      mastered: false
    },
    {
      id: "f10",
      front: "Aprendizaje Observacional (Bandura)",
      back: "CARACTERÍSTICAS:\n• Adquisición por OBSERVACIÓN\n• Ejecución POSTERIOR (no inmediata)\n• No requiere refuerzo directo\n• Incluye modelado social\n\nEXPLICA: Cómo aprendemos de otros sin experiencia directa.",
      category: "Conductismo",
      difficulty: "medio",
      mastered: false
    },
    {
      id: "f11",
      front: "Sesgos en Toma de Decisiones",
      back: "PRINCIPALES SESGOS:\n• Exceso de confianza\n• Anclaje (primera información)\n• Confirmación (buscar confirmación)\n• Disponibilidad (info reciente/memorable)\n• Escalamiento del compromiso\n• Aversión al riesgo\n• Retrospectivo ('ya lo sabía')",
      category: "Toma de Decisiones",
      difficulty: "difícil",
      mastered: false
    },
    {
      id: "f12",
      front: "Dimensiones Culturales (Hofstede)",
      back: "5 DIMENSIONES NACIONALES:\n1. Distancia al poder\n2. Individualismo/Colectivismo\n3. Masculinidad/Feminidad\n4. Evitación de incertidumbre\n5. Orientación temporal\n\nEn organizaciones predominan las PRÁCTICAS.",
      category: "Cultura Organizacional",
      difficulty: "medio",
      mastered: false
    }
  ], []);

  const filteredCards = useMemo(() => {
    if (showMasteredOnly) {
      return allFlashcards.filter(card => mastered.has(card.id));
    }
    return allFlashcards;
  }, [allFlashcards, mastered, showMasteredOnly]);

  const shuffleCards = () => {
    setCurrentCard(0);
    setIsFlipped(false);
  };

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % filteredCards.length);
    setIsFlipped(false);
  };

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
    setIsFlipped(false);
  };

  const toggleMastered = (cardId: string) => {
    const newMastered = new Set(mastered);
    if (newMastered.has(cardId)) {
      newMastered.delete(cardId);
    } else {
      newMastered.add(cardId);
    }
    setMastered(newMastered);
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        flipCard();
      } else if (event.code === 'ArrowRight') {
        nextCard();
      } else if (event.code === 'ArrowLeft') {
        prevCard();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (filteredCards.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">¡Excelente!</h2>
            <p className="text-gray-600 mb-4">
              No hay tarjetas dominadas aún. ¡Sigue practicando!
            </p>
            <Button onClick={() => setShowMasteredOnly(false)} className="w-full">
              Ver todas las tarjetas
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const currentFlashcard = filteredCards[currentCard];
  const progress = ((currentCard + 1) / filteredCards.length) * 100;
  const masteredCount = mastered.size;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              Flashcards de Estudio
            </CardTitle>
            <div className="text-right">
              <div className="text-sm opacity-90">
                {currentCard + 1} de {filteredCards.length}
              </div>
              <div className="text-xs opacity-75">
                {masteredCount} dominadas
              </div>
            </div>
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-2 mt-3">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Card Display */}
          <div className="p-8 min-h-[400px] flex items-center justify-center">
            <motion.div
              key={currentCard}
              initial={{ rotateY: 0 }}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-2xl cursor-pointer"
              style={{ transformStyle: 'preserve-3d' }}
              onClick={flipCard}
            >
              {/* Front of card */}
              <div
                className={`w-full min-h-[300px] bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-xl p-8 flex items-center justify-center text-center ${
                  isFlipped ? 'opacity-0' : 'opacity-100'
                }`}
                style={{ 
                  backfaceVisibility: 'hidden',
                  position: isFlipped ? 'absolute' : 'relative',
                  transform: 'rotateY(0deg)'
                }}
              >
                <div>
                  <div className="text-sm font-medium text-blue-600 mb-4">
                    {currentFlashcard.category}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {currentFlashcard.front}
                  </h2>
                  <p className="text-blue-600 text-sm">
                    Toca para revelar la respuesta
                  </p>
                </div>
              </div>

              {/* Back of card */}
              <div
                className={`w-full min-h-[300px] bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-200 rounded-xl p-8 flex items-center ${
                  isFlipped ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ 
                  backfaceVisibility: 'hidden',
                  position: isFlipped ? 'relative' : 'absolute',
                  transform: 'rotateY(180deg)',
                  top: isFlipped ? 0 : '0'
                }}
              >
                <div className="w-full">
                  <div className="text-sm font-medium text-green-600 mb-4">
                    {currentFlashcard.category} - RESPUESTA
                  </div>
                  <div className="text-gray-800 whitespace-pre-line leading-relaxed">
                    {currentFlashcard.back}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Controls */}
          <div className="border-t bg-gray-50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMasteredOnly(!showMasteredOnly)}
                  className={showMasteredOnly ? "bg-blue-100 text-blue-700" : ""}
                >
                  {showMasteredOnly ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                  {showMasteredOnly ? "Todas" : "Solo dominadas"}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={shuffleCards}
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  Mezclar
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={prevCard}
                  disabled={filteredCards.length <= 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <Button
                  variant={mastered.has(currentFlashcard.id) ? "default" : "outline"}
                  onClick={() => toggleMastered(currentFlashcard.id)}
                  className={mastered.has(currentFlashcard.id) ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  <Target className="w-4 h-4 mr-2" />
                  {mastered.has(currentFlashcard.id) ? "Dominada" : "Marcar como dominada"}
                </Button>

                <Button
                  variant="outline"
                  onClick={nextCard}
                  disabled={filteredCards.length <= 1}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <Button onClick={onClose} variant="outline">
                Cerrar
              </Button>
            </div>

            <div className="mt-4 text-center text-sm text-gray-600">
              💡 Usa las flechas ← → para navegar y ESPACIO para voltear
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}