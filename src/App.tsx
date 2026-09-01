import React from "react";
import { Layout, type Page } from "./components/Layout";
import { Home } from "./pages/Home";
import { Courses } from "./pages/Courses";
import { Review } from "./pages/Review";
import { Exercises } from "./pages/Exercises";
import { ProgressPage } from "./pages/Progress";
import { Goals } from "./pages/Goals";
import { SettingsPage } from "./pages/Settings";
import { LessonPage } from "./pages/Lesson";
import { getLesson } from "./data";

export default function App() {
  const [page, setPage] = React.useState<Page>("home");
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

  return (
    <Layout page={page} onNav={nav}>
      {lesson ? (
        <LessonPage lesson={lesson} onExit={() => nav("home")} />
      ) : page === "home" ? (
        <Home onNav={nav} onStart={start} />
      ) : page === "courses" ? (
        <Courses onStart={start} />
      ) : page === "review" ? (
        <Review />
      ) : page === "exercises" ? (
        <Exercises />
      ) : page === "progress" ? (
        <ProgressPage />
      ) : page === "goals" ? (
        <Goals />
      ) : (
        <SettingsPage />
      )}
    </Layout>
  );
}
