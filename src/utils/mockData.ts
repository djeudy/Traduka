import { Project, ProjectStatus, ProjectDocument, Comment, Payment } from "@/types";

const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

export const generateMockProjects = (count: number): Project[] => {
  const projects: Project[] = [];
  const statuses: ProjectStatus[] = ['waiting', 'in-progress', 'review', 'completed'];
  const languages = ['Français', 'Anglais', 'Espagnol', 'Allemand', 'Italien', 'Portugais', 'Chinois', 'Russe'];

  for (let i = 0; i < count; i++) {
    const submittedAt = randomDate(new Date(2023, 0, 1), new Date());
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    let startedAt: string | null = null;
    let estimatedCompletionDate: string | null = null;
    let completedAt: string | null = null;

    if (status !== 'waiting') {
      const startedDate = new Date(submittedAt.getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000);
      startedAt = startedDate.toISOString();
      const estimatedDate = new Date(startedDate.getTime() + (7 + Math.random() * 14) * 24 * 60 * 60 * 1000);
      estimatedCompletionDate = estimatedDate.toISOString();

      if (status === 'completed') {
        const completedDate = new Date(startedDate.getTime() + Math.random() * 10 * 24 * 60 * 60 * 1000);
        completedAt = completedDate.toISOString();
      }
    }

    let sourceLanguage: string, targetLanguage: string;
    do {
      sourceLanguage = languages[Math.floor(Math.random() * languages.length)];
      targetLanguage = languages[Math.floor(Math.random() * languages.length)];
    } while (sourceLanguage === targetLanguage);

    const documents: ProjectDocument[] = [
      {
        id: `DOC-${i}`,
        name: `Document ${i + 1}.pdf`,
        url: `/documents/doc-${i + 1}.pdf`,
        uploaded_at: submittedAt.toISOString(),
        project_id: `PRJ-${i}`,
        size: Math.floor(Math.random() * 5000000),
      }
    ];

    const comments: Comment[] = status !== 'waiting' ? [
      {
        id: `CMT-${i}-1`,
        content: 'Bonjour, j\'ai commencé la traduction.',
        createdAt: (startedAt || submittedAt.toISOString()),
        userId: "2",
        projectId: `PRJ-${i}`,
        user: {
          name: 'Sophie Martin',
          email: 'sophie@example.com',
          role: 'translator',
        }
      },
      {
        id: `CMT-${i}-2`,
        content: 'Merci, voici notre glossaire.',
        createdAt: new Date(new Date(startedAt || submittedAt).getTime() + 24 * 60 * 60 * 1000).toISOString(),
        userId: "1",
        projectId: `PRJ-${i}`,
        user: {
          name: 'Client Démo',
          email: 'client@example.com',
          role: 'client',
        }
      }
    ] : [];

    const payments: Payment[] = status !== 'waiting' ? [
      {
        id: `PAY-${i}`,
        amount: Math.floor(300 + Math.random() * 700),
        currency: 'EUR',
        status: Math.random() > 0.2 ? 'completed' : 'pending',
        created_at: submittedAt.toISOString(),
        project_id: `PRJ-${i}`,
        user_id: "1",
      }
    ] : [];

    projects.push({
      id: `PRJ-${i}`,
      name: `Projet de traduction ${i + 1}`,
      client: 1,
      source_language: sourceLanguage,
      target_language: targetLanguage,
      status,
      submitted_at: submittedAt.toISOString(),
      started_at: startedAt,
      estimated_completion_date: estimatedCompletionDate,
      completed_at: completedAt,
      private_project: Math.random() > 0.5,
      translator: status !== 'waiting' ? 2 : null,
      translated_documents: [],
      source_documents: [],
      comments,
      payments,
      instructions: 'Merci de respecter la terminologie fournie.',
    });
  }

  return projects;
};
