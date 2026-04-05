function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

export function sortLessonTypes(types = []) {
  return [...types].sort((left, right) => {
    const leftPriority = Number(left?.priority ?? 0);
    const rightPriority = Number(right?.priority ?? 0);

    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }

    return String(left?.name || "").localeCompare(String(right?.name || ""));
  });
}

export function getSelectedLessonType(types = [], typeId = "") {
  return types.find((item) => String(item?.id) === String(typeId)) || null;
}

export function inferLessonKindFromTypeName(typeName = "") {
  const normalized = normalizeText(typeName);

  if (
    normalized.includes("бие даалт") ||
    normalized.includes("даалгавар") ||
    normalized.includes("assignment")
  ) {
    return "assignment";
  }

  if (
    normalized.includes("лекц") ||
    normalized.includes("video") ||
    normalized.includes("видео")
  ) {
    return "video";
  }

  if (
    normalized.includes("файл") ||
    normalized.includes("баримт") ||
    normalized.includes("pdf") ||
    normalized.includes("file")
  ) {
    return "file";
  }

  if (
    normalized.includes("семинар") ||
    normalized.includes("лаборатори") ||
    normalized.includes("бүлэг") ||
    normalized.includes("text")
  ) {
    return "text";
  }

  return "text";
}

export function getFallbackLessonTypeId(types = []) {
  return String(sortLessonTypes(types)[0]?.id || "");
}

export function getLessonKindFromType(types = [], typeId = "", fallbackTypeName = "") {
  const selectedType = getSelectedLessonType(types, typeId);
  return inferLessonKindFromTypeName(selectedType?.name || fallbackTypeName);
}
