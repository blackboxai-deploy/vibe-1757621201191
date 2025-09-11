"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Minus,
  Menu,
  Copy,
  ChevronDown,
  ChevronUp,
  Gamepad2,
  Brain,
  BookOpen,
  Trophy,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import QuizGame from "@/components/QuizGame";
import Flashcards from "@/components/Flashcards";
import MemoryGame from "@/components/MemoryGame";

type Bullet = string;

type Section = {
  id: string;
  title: string;
  bullets: Bullet[];
};

type Unit = {
  id: string;
  title: string;
  description: string;
  summary: string;
  sections: Section[];
};

function normalize(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function Highlighted({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <span>{text}</span>;
  const normText = normalize(text);
  const normQuery = normalize(query);
  const parts: { text: string; match: boolean }[] = [];

  let i = 0;
  while (i < text.length) {
    const remaining = text.slice(i);
    const remainingNorm = normText.slice(i);
    const idx = remainingNorm.indexOf(normQuery);
    if (idx === -1) {
      parts.push({ text: remaining, match: false });
      break;
    }
    if (idx > 0) {
      parts.push({ text: remaining.slice(0, idx), match: false });
    }
    parts.push({ text: remaining.slice(idx, idx + query.length), match: true });
    i = i + idx + query.length;
  }

  return (
    <>
      {parts.map((p, idx) =>
        p.match ? (
          <mark
            key={idx}
            className="bg-yellow-300 text-black rounded px-0.5"
            aria-label="Texto resaltado"
          >
            {p.text}
          </mark>
        ) : (
          <span key={idx}>{p.text}</span>
        )
      )}
    </>
  );
}

export default function PaginaUnidades() {
  const [rawQuery, setRawQuery] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("");
  
  // Estados para los juegos
  const [activeGame, setActiveGame] = useState<'none' | 'quiz' | 'flashcards' | 'memory'>('none');

  const units: Unit[] = useMemo(
    () => [
      {
        id: "u2",
        title: "UNIDAD 2: Estructuras Individuales Fundamentales",
        description:
          "Teorías de la personalidad, procesos afectivos y cognitivos, y su impacto en el comportamiento organizacional.",
        summary:
          "Esta unidad aborda las principales teorías psicológicas que explican la personalidad y el comportamiento humano, incluyendo conductismo, psicoanálisis, cognitivismo, gestalt, y enfoques sistémicos. También se estudian las emociones, actitudes, valores y procesos de percepción y toma de decisiones, fundamentales para comprender la conducta en las organizaciones.",
        sections: [
          {
            id: "u2-1",
            title: "Teorías de la personalidad: Conductismo",
            bullets: [
              "La conducta se explica como respuestas observables a estímulos del ambiente.",
              "Aprendizaje como eje central: ley del efecto (Thorndike), asociación y repetición (Watson).",
              "Modelos clave: condicionamiento clásico (Pavlov) y operante (Skinner).",
              "Consecuencias: refuerzo positivo, refuerzo negativo, castigo y extinción.",
              "Aprendizaje observacional (Bandura): adquisición por observación y ejecución posterior.",
              "Aplicación: modificación de conductas inapropiadas mediante técnicas de aprendizaje.",
            ],
          },
          {
            id: "u2-2",
            title: "Teorías de la personalidad: Psicoanálisis",
            bullets: [
              "Explora procesos intrapsíquicos y conflictos inconscientes que influyen en la conducta.",
              "Niveles de la mente: inconsciente, preconsciente y consciente.",
              "Mecanismos de defensa: represión, negación, racionalización, entre otros.",
              "Modelo estructural: ello (placer), yo (realidad) y superyó (moral).",
              "En grupos: tendencia a perder individualidad y adherir al 'alma colectiva'.",
            ],
          },
          {
            id: "u2-3",
            title: "Modelo cognitivo y errores cognitivos",
            bullets: [
              "Tríada: cognición (pensamientos), afecto (emociones) y conducta (acciones).",
              "La conducta depende de interpretaciones subjetivas de la realidad.",
              "Errores cognitivos: conclusión arbitraria, generalización excesiva, visión de túnel, personalización, magnificación, polarización, 'debería' y juicios de valor.",
            ],
          },
          {
            id: "u2-4",
            title: "Psicología de la Gestalt y teoría del campo (Lewin)",
            bullets: [
              "Gestalt: percibimos totalidades; leyes de buena forma, cierre, semejanza, proximidad, continuidad y figura-fondo.",
              "Lewin: conducta en función de la persona y el entorno en el 'espacio vital'.",
              "Regiones psicológicas con valencias (atracción/evitación) y locomoción entre regiones.",
              "Causalidad ahistórica: importa la situación presente total.",
            ],
          },
          {
            id: "u2-5",
            title: "Enfoque sistémico (TGS) y comunicación humana",
            bullets: [
              "Sistema: conjunto de elementos interdependientes con propiedades emergentes.",
              "Axiomas de comunicación: es imposible no comunicar; contenido/relación; digital (verbal)/analógica (no verbal).",
              "Relaciones simétricas y complementarias según roles y poder.",
            ],
          },
          {
            id: "u2-6",
            title: "Inteligencia social y biología del liderazgo (Goleman y Boyatzis)",
            bullets: [
              "Neuronas espejo: base para resonancia emocional y empatía.",
              "Células fusiformes: facilitan respuestas rápidas y adecuadas en interacción social.",
              "Osciladores: sincronizan movimientos y favorecen conexión.",
              "Liderazgo efectivo: aprovecha estos circuitos para construir vínculos, retener talento y mejorar efectividad.",
            ],
          },
          {
            id: "u2-7",
            title: "Actitudes y satisfacción laboral (Robbins, cap. 3)",
            bullets: [
              "Actitudes: componentes cognitivo, afectivo y conductual.",
              "Disonancia cognitiva: inconsistencia entre actitudes y conductas; se reduce según importancia, influencia y recompensas.",
              "Principales actitudes: satisfacción, involucramiento, compromiso organizacional, apoyo percibido y compromiso del empleado.",
              "Resultados: desempeño, CCO, satisfacción del cliente, ausentismo y rotación.",
            ],
          },
          {
            id: "u2-8",
            title: "Emociones y estados de ánimo (Robbins, cap. 4)",
            bullets: [
              "Afecto como paraguas conceptual; emociones intensas y eventos-específicas vs. estados de ánimo menos intensos y duraderos.",
              "Seis emociones básicas universales: ira, miedo, tristeza, felicidad, repugnancia y sorpresa.",
              "Trabajo emocional: actuación superficial vs. profunda; TEA e inteligencia emocional.",
              "Aplicaciones: selección, decisiones, creatividad, motivación, liderazgo, negociación, servicio al cliente y seguridad.",
            ],
          },
          {
            id: "u2-9",
            title: "Personalidad y valores (Robbins, cap. 5)",
            bullets: [
              "Medición: autorreporte y evaluación por terceros.",
              "Modelo de los cinco grandes: extroversión, afabilidad, meticulosidad, estabilidad emocional y apertura.",
              "Rasgos adicionales: autoevaluación esencial, maquiavelismo, narcisismo, autovigilancia, toma de riesgos, proactividad y orientación a los demás.",
              "Valores: terminales e instrumentales; dimensiones culturales de Hofstede (potencia, individualismo/colectivismo, masculinidad/feminidad, incertidumbre, tiempo).",
            ],
          },
          {
            id: "u2-10",
            title: "Percepción y toma de decisiones individual (Robbins, cap. 6)",
            bullets: [
              "Percepción influida por receptor, objeto y contexto.",
              "Atribución: distintividad, consenso y consistencia; sesgos comunes.",
              "Toma de decisiones: racional, racionalidad acotada e intuición.",
              "Sesgos: exceso de confianza, anclaje, confirmación, disponibilidad, escalamiento del compromiso, aversión al riesgo, retrospectivo.",
              "Criterios éticos: utilitarismo, derechos y justicia; creatividad basada en experiencia, pensamiento creativo y motivación intrínseca.",
            ],
          },
        ],
      },
      {
        id: "u3",
        title: "UNIDAD 3: Estructuras Sociales Fundamentales",
        description:
          "Institucionalización de la realidad, socialización y psicología social aplicada a las organizaciones.",
        summary:
          "Esta unidad estudia cómo la realidad social se construye y se mantiene a través de instituciones, socialización y las dinámicas psicológicas en las organizaciones, incluyendo roles, poder y conflictos.",
        sections: [
          {
            id: "u3-1",
            title: "Institucionalización y construcción social de la realidad (Berger y Luckmann)",
            bullets: [
              "Instituciones como productos humanos sostenidos por habituación y tipificaciones.",
              "Proceso dialéctico: externalización, objetivación e internalización.",
              "Sedimentación y lenguaje como depósitos de conocimiento colectivo.",
              "Roles especializan el conocimiento; reificación oculta el origen humano de las instituciones.",
              "Legitimación en niveles: tradición, explicaciones, teorías y universos simbólicos.",
            ],
          },
          {
            id: "u3-2",
            title: "Socialización y ciclo vital (Giddens)",
            bullets: [
              "Desarrollo temprano: percepción, vínculo con cuidadores, respuestas sociales.",
              "Teorías: Freud (deseos inconscientes), Mead (self por imitación y juego), Piaget (etapas cognitivas).",
              "Agencias: familia, pares, escuela, medios, trabajo y comunidad.",
              "Resocialización ante cambios drásticos; etapas de vida desde infancia a vejez.",
            ],
          },
          {
            id: "u3-3",
            title: "Psicología social en/de las organizaciones (Schvarstein)",
            bullets: [
              "EN las organizaciones: interacciones, adaptación activa, individuo como producto y productor.",
              "DE las organizaciones: institución–grupo–individuo; ética orientada a eficacia.",
              "Relación institución–organización: atraviesan, limitan y habilitan autonomía.",
              "Grupos: tipos, funciones, tendencias a autonomía/integración; conflictos entre racionalidades (política, afectiva, técnica, económica, ideológica y estructural).",
              "Rol: función y estatus; equilibrio entre carácter estático (prescripción) y dinámico (desempeño).",
              "Poder como inherentemente relacional; orden negociado con desigualdades.",
            ],
          },
        ],
      },
      {
        id: "u4",
        title: "UNIDAD 4: Cultura Organizacional",
        description:
          "Modelos de cultura, dimensiones comparativas y tensiones éticas en la vida organizacional.",
        summary:
          "Esta unidad analiza la cultura organizacional desde diferentes modelos, sus dimensiones, la ética y las tensiones que surgen en la vida cotidiana de las organizaciones.",
        sections: [
          {
            id: "u4-1",
            title: "Cultura empresarial y presunciones básicas (Schein)",
            bullets: [
              "Cultura: conjunto de presunciones aprendidas para resolver adaptación externa e integración interna.",
              "Niveles: artefactos/creaciones (visible), valores (conscientes) y presunciones básicas (inconscientes).",
              "Importancia: afecta efectividad, adopción tecnológica, productividad y satisfacción.",
              "Dimensiones: naturaleza/verdad, moralismo vs. pragmatismo, tiempo y espacio, naturaleza humana, relación con el entorno.",
              "Descubrimiento vía entrevistas clínicas y verificación iterativa.",
            ],
          },
          {
            id: "u4-2",
            title: "Cultura y organizaciones (Hofstede)",
            bullets: [
              "Programación mental colectiva: niveles nacional y organizacional.",
              "Capas: símbolos, héroes, rituales y valores (núcleo).",
              "Dimensiones nacionales: distancia al poder, individualismo/colectivismo, masculinidad/feminidad, evitación de incertidumbre, orientación temporal.",
              "En organizaciones predominan prácticas; utilidad para subculturas, fusiones y alineación estratégica.",
            ],
          },
          {
            id: "u4-3",
            title: "Doble moral y ética organizacional (Etkin)",
            bullets: [
              "Ética social aplicada: valores (ethos), códigos y ética contextual.",
              "Riesgos: absolutismo, relativismo y escepticismo.",
              "Doble discurso: contradicciones entre lo dicho y lo hecho; meta control de valores.",
              "Perversidades: del observador y estructurales; enfoque ecológico y justicia social.",
            ],
          },
          {
            id: "u4-4",
            title: "Cultura organizacional aplicada (Robbins)",
            bullets: [
              "Siete características: innovación/risgo, detalle, resultados, personas, equipos, dinamismo y estabilidad.",
              "Tipos: clan, adhocrática, jerárquica y de mercado.",
              "Cultura dominante y subculturas; fuertes vs. débiles.",
              "Funciones: identidad, compromiso, estabilidad y guía conductual.",
              "Obstáculos: institucionalización, resistencia al cambio, diversidad y fusiones.",
              "Creación y mantenimiento: fundadores, selección, socialización y liderazgo; historias y lenguaje.",
              "Culturas ética y positiva; espiritualidad en el trabajo (críticas y alcances).",
            ],
          },
        ],
      },
    ],
    []
  );

  // Cargar estado expandido de localStorage o inicializar todo abierto
  useEffect(() => {
    try {
      const stored = localStorage.getItem("expandedSections");
      if (stored) {
        setExpanded(JSON.parse(stored));
      } else {
        const init: Record<string, boolean> = {};
        units.forEach((u) => u.sections.forEach((s) => (init[s.id] = true)));
        setExpanded(init);
      }
    } catch {
      const init: Record<string, boolean> = {};
      units.forEach((u) => u.sections.forEach((s) => (init[s.id] = true)));
      setExpanded(init);
    }
  }, [units]);

  // Guardar estado expandido en localStorage
  useEffect(() => {
    localStorage.setItem("expandedSections", JSON.stringify(expanded));
  }, [expanded]);

  // Debounce para búsqueda
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setQuery(rawQuery);
    }, 300);
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [rawQuery]);

  // Filtrado por búsqueda
  const filtered = useMemo(() => {
    if (!query.trim()) return units;
    const q = normalize(query);
    return units
      .map((u) => {
        const matchedSections = u.sections
          .map((s) => {
            const titleMatch = normalize(s.title).includes(q);
            const matchedBullets = s.bullets.filter((b) =>
              normalize(b).includes(q)
            );
            if (titleMatch || matchedBullets.length > 0) {
              return {
                ...s,
                bullets: titleMatch ? s.bullets : matchedBullets,
              };
            }
            return null;
          })
          .filter(Boolean) as Section[];
        if (matchedSections.length > 0) {
          return { ...u, sections: matchedSections };
        }
        return null;
      })
      .filter(Boolean) as Unit[];
  }, [units, query]);

  // Scrollspy para actualizar sección activa en TOC
  useEffect(() => {
    function onScroll() {
      const sectionIds = units.flatMap((u) => u.sections.map((s) => s.id));
      const scrollPos = window.scrollY + 120; // offset para header fijo
      let current = "";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) {
          current = id;
        }
      }
      setActiveSection(current);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [units]);

  function toggleSection(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function expandAll() {
    const next: Record<string, boolean> = {};
    units.forEach((u) => u.sections.forEach((s) => (next[s.id] = true)));
    setExpanded(next);
  }

  function collapseAll() {
    const next: Record<string, boolean> = {};
    units.forEach((u) => u.sections.forEach((s) => (next[s.id] = false)));
    setExpanded(next);
  }

  async function copySection(section: Section) {
    const content = `${section.title}\n\n- ${section.bullets.join("\n- ")}`;
    try {
      await navigator.clipboard.writeText(content);
      alert("Contenido copiado al portapapeles");
    } catch {
      alert("No se pudo copiar. Intenta manualmente.");
    }
  }

  async function copyUnit(unit: Unit) {
    const content = [
      unit.title,
      unit.description,
      "",
      unit.summary,
      "",
      ...unit.sections.flatMap((s) => [s.title, ...s.bullets.map((b) => `- ${b}`), ""]),
    ].join("\n");
    try {
      await navigator.clipboard.writeText(content);
      alert("Unidad copiada al portapapeles");
    } catch {
      alert("No se pudo copiar. Intenta manualmente.");
    }
  }

  const stats = {
    totalSections: units.reduce((acc, u) => acc + u.sections.length, 0),
    totalBullets: units.reduce(
      (acc, u) => acc + u.sections.reduce((acc2, s) => acc2 + s.bullets.length, 0),
      0
    ),
    matchedResults: query.trim()
      ? filtered.reduce(
          (acc, u) => acc + u.sections.reduce((acc2, s) => acc2 + s.bullets.length, 0),
          0
        )
      : 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header fijo */}
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold text-gray-900">
                  Psicología Organizacional
                </h1>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                  <Zap className="w-3 h-3" />
                  ¡EXAMEN MAÑANA 6 PM!
                </div>
              </div>
              <p className="text-sm text-gray-600 hidden sm:block">
                {stats.totalSections} secciones • {stats.totalBullets} conceptos
                {query.trim() && ` • ${stats.matchedResults} resultados`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Botones de juegos */}
              <div className="hidden md:flex items-center gap-2 mr-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveGame('quiz')}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-none hover:from-blue-600 hover:to-purple-600"
                >
                  <Brain className="w-4 h-4 mr-1" />
                  Quiz
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveGame('flashcards')}
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-none hover:from-green-600 hover:to-blue-600"
                >
                  <BookOpen className="w-4 h-4 mr-1" />
                  Flashcards
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveGame('memory')}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-none hover:from-pink-600 hover:to-purple-600"
                >
                  <Trophy className="w-4 h-4 mr-1" />
                  Memoria
                </Button>
              </div>

              {/* Menú desplegable de juegos para móvil */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveGame('quiz')}
                className="md:hidden bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none"
              >
                <Gamepad2 className="w-4 h-4" />
              </Button>

              <div className="w-px h-6 bg-gray-300 hidden sm:block"></div>

              <Button
                variant="outline"
                size="sm"
                onClick={expandAll}
                className="hidden sm:flex"
              >
                <Plus className="w-4 h-4 mr-1" />
                Expandir
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={collapseAll}
                className="hidden sm:flex"
              >
                <Minus className="w-4 h-4 mr-1" />
                Colapsar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden"
              >
                <Menu className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sidebar / TOC */}
          <AnimatePresence>
            {(menuOpen || true) && (
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`${
                  menuOpen ? "block" : "hidden"
                } lg:block lg:col-span-3 mb-8 lg:mb-0`}
              >
                <div className="sticky top-24 space-y-4">
                  {/* Búsqueda */}
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Buscar conceptos..."
                      value={rawQuery}
                      onChange={(e) => setRawQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Panel de Modo Intensivo */}
                  <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-red-800 flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Modo Intensivo 🔥
                      </CardTitle>
                      <CardDescription className="text-red-700">
                        ¡Examen mañana 6 PM! Usa estos juegos para repasar rápido
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button
                        onClick={() => setActiveGame('quiz')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                      >
                        <Brain className="w-4 h-4 mr-2" />
                        Quiz Rápido
                      </Button>
                      <Button
                        onClick={() => setActiveGame('flashcards')}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Repaso Flashcards
                      </Button>
                      <Button
                        onClick={() => setActiveGame('memory')}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                        size="sm"
                      >
                        <Trophy className="w-4 h-4 mr-2" />
                        Juego Memoria
                      </Button>
                    </CardContent>
                  </Card>

                  {/* TOC */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Índice</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {units.map((unit) => (
                        <div key={unit.id} className="space-y-1">
                          <h4 className="font-medium text-sm text-blue-900 mb-2">
                            {unit.title.split(":")[0]}
                          </h4>
                          {unit.sections.map((section) => (
                            <a
                              key={section.id}
                              href={`#${section.id}`}
                              className={`block text-sm px-2 py-1 rounded transition-colors ${
                                activeSection === section.id
                                  ? "bg-blue-100 text-blue-700 font-medium"
                                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                              }`}
                              onClick={() => setMenuOpen(false)}
                            >
                              {section.title.length > 50
                                ? `${section.title.substring(0, 47)}...`
                                : section.title}
                            </a>
                          ))}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Contenido principal */}
          <main className="lg:col-span-9 space-y-8">
            {filtered.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Sin resultados
                  </h3>
                  <p className="text-gray-600">
                    No se encontraron coincidencias para "{query}".
                  </p>
                </CardContent>
              </Card>
            ) : (
              filtered.map((unit) => (
                <Card key={unit.id} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 mr-4">
                        <CardTitle className="text-xl mb-2">
                          <Highlighted text={unit.title} query={query} />
                        </CardTitle>
                        <CardDescription className="text-blue-100">
                          <Highlighted text={unit.description} query={query} />
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyUnit(unit)}
                        className="text-white hover:bg-white/10 shrink-0"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="mt-4 p-4 bg-white/10 rounded-lg">
                      <p className="text-sm text-blue-50 leading-relaxed">
                        <Highlighted text={unit.summary} query={query} />
                      </p>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0">
                    {unit.sections.map((section) => (
                      <div key={section.id} className="border-b last:border-b-0">
                        <div
                          id={section.id}
                          className="scroll-mt-24 flex items-center justify-between px-6 py-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => toggleSection(section.id)}
                        >
                          <h3 className="font-semibold text-gray-900 flex-1 mr-4">
                            <Highlighted text={section.title} query={query} />
                          </h3>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                copySection(section);
                              }}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            {expanded[section.id] ? (
                              <ChevronUp className="w-5 h-5 text-gray-500" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-500" />
                            )}
                          </div>
                        </div>

                        <AnimatePresence>
                          {expanded[section.id] && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 py-4 space-y-3">
                                {section.bullets.map((bullet, bulletIdx) => (
                                  <div
                                    key={bulletIdx}
                                    className="flex items-start gap-3"
                                  >
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0" />
                                    <p className="text-gray-700 leading-relaxed">
                                      <Highlighted text={bullet} query={query} />
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))
            )}
          </main>
        </div>
      </div>

      {/* Componentes de Juegos */}
      {activeGame === 'quiz' && (
        <QuizGame onClose={() => setActiveGame('none')} />
      )}
      
      {activeGame === 'flashcards' && (
        <Flashcards onClose={() => setActiveGame('none')} />
      )}
      
      {activeGame === 'memory' && (
        <MemoryGame onClose={() => setActiveGame('none')} />
      )}
    </div>
  );
}