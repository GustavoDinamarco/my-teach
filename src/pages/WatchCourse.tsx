import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import { getCourse, getNotes, saveNote, deleteNote } from "@/lib/storage";
import { Course, Lesson, Note } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  Play,
  Plus,
  Trash2,
  FileText,
  CheckCircle,
} from "lucide-react";

const WatchCourse = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    if (courseId) {
      const c = getCourse(courseId);
      if (c) {
        setCourse(c);
        if (c.lessons.length > 0) setActiveLesson(c.lessons[0]);
      }
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId && activeLesson) {
      setNotes(getNotes(courseId, activeLesson.id));
    }
  }, [courseId, activeLesson]);

  const handleAddNote = () => {
    if (!newNote.trim() || !courseId || !activeLesson) return;
    const note: Note = {
      id: crypto.randomUUID(),
      courseId,
      lessonId: activeLesson.id,
      content: newNote.trim(),
      timestamp: new Date().toISOString(),
    };
    saveNote(note);
    setNotes((prev) => [...prev, note]);
    setNewNote("");
  };

  const handleDeleteNote = (id: string) => {
    deleteNote(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Curso não encontrado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar aos cursos
        </Link>
      </div>

      <div className="container pb-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Left: Video + Lesson List */}
          <div className="space-y-4">
            {/* Video Player */}
            <div className="aspect-video rounded-xl overflow-hidden bg-card border border-border">
              {activeLesson ? (
                <video
                  key={activeLesson.id}
                  controls
                  className="h-full w-full"
                  src={activeLesson.filePath}
                >
                  Seu navegador não suporta vídeo.
                </video>
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  Selecione uma aula
                </div>
              )}
            </div>

            {/* Current Lesson Info */}
            {activeLesson && (
              <div>
                <h1 className="text-2xl font-bold">{activeLesson.title}</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {course.title}
                </p>
              </div>
            )}

            {/* Lesson List */}
            <div className="rounded-xl border border-border bg-card">
              <div className="border-b border-border px-5 py-3">
                <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                  Aulas ({course.lessons.length})
                </h2>
              </div>
              <ScrollArea className="max-h-[300px]">
                <div className="divide-y divide-border">
                  {course.lessons
                    .sort((a, b) => a.order - b.order)
                    .map((lesson, i) => (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson)}
                        className={`flex w-full items-center gap-3 px-5 py-3 text-left transition-colors ${
                          activeLesson?.id === lesson.id
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-secondary text-foreground"
                        }`}
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium">
                          {activeLesson?.id === lesson.id ? (
                            <Play className="h-3 w-3" />
                          ) : (
                            i + 1
                          )}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {lesson.title}
                          </p>
                          {lesson.duration && (
                            <p className="text-xs text-muted-foreground">
                              {lesson.duration}
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Right: Notes */}
          <div className="rounded-xl border border-border bg-card flex flex-col h-fit lg:sticky lg:top-20">
            <div className="border-b border-border px-5 py-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                Anotações
              </h2>
            </div>

            <ScrollArea className="max-h-[400px] p-4">
              {notes.length > 0 ? (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className="group rounded-lg bg-secondary p-3"
                    >
                      <p className="text-sm text-foreground whitespace-pre-wrap">
                        {note.content}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {new Date(note.timestamp).toLocaleDateString("pt-BR")}
                        </span>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  Nenhuma anotação ainda.
                </div>
              )}
            </ScrollArea>

            <div className="border-t border-border p-4 space-y-3">
              <Textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Escreva sua anotação..."
                className="bg-secondary border-border resize-none min-h-[80px]"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) handleAddNote();
                }}
              />
              <Button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className="w-full"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Adicionar nota
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchCourse;
