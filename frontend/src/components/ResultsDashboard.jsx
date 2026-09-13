import Section from "./Section";
import ScoreHero from "./ScoreHero";
import ScoreBreakdown from "./ScoreBreakdown";
import StrengthsIssues from "./StrengthsIssues";
import SkillValidation from "./SkillValidation";
import JDComparison from "./JDComparison";
import DetailedFeedback from "./DetailedFeedback";
import ActionItems from "./ActionItems";
import TagList from "./TagList";

export default function ResultsDashboard({ analysis }) {
  return (
    <div className="results-dashboard">
      <ScoreHero analysis={analysis} />

      <Section title="Score Breakdown" icon="📈">
        <ScoreBreakdown analysis={analysis} />
      </Section>

      <Section title="Strengths & Critical Issues" icon="">
        <StrengthsIssues analysis={analysis} />
      </Section>

      <Section
        title="Skill Validation"
        icon="✅"
        subtitle="Checks whether claimed skills are demonstrated in projects or experience."
      >
        <SkillValidation analysis={analysis} />
      </Section>

      {(analysis?.jd_comparison || analysis?.jd_match_analysis) && (
        <Section title="Job Description Match" icon="🎯">
          <JDComparison analysis={analysis} />
        </Section>
      )}

      {analysis?.matched_keywords?.length > 0 && (
        <Section title="Resume Keywords" icon="🔑">
          <TagList items={analysis.matched_keywords.slice(0, 20)} tone="success" />
        </Section>
      )}

      {analysis?.skills?.length > 0 && (
        <Section title="Detected Skills" icon="🧠">
          <TagList items={analysis.skills.slice(0, 20)} tone="primary" />
        </Section>
      )}

      <Section title="Detailed Feedback" icon="🔍">
        <DetailedFeedback analysis={analysis} />
      </Section>

      <Section title="Action Items" icon="⚡" subtitle="Concrete steps sorted by urgency.">
        <ActionItems analysis={analysis} />
      </Section>

      {analysis?.suggestions?.length > 0 && (
        <Section title="Recommendations" icon="💡">
          <div className="recommendation-list">
            {analysis.suggestions.map((item, index) => (
              <div className="recommendation-item" key={index}>
                <span>→</span>{item}
              </div>
            ))}
          </div>
        </Section>
      )}

      {analysis?.warnings?.length > 0 && (
        <Section title="Warnings" icon="⚠️">
          <div className="bullet-list warning-list">
            {analysis.warnings.map((item, index) => (
              <div key={index}><span>!</span>{item}</div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}