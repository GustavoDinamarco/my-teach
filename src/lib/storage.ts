import { Course, Note } from "@/types/course";

const COURSES_KEY = "courses";
const NOTES_KEY = "notes";

const MOCK_COURSE: Course = {
  id: "mock-curso-react",
  title: "React Avançado - Hooks, Context e Performance",
  description: "Domine os conceitos avançados do React com exemplos práticos e projetos reais. Aprenda a otimizar suas aplicações e criar hooks customizados.",
  thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=340&fit=crop",
  lessons: [
    { id: "l1", title: "Introdução ao React Avançado", filePath: "/videos/aula01.mp4", duration: "12:30", order: 1 },
    { id: "l2", title: "Custom Hooks na Prática", filePath: "/videos/aula02.mp4", duration: "18:45", order: 2 },
    { id: "l3", title: "Context API vs Redux", filePath: "/videos/aula03.mp4", duration: "22:10", order: 3 },
    { id: "l4", title: "Otimização com useMemo e useCallback", filePath: "/videos/aula04.mp4", duration: "15:20", order: 4 },
    { id: "l5", title: "React.lazy e Suspense", filePath: "/videos/aula05.mp4", duration: "14:00", order: 5 },
  ],
  createdAt: "2025-12-01T10:00:00.000Z",
};

const MOCK_NOTES: Note[] = [
  { id: "n1", courseId: "mock-curso-react", lessonId: "l1", content: "Lembrar de revisar os fundamentos de closures antes de avançar nos hooks.", timestamp: "2026-01-15T14:30:00.000Z" },
  { id: "n2", courseId: "mock-curso-react", lessonId: "l1", content: "O conceito de re-render é essencial para entender performance no React.", timestamp: "2026-01-15T14:45:00.000Z" },
  { id: "n3", courseId: "mock-curso-react", lessonId: "l2", content: "useLocalStorage é um ótimo exemplo de custom hook para começar.", timestamp: "2026-01-16T10:00:00.000Z" },
];

function ensureMockData(): void {
  const courses = localStorage.getItem(COURSES_KEY);
  if (!courses || JSON.parse(courses).length === 0) {
    localStorage.setItem(COURSES_KEY, JSON.stringify([MOCK_COURSE]));
    localStorage.setItem(NOTES_KEY, JSON.stringify(MOCK_NOTES));
  }
}

export function getCourses(): Course[] {
  ensureMockData();
  const data = localStorage.getItem(COURSES_KEY);
  return data ? JSON.parse(data) : [];
}

export function getCourse(id: string): Course | undefined {
  return getCourses().find((c) => c.id === id);
}

export function saveCourse(course: Course): void {
  const courses = getCourses();
  const idx = courses.findIndex((c) => c.id === course.id);
  if (idx >= 0) courses[idx] = course;
  else courses.push(course);
  localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
}

export function deleteCourse(id: string): void {
  const courses = getCourses().filter((c) => c.id !== id);
  localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
}

export function getNotes(courseId: string, lessonId: string): Note[] {
  const data = localStorage.getItem(NOTES_KEY);
  const all: Note[] = data ? JSON.parse(data) : [];
  return all.filter((n) => n.courseId === courseId && n.lessonId === lessonId);
}

export function saveNote(note: Note): void {
  const data = localStorage.getItem(NOTES_KEY);
  const all: Note[] = data ? JSON.parse(data) : [];
  const idx = all.findIndex((n) => n.id === note.id);
  if (idx >= 0) all[idx] = note;
  else all.push(note);
  localStorage.setItem(NOTES_KEY, JSON.stringify(all));
}

export function deleteNote(id: string): void {
  const data = localStorage.getItem(NOTES_KEY);
  const all: Note[] = data ? JSON.parse(data) : [];
  localStorage.setItem(NOTES_KEY, JSON.stringify(all.filter((n) => n.id !== id)));
}
