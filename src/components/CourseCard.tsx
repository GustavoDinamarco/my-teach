import { Course } from "@/types/course";
import { Link } from "react-router-dom";
import { Play, BookOpen } from "lucide-react";

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <Link
      to={`/course/${course.id}`}
      className="group card-gradient rounded-xl border border-border overflow-hidden transition-all hover:border-primary/40 hover:glow-shadow animate-fade-in"
    >
      <div className="aspect-video relative overflow-hidden bg-secondary">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BookOpen className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="rounded-full bg-primary p-3">
            <Play className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-foreground line-clamp-1">
          {course.title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {course.description}
        </p>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <BookOpen className="h-3.5 w-3.5" />
          <span>{course.lessons.length} aula{course.lessons.length !== 1 ? "s" : ""}</span>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
