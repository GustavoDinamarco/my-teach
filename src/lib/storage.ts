import { Course, Note } from "@/types/course";

const COURSES_KEY = "courses";
const NOTES_KEY = "notes";

export function getCourses(): Course[] {
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
