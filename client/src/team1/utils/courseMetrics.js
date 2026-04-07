function clampPercent(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(0, Math.min(100, Math.round(numeric)));
}

function isTruthyFlag(value) {
  return value === true || value === 1 || value === "1";
}

export function getSubmissionLessonCount(lessons = []) {
  if (!Array.isArray(lessons)) {
    return 0;
  }

  return lessons.filter(
    (lesson) =>
      isTruthyFlag(lesson?.has_submission) ||
      lesson?.open_on ||
      lesson?.close_on ||
      lesson?.end_on
  ).length;
}

export function getUserProgress(user, totalLessons = 0, localCompletedCount = null) {
  const directProgress =
    user?.progress ??
    user?.submission_progress ??
    user?.lesson_progress ??
    user?.completed_percent ??
    user?.completion_percent ??
    user?.attendance_percent ??
    user?.percentage ??
    user?.percent;

  if (directProgress !== undefined && directProgress !== null && directProgress !== "") {
    return clampPercent(directProgress);
  }

  const completedLessons =
    user?.submitted_count ??
    user?.submission_count ??
    user?.completed_submission_count ??
    user?.completed_assignments ??
    user?.done_submission_count ??
    user?.completed_lessons ??
    user?.completed_lesson_count ??
    user?.done_count ??
    user?.finished_count;

  if (Number.isFinite(Number(completedLessons)) && totalLessons > 0) {
    return clampPercent((Number(completedLessons) / totalLessons) * 100);
  }

  if (Number.isFinite(Number(localCompletedCount)) && totalLessons > 0) {
    return clampPercent((Number(localCompletedCount) / totalLessons) * 100);
  }

  return 0;
}

export function getAverageProgress(
  users = [],
  totalLessons = 0,
  fallback = 0,
  localProgressOverrides = {}
) {
  if (!Array.isArray(users) || users.length === 0) {
    return clampPercent(fallback);
  }

  const total = users.reduce(
    (sum, user) =>
      sum +
      getUserProgress(
        user,
        totalLessons,
        localProgressOverrides?.[String(user?.user_id || user?.id || "")]
      ),
    0
  );

  return clampPercent(total / users.length);
}
