/**
 * Course progress, kept in the reader's own browser (2026-10-28).
 *
 * Which lessons a reader has finished, per course. No accounts: progress lives
 * in localStorage, so it does not follow the reader to another device. That
 * limit is deliberate. The events fired alongside (course_lesson_completed,
 * course_progress_seen, course_continue_shown, course_continue_clicked) exist
 * to measure whether people use progress at all, which is the evidence for or
 * against building sign-in.
 *
 * Every read and write is wrapped: storage can be blocked (private windows,
 * locked-down browsers) and the pages must still work without it.
 */

const STORAGE_KEY = 'aiux:course-progress';
const CHANGE_EVENT = 'aiux:course-progress-changed';

export interface CourseProgress {
  /** Lesson slugs the reader has finished, in the order they finished them. */
  lessons: string[];
  /** The lesson slug finished most recently. */
  last?: string;
  updatedAt: number;
}

export type ProgressMap = Record<string, CourseProgress>;

export function readProgress(): ProgressMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? (parsed as ProgressMap) : {};
  } catch {
    return {};
  }
}

/**
 * Mark a lesson finished. Returns the course's updated progress when this is
 * the first time the lesson was finished, or null when it was already done.
 */
export function markLessonDone(courseSlug: string, lessonSlug: string): CourseProgress | null {
  const all = readProgress();
  const course = all[courseSlug] ?? { lessons: [], updatedAt: 0 };
  if (course.lessons.includes(lessonSlug)) return null;
  const next: CourseProgress = {
    lessons: [...course.lessons, lessonSlug],
    last: lessonSlug,
    updatedAt: Date.now(),
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...all, [courseSlug]: next }));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    return null;
  }
  return next;
}

/** Re-run `onChange` when progress changes in this tab or another one. */
export function subscribeProgress(onChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) onChange();
  };
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener('storage', onStorage);
  };
}
