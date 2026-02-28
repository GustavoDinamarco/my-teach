import { useState, useEffect } from "react";
import CourseCard from "@/components/CourseCard";
import Header from "@/components/Header";
import { getCourses } from "@/lib/storage";
import { Course } from "@/types/course";
import { Search, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";

const Index = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setCourses(getCourses());
  }, []);

  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-10">
        {/* Hero */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Seus <span className="text-gradient">Cursos</span>
          </h1>
          <p className="mt-3 text-lg text-muted-foreground max-w-xl">
            Plataforma local para organizar e assistir seus cursos. Adicione vídeos, faça anotações e aprenda no seu ritmo.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar cursos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-secondary border-border"
          />
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-2xl bg-secondary p-6 mb-4">
              <BookOpen className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">Nenhum curso encontrado</h2>
            <p className="mt-2 text-muted-foreground">
              {courses.length === 0
                ? "Comece adicionando seus cursos na página de gerenciamento."
                : "Nenhum resultado para sua busca."}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
