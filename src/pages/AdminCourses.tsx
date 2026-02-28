import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { getCourses, saveCourse, deleteCourse } from "@/lib/storage";
import { Course, Lesson } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Trash2,
  Save,
  GripVertical,
  BookOpen,
  X,
} from "lucide-react";
import { toast } from "sonner";

const AdminCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [editing, setEditing] = useState<Course | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setCourses(getCourses());
  }, []);

  const createBlankCourse = (): Course => ({
    id: crypto.randomUUID(),
    title: "",
    description: "",
    thumbnail: "",
    lessons: [],
    createdAt: new Date().toISOString(),
  });

  const handleNew = () => {
    setEditing(createBlankCourse());
    setShowForm(true);
  };

  const handleEdit = (course: Course) => {
    setEditing({ ...course, lessons: [...course.lessons] });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteCourse(id);
    setCourses(getCourses());
    toast.success("Curso removido");
  };

  const handleSave = () => {
    if (!editing || !editing.title.trim()) {
      toast.error("O título é obrigatório");
      return;
    }
    saveCourse(editing);
    setCourses(getCourses());
    setEditing(null);
    setShowForm(false);
    toast.success("Curso salvo com sucesso!");
  };

  const handleAddLesson = () => {
    if (!editing) return;
    const lesson: Lesson = {
      id: crypto.randomUUID(),
      title: "",
      filePath: "",
      order: editing.lessons.length + 1,
    };
    setEditing({ ...editing, lessons: [...editing.lessons, lesson] });
  };

  const handleUpdateLesson = (
    lessonId: string,
    field: keyof Lesson,
    value: string | number
  ) => {
    if (!editing) return;
    setEditing({
      ...editing,
      lessons: editing.lessons.map((l) =>
        l.id === lessonId ? { ...l, [field]: value } : l
      ),
    });
  };

  const handleRemoveLesson = (lessonId: string) => {
    if (!editing) return;
    setEditing({
      ...editing,
      lessons: editing.lessons.filter((l) => l.id !== lessonId),
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-10 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Gerenciar <span className="text-gradient">Cursos</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Adicione, edite e organize seus cursos.
            </p>
          </div>
          {!showForm && (
            <Button onClick={handleNew}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Curso
            </Button>
          )}
        </div>

        {/* Form */}
        {showForm && editing && (
          <div className="rounded-xl border border-border bg-card p-6 mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">
                {editing.createdAt === new Date().toISOString()
                  ? "Novo Curso"
                  : "Editar Curso"}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Título *</Label>
                  <Input
                    value={editing.title}
                    onChange={(e) =>
                      setEditing({ ...editing, title: e.target.value })
                    }
                    placeholder="Ex: Curso de React Avançado"
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Thumbnail (URL ou caminho)</Label>
                  <Input
                    value={editing.thumbnail}
                    onChange={(e) =>
                      setEditing({ ...editing, thumbnail: e.target.value })
                    }
                    placeholder="/images/curso.jpg"
                    className="bg-secondary border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={editing.description}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                  placeholder="Uma breve descrição do curso..."
                  className="bg-secondary border-border resize-none"
                />
              </div>

              {/* Lessons */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-base">Aulas</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddLesson}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Adicionar Aula
                  </Button>
                </div>

                {editing.lessons.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-6 rounded-lg border border-dashed border-border">
                    Nenhuma aula adicionada. Clique em "Adicionar Aula" acima.
                  </p>
                )}

                <div className="space-y-3">
                  {editing.lessons
                    .sort((a, b) => a.order - b.order)
                    .map((lesson, i) => (
                      <div
                        key={lesson.id}
                        className="rounded-lg border border-border bg-secondary/50 p-4"
                      >
                        <div className="flex items-start gap-3">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium mt-1">
                            {i + 1}
                          </span>
                          <div className="flex-1 grid gap-3 sm:grid-cols-2">
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">
                                Título da aula
                              </Label>
                              <Input
                                value={lesson.title}
                                onChange={(e) =>
                                  handleUpdateLesson(
                                    lesson.id,
                                    "title",
                                    e.target.value
                                  )
                                }
                                placeholder="Introdução"
                                className="bg-background border-border h-9 text-sm"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">
                                Caminho do arquivo
                              </Label>
                              <Input
                                value={lesson.filePath}
                                onChange={(e) =>
                                  handleUpdateLesson(
                                    lesson.id,
                                    "filePath",
                                    e.target.value
                                  )
                                }
                                placeholder="/videos/aula01.mp4"
                                className="bg-background border-border h-9 text-sm"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">
                                Duração (opcional)
                              </Label>
                              <Input
                                value={lesson.duration || ""}
                                onChange={(e) =>
                                  handleUpdateLesson(
                                    lesson.id,
                                    "duration",
                                    e.target.value
                                  )
                                }
                                placeholder="15:30"
                                className="bg-background border-border h-9 text-sm"
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveLesson(lesson.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors mt-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Curso
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditing(null);
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Course List */}
        {courses.length > 0 ? (
          <div className="space-y-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30"
              >
                <div className="h-14 w-14 shrink-0 rounded-lg bg-secondary overflow-hidden">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <BookOpen className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-foreground truncate">
                    {course.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {course.lessons.length} aula
                    {course.lessons.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(course)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(course.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !showForm && (
            <div className="text-center py-20">
              <div className="rounded-2xl bg-secondary p-6 inline-block mb-4">
                <BookOpen className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold">Nenhum curso cadastrado</h2>
              <p className="mt-2 text-muted-foreground mb-6">
                Comece criando seu primeiro curso.
              </p>
              <Button onClick={handleNew}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Curso
              </Button>
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default AdminCourses;
