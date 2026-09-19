import React from "react";
import { Layout } from "./components/Layout";
import type { Page } from "./pagine";
import { Accesso, useSessione } from "./components/Accesso";
import { attivo } from "./lib/nuvola";
import { sincronizza, avviaSincro } from "./lib/sincro";
import { Home } from "./pages/Home";
import { Coreano } from "./pages/Coreano";
import { Design } from "./pages/Design";
import { Sport } from "./pages/Sport";
import { Diario } from "./pages/Diario";
import { Risparmio } from "./pages/Risparmio";
import { Portfolio } from "./pages/Portfolio";
import { Universita } from "./pages/Universita";
import { Calendario } from "./pages/Calendario";
import { Coach } from "./pages/Coach";
import { Trofei } from "./pages/Trofei";
import { Courses } from "./pages/Courses";
import { Vocabulary } from "./pages/Vocabulary";
import { Review } from "./pages/Review";
import { Exercises } from "./pages/Exercises";
import { ProgressPage } from "./pages/Progress";
import { Goals } from "./pages/Goals";
import { SettingsPage } from "./pages/Settings";
import { LessonPage } from "./pages/Lesson";
import { getLesson } from "./data";

export default function App() {
  const { sessione, pronto } = useSessione();
  const [page, setPage] = React.useState<Page>("home");
  const [sincronizzato, setSincronizzato] = React.useState(!attivo);

  React.useEffect(() => {
    if (!attivo || !sessione) return;
    let ferma: (() => void) | undefined;
    sincronizza().finally(() => {
      setSincronizzato(true);
      ferma = avviaSincro();
    });
    return () => ferma?.();
  }, [sessione]);

  const [lessonId, setLessonId] = React.useState<string | null>(null);
  const lesson = lessonId ? getLesson(lessonId) : undefined;

  const nav = (p: Page) => {
    setLessonId(null);
    setPage(p);
    window.scrollTo({ top: 0 });
  };

  const start = (id: string) => {
    setLessonId(id);
    window.scrollTo({ top: 0 });
  };

  const contenuto = () => {
    if (lesson) return <LessonPage lesson={lesson} onExit={() => nav("coreano")} />;

    switch (page) {
      case "home":
        return <Home onNav={nav} onStart={start} />;
      case "diario":
        return <Diario />;
      case "coreano":
        return <Coreano onNav={nav} />;
      case "design":
        return <Design />;
      case "risparmio":
        return <Risparmio />;
      case "sport":
        return <Sport />;
      case "portfolio":
        return <Portfolio />;
      case "calendario":
        return <Calendario />;
      case "universita":
        return <Universita />;
      case "coach":
        return <Coach onNav={nav} />;
      case "trofei":
        return <Trofei />;
      case "courses":
        return <Courses onStart={start} />;
      case "vocab":
        return <Vocabulary />;
      case "review":
        return <Review />;
      case "exercises":
        return <Exercises />;
      case "progress":
        return <ProgressPage />;
      case "goals":
        return <Goals />;
      case "settings":
        return <SettingsPage />;
      default:
        return <Home onNav={nav} onStart={start} />;
    }
  };

  if (attivo && !pronto) return null;
  if (attivo && !sessione) return <Accesso />;
  if (attivo && !sincronizzato)
    return (
      <div className="accesso">
        <p className="muted center">Sincronizzo…</p>
      </div>
    );

  return (
    <Layout page={page} onNav={nav}>
      {contenuto()}
    </Layout>
  );
}
