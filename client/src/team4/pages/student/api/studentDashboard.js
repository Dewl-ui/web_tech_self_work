import { studentGet, parseField, getAllCourseLessons } from "./studentCourseApi";

function toArray(value) {
	return Array.isArray(value) ? value : [];
}

function isDateInRange(startOn, endOn, nowTs = Date.now()) {
	const start = startOn ? new Date(startOn).getTime() : null;
	const end = endOn ? new Date(endOn).getTime() : null;

	if (start && nowTs < start) return false;
	if (end && nowTs > end) return false;
	return true;
}

const EMPTY_DASHBOARD = {
	courses: [],
	exams: [],
	schools: [],
	catalog: [],
	categories: [],
	paymentPolicy: null,
	lessonsByCourse: {},
	stats: {
		enrolledCourses: 0,
		activeCourses: 0,
		totalLessons: 0,
		openExams: 0,
		totalExams: 0,
		submissionLessons: 0,
		schoolCount: 0,
	},
};

export async function getStudentDashboardData({ userId, schoolId }) {
	if (!userId) return { ...EMPTY_DASHBOARD };

	const catalogPath = schoolId ? `/schools/${schoolId}/courses` : null;
	const categoriesPath = schoolId ? `/schools/${schoolId}/categories` : null;
	const policyPath = schoolId ? `/schools/${schoolId}/payment-policy` : null;

	const [coursesRes, examsRes, schoolsRes, catalogRes, categoriesRes, policyRes] =
		await Promise.all([
			studentGet(`/users/${userId}/courses/enrolled`).catch(() => ({ items: [] })),
			studentGet("/users/me/exams").catch(() => ({ items: [] })),
			studentGet(`/users/${userId}/schools`).catch(() => ({ items: [] })),
			catalogPath ? studentGet(catalogPath).catch(() => ({ items: [] })) : Promise.resolve({ items: [] }),
			categoriesPath ? studentGet(categoriesPath).catch(() => ({ items: [] })) : Promise.resolve({ items: [] }),
			policyPath ? studentGet(policyPath).catch(() => null) : Promise.resolve(null),
		]);

	const courses = toArray(coursesRes?.items);
	const exams = toArray(examsRes?.items);
	const schools = toArray(schoolsRes?.items);
	const catalog = toArray(catalogRes?.items);
	const categories = toArray(categoriesRes?.items);

	const lessonResults = await Promise.allSettled(
		courses.map((item) => {
			const course = parseField(item, "course") ?? {};
			const courseId = course.id ?? item.course_id;
			if (!courseId) return Promise.resolve({ courseId: null, items: [] });
			return getAllCourseLessons(courseId).then((items) => ({ courseId, items }));
		})
	);

	const lessonsByCourse = {};
	for (const result of lessonResults) {
		if (result.status !== "fulfilled") continue;
		const { courseId, items } = result.value;
		if (!courseId) continue;
		lessonsByCourse[courseId] = toArray(items);
	}

	const nowTs = Date.now();

	const activeCourses = courses.filter((item) => {
		const course = parseField(item, "course") ?? {};
		return isDateInRange(course.start_on, course.end_on, nowTs);
	}).length;

	const totalLessons = Object.values(lessonsByCourse).reduce(
		(sum, items) => sum + items.length,
		0
	);

	const submissionLessons = Object.values(lessonsByCourse).reduce(
		(sum, items) => sum + items.filter((lesson) => Number(lesson?.has_submission) === 1).length,
		0
	);

	const openExams = exams.filter((exam) =>
		isDateInRange(exam?.open_on, exam?.close_on || exam?.end_on, nowTs)
	).length;

	return {
		courses,
		exams,
		schools,
		catalog,
		categories,
		paymentPolicy: policyRes ?? null,
		lessonsByCourse,
		stats: {
			enrolledCourses: courses.length,
			activeCourses,
			totalLessons,
			openExams,
			totalExams: exams.length,
			submissionLessons,
			schoolCount: schools.length,
		},
	};
}
