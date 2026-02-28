export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  lessons: Lesson[];
  createdAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  filePath: string;
  duration?: string;
  order: number;
}

export interface Note {
  id: string;
  lessonId: string;
  courseId: string;
  content: string;
  timestamp: string;
}
