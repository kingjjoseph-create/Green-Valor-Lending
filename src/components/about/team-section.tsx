import { publishedTeam, type TeamMember } from "@/content/team";
import { SectionContainer } from "@/components/layout/section-container";
import { ResponsiveImage } from "@/components/shared/responsive-image";
import { SectionHeading } from "@/components/shared/section-heading";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]!.toUpperCase())
    .slice(0, 2)
    .join("");
}

/** One approved team profile. Shows only the fields the company provided. */
export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article
      className="flex h-full flex-col rounded-2xl border border-border bg-card p-6"
      aria-labelledby={`team-${member.id}`}
    >
      {member.portrait ? (
        <ResponsiveImage
          image={member.portrait}
          aspect="4/5"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 100vw"
          alt={`Portrait of ${member.name}`}
        />
      ) : (
        <div
          className="flex aspect-[4/5] items-center justify-center rounded-xl bg-surface-alt font-serif text-5xl font-semibold text-gv-green"
          aria-hidden="true"
        >
          {initials(member.name)}
        </div>
      )}
      <h3 id={`team-${member.id}`} className="mt-6 type-card-title text-[1.5rem]">
        {member.name}
      </h3>
      <p className="mt-1 type-support font-medium text-gv-charcoal">{member.title}</p>
      {member.nmlsId && <p className="mt-1 type-legal text-muted-foreground">NMLS ID {member.nmlsId}</p>}
      {member.bio && <p className="mt-4 type-support text-muted-foreground">{member.bio}</p>}
    </article>
  );
}

type TeamSectionProps = { eyebrow: string; title: string; members?: TeamMember[] };

/**
 * Team grid. Renders nothing until at least one approved profile exists, so
 * the page never shows empty or placeholder people.
 */
export function TeamSection({ eyebrow, title, members }: TeamSectionProps) {
  const team = publishedTeam(members);
  if (team.length === 0) return null;
  return (
    <SectionContainer aria-labelledby="about-team">
      <SectionHeading id="about-team" eyebrow={eyebrow} title={title} />
      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {team.map((member) => (
          <li key={member.id}>
            <TeamCard member={member} />
          </li>
        ))}
      </ul>
    </SectionContainer>
  );
}
