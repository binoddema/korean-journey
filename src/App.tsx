import React from "react";
import { Layout, type Page } from "./components/Layout";
import { Accesso, useSessione } from "./components/Accesso";
import { attivo } from "./lib/nuvola";
import { scaricaTutto, avviaSincro } from "./lib/sincro";
import { Home } from "./pages/Home";
import { Coreano } from "./pages/Coreano";
import { Presto } from "./pages/Presto";
import { Design } from "./pages/Design";
import { Sport } from "./pages/Sport";
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
    scaricaTutto().then(() => setSincronizzato(true));
    return avviaSincro();
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
      case "coreano":
        return <Coreano onNav={nav} />;
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
      case "design":
        return <Design />;
      case "sport":
        return <Sport />;
      case "calendario":
        return <Presto icon="🗓" titolo="Calendario" testo="Qui arriverà il calendario degli impegni." />;
      case "diario":
        return <Presto icon="📓" titolo="Diario" testo="Qui arriverà il diario delle sessioni." />;
      case "portfolio":
        return (
          <Presto
            icon="🖼"
            titolo="Portfolio"
            testo="Qui arriveranno le foto dei lavori, in sola lettura."
          />
        );
      default:
        return <Home onNav={nav} onStart={start} />;
    }
  };

  if (attivo && !pronto) return null;
  if (attivo && !sessione) return <Accesso />;
  if (attivo && !sincronizzato)
    return <div className="accesso"><p className="muted center">Sincronizzo…</p></div>;

  return (
    <Layout page={page} onNav={nav}>
      {contenuto()}
    </Layout>
  );
}
