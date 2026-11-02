/**
 * Careers & Recruitment page copy (/careers).
 *
 * Compliance notes (see COMPLIANCE_REVIEW.md): no compensation, commission
 * splits, lead distribution, paid marketing, specific tools, mentorship
 * schedules, reimbursements, or other benefits that leadership has not
 * confirmed. No promise of employment, licensing sponsorship, training
 * placement, or originating while unlicensed. Military service is welcome
 * but never required.
 */

export const APPLY_HREF = "#apply";

/** Link that preselects a pathway in the recruitment form, then jumps to it. */
export const pathwayHref = (pathway: "licensed" | "aspiring") => `/careers?pathway=${pathway}#apply`;

export const careersContent = {
  hero: {
    eyebrow: "Build Your Future With Green Valor",
    title: "Discipline. Ambition. Opportunity.",
    description:
      "Whether you're an established loan officer or a driven professional exploring the mortgage industry, Green Valor Lending is committed to a culture of growth, education, accountability, and service.",
    primary: { label: "Apply to Join Our Team", href: APPLY_HREF },
    secondary: { label: "Discover Our Culture", href: "#culture" },
    pillars: ["Growth", "Education", "Accountability", "Service"],
  },

  audience: {
    eyebrow: "Who we're looking for",
    title: "Great Careers Begin With the Right Mindset.",
    description:
      "We are not recruiting experienced loan officers alone. We are looking for people who are serious about personal growth and willing to put in consistent effort.",
    cards: [
      {
        title: "Experienced Loan Officers",
        description:
          "Mortgage professionals who value business development, training, marketing support, and collaborative professional relationships.",
      },
      {
        title: "Disciplined Entrepreneurs",
        description:
          "Self-motivated individuals who want to develop professional relationships, create business opportunities, and build their future through consistent effort.",
      },
      {
        title: "Career-Driven Individuals",
        description:
          "Professionals with transferable experience in sales, finance, customer service, management, business development, or related industries.",
      },
      {
        title: "Veterans and Career Transitioners",
        description:
          "Individuals with military experience or other professional backgrounds who value leadership, discipline, accountability, and service.",
      },
    ],
    militaryNote: "Military experience is welcome, but it is not required.",
  },

  growth: {
    eyebrow: "Why Green Valor",
    title: "Your Growth. Our Commitment.",
    description:
      "We believe people do their best work when they are supported. Our approach centers on education, guidance, and a team that holds itself to a high standard, so you can focus on building skills, relationships, and a business you are proud of.",
    cards: [
      {
        title: "Training & Education",
        points: [
          "Mortgage industry education",
          "Product knowledge development",
          "Professional skill development",
          "Commitment to continuous learning",
        ],
      },
      {
        title: "Marketing & Business Development",
        points: [
          "Marketing guidance",
          "Building a professional presence",
          "Client relationship development",
          "Business development support",
        ],
      },
      {
        title: "Collaborative Growth",
        points: [
          "Team-oriented culture",
          "Professional accountability",
          "Continuous improvement",
          "Growth-focused leadership",
        ],
      },
    ],
  },

  standard: {
    eyebrow: "The Green Valor standard",
    title: "We Value Character as Much as Experience.",
    description:
      "Skills can be taught. These characteristics help define our culture, and they are what we look for in every conversation.",
    values: [
      {
        title: "Discipline",
        description: "Showing up consistently and doing the work, especially when no one is watching.",
      },
      {
        title: "Integrity",
        description: "Being honest with clients and colleagues, and doing what is right over what is easy.",
      },
      {
        title: "Initiative",
        description: "Taking ownership of your goals and acting without waiting to be told.",
      },
      {
        title: "Accountability",
        description: "Owning your results, learning from mistakes, and following through on commitments.",
      },
      {
        title: "Professionalism",
        description: "Communicating clearly, respecting people's time, and representing the company well.",
      },
      {
        title: "Coachability",
        description: "Welcoming feedback and being willing to keep learning at every stage of a career.",
      },
      {
        title: "Commitment to Service",
        description: "Putting the needs of borrowers, partners, and teammates at the center of the work.",
      },
    ],
  },

  pathways: {
    eyebrow: "Two career pathways",
    title: "Where Are You in Your Career?",
    items: [
      {
        id: "licensed" as const,
        label: "Pathway A",
        title: "Licensed Loan Officers",
        audience: "Experienced and licensed mortgage professionals.",
        description:
          "Explore an environment focused on professional development, support, and business growth. If you already originate loans and want a team that values education, accountability, and service, we would like to hear about your goals.",
        points: [
          "A focus on continued professional development",
          "Marketing guidance and business development support",
          "A collaborative, accountable team culture",
        ],
        note: "Please include your NMLS ID in your inquiry so we can review your license record on NMLS Consumer Access. Sharing your interest is the start of a conversation, not an offer of employment.",
        cta: { label: "I'm a Licensed Loan Officer", href: pathwayHref("licensed") },
      },
      {
        id: "aspiring" as const,
        label: "Pathway B",
        title: "Aspiring Mortgage Professionals",
        audience: "Disciplined, career-focused individuals interested in entering the mortgage industry.",
        description:
          "If you are considering a mortgage career, we can talk through potential pathways into the industry and the skills it takes to succeed, such as communication, organization, follow-through, and a commitment to learning.",
        points: [
          "Talk through potential career pathways",
          "Understand the skills that support success",
          "Learn what licensing involves before you commit",
        ],
        note: "Taking loan applications or negotiating loan terms requires the applicable mortgage loan originator license and legal authorization, including NMLS registration and Florida licensing. Expressing interest does not guarantee employment, licensing sponsorship, or a training placement, and no one may perform loan origination activities before they are licensed.",
        cta: { label: "I'm Exploring a Mortgage Career", href: pathwayHref("aspiring") },
      },
    ],
  },

  culture: {
    eyebrow: "Our culture",
    title: "A Culture Built on Service and Accountability.",
    description:
      "Green Valor Lending is veteran-owned and operated. Our leadership brings the values of service, discipline, and accountability to how we work with borrowers and with each other. You do not need a military background to belong here; you need to share the standard.",
    motto: "Built on Service. Driven by Valor.",
    points: [
      {
        title: "Strong work ethic",
        description: "We value steady, consistent effort and doing the work well.",
      },
      {
        title: "Professional responsibility",
        description: "We take ownership of our commitments to clients, partners, and the team.",
      },
      {
        title: "Long-term relationships",
        description: "We focus on trust that lasts beyond a single transaction.",
      },
      {
        title: "Consistent improvement",
        description: "We review, learn, and get a little better every week.",
      },
      {
        title: "Respect and collaboration",
        description: "We treat people well and succeed by working together.",
      },
    ],
  },

  apply: {
    eyebrow: "Recruitment inquiry",
    title: "Start the Conversation.",
    description:
      "Tell us a little about yourself and your goals. A member of our team will review your information and follow up. This is not a mortgage application.",
    privacy: [
      "Your information is used only to evaluate and respond to your career inquiry.",
      "Recruiting inquiries are kept separate from borrower inquiries.",
      "We do not ask for resumes, Social Security numbers, or financial details on this form.",
    ],
    unavailable:
      "Online career inquiries are not open yet. Please check back soon, or reach out to our team directly.",
  },

  process: {
    eyebrow: "What to expect",
    title: "Our Recruitment Process.",
    steps: [
      {
        title: "Express Your Interest",
        description: "Share your background and goals through the inquiry form.",
      },
      {
        title: "Initial Conversation",
        description: "A member of our team reaches out to learn more about you and answer your questions.",
      },
      {
        title: "Discuss Career Alignment",
        description:
          "We talk through your experience, licensing status, and whether the fit makes sense for both sides.",
      },
      {
        title: "Explore Next Steps",
        description: "If there is mutual interest, we discuss what potential next steps could look like.",
      },
    ],
    note: "Every inquiry is reviewed individually. Submitting an inquiry or completing a conversation does not guarantee an offer of employment.",
  },

  cta: {
    title: "Your Next Chapter Begins With Initiative.",
    description:
      "Meaningful careers are built through discipline, continuous learning, and commitment. If you're ready to explore a future in the mortgage industry, we'd like to connect.",
    primary: { label: "Apply Now", href: APPLY_HREF },
  },
};
