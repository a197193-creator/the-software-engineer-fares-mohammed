import { BookOpen, ChevronDown, GraduationCap } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import { academicCopy, academicProfile } from "../academicProfile";
import MotionCard from "./MotionCard";

export default function EducationSnapshot() {
  const { language, tr } = useLanguage();
  const copy = academicCopy[language];
  const { cgpa, scale, expectedGraduation, latestCourse } = academicProfile;

  return (
    <MotionCard as="article" className="timeline-entry education-snapshot">
      <div className="timeline-dot" aria-hidden="true" />
      <div className="education-heading">
        <div className="timeline-date">
          <GraduationCap size={17} aria-hidden="true" />
          {copy.education}
        </div>
        <span className="education-log-label">{copy.learningLog}</span>
      </div>
      <h3>{copy.degree}</h3>
      <p className="organization">{tr("Universiti Kebangsaan Malaysia")}</p>
      <p className="education-description">
        <time dateTime={expectedGraduation}>{copy.graduation}</time>{" "}
        {copy.description}
      </p>

      <div className="academic-overview">
        <dl className="academic-grade">
          <dt>{copy.cgpa}</dt>
          <dd>
            <bdi dir="ltr" className="academic-grade-value">
              {cgpa}
              <span> / {scale}</span>
            </bdi>
          </dd>
        </dl>
        <details className="academic-result">
          <summary>
            <BookOpen size={16} aria-hidden="true" />
            <span>{copy.latestResult}</span>
            <bdi dir="ltr" className="academic-result-grade">
              {latestCourse.grade}
            </bdi>
            <ChevronDown
              size={16}
              className="academic-result-chevron"
              aria-hidden="true"
            />
          </summary>
          <div className="academic-result-content">
            <h4>{copy.statistics}</h4>
            <p>{copy.retake}</p>
            <dl className="academic-result-meta">
              <div>
                <dt>{copy.courseCode}</dt>
                <dd>
                  <bdi dir="ltr">{latestCourse.code}</bdi>
                </dd>
              </div>
              <div>
                <dt>{copy.session}</dt>
                <dd>
                  <bdi dir="ltr">{latestCourse.academicYear}</bdi>
                  <span>{copy.semester}</span>
                </dd>
              </div>
            </dl>
          </div>
        </details>
      </div>
    </MotionCard>
  );
}
