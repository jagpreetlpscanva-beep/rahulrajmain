"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  useCollection,
  DEFAULT_COURSES,
  COURSE_CATEGORIES,
  type Course,
  type CourseCategory,
} from "@/lib/adminStore";
import { Mandala } from "../ui/Mandala";

export function CoursesGrid() {
  const { items } = useCollection<Course>("courses", DEFAULT_COURSES);
  const [tab, setTab] = useState<CourseCategory>(COURSE_CATEGORIES[0]);

  const visible = items.filter((c) => c.category === tab);

  return (
    <section id="courses-list" className="paper-bg relative py-16 lg:py-20">
      <div className="container-px">
        <div className="text-center">
          <span className="eyebrow text-gold-600">Learn With Rahul Raj</span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-ink sm:text-4xl lg:text-[2.75rem]">
            Courses &amp; Recorded Sessions
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-ink/65 sm:text-lg">
            Self-paced video courses and recorded masterclasses — learn the sacred sciences at your
            own pace, anytime.
          </p>
        </div>

        {/* category tabs */}
        <div className="mt-10 flex justify-center gap-7 overflow-x-auto border-b border-gold-500/20 pb-px [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {COURSE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setTab(cat)}
              className={`relative shrink-0 whitespace-nowrap pb-3 text-sm font-semibold transition-colors sm:text-base ${
                tab === cat ? "text-ink" : "text-ink/45 hover:text-ink/70"
              }`}
            >
              {cat}
              {tab === cat && (
                <motion.span
                  layoutId="course-tab-underline"
                  className="absolute -bottom-px left-0 h-0.5 w-full rounded-full bg-gold-gradient"
                />
              )}
            </button>
          ))}
        </div>

        {visible.length > 0 ? (
          <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <p className="mt-16 text-center text-ink/55">
            No courses in this category yet. Add some from the admin panel.
          </p>
        )}
      </div>
    </section>
  );
}

function CourseCard({ course }: { course: Course }) {
  const watchHref = course.videoUrl || `/book/course/${course.id}`;
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gold-500/25 bg-white/70 shadow-card transition-shadow duration-300 hover:shadow-card-hover"
    >
      {/* big thumbnail with play overlay */}
      <a
        href={watchHref}
        target={course.videoUrl ? "_blank" : undefined}
        rel={course.videoUrl ? "noreferrer" : undefined}
        className="relative block aspect-video overflow-hidden"
        style={{ background: `linear-gradient(150deg, ${course.accent[0]}, ${course.accent[1]})` }}
      >
        {course.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
        ) : (
          <Mandala className="absolute inset-0 m-auto h-4/5 w-4/5 text-white/10" />
        )}
        {course.badge && (
          <span className="absolute left-3 top-3 rounded-md bg-gold-gradient px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wider text-night shadow-sm">
            {course.badge}
          </span>
        )}
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-white/90 text-ink shadow-lg transition-transform duration-300 group-hover:scale-110">
            <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      </a>

      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
          {course.category} · {course.level}
        </span>
        <h3 className="mt-1.5 font-serif text-lg font-bold leading-snug text-ink">{course.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/70">{course.description}</p>
        <p className="mt-3 text-xs font-medium text-ink/55">{course.lessons}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          {course.price && <span className="font-serif text-xl font-bold text-ink">{course.price}</span>}
          <a
            href={watchHref}
            target={course.videoUrl ? "_blank" : undefined}
            rel={course.videoUrl ? "noreferrer" : undefined}
            className="inline-flex items-center gap-2 rounded-lg bg-gold-gradient px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-night shadow-gold-btn transition-transform hover:-translate-y-0.5"
          >
            {course.videoUrl ? "Watch Now" : "Enroll Now"}
          </a>
        </div>
      </div>
    </motion.article>
  );
}
