import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const linkSchema = z.object({
  label: z.string().min(1),
  href: z.url(),
  kind: z.enum(['repository', 'live']),
});

const evidenceSchema = z.object({
  kind: z.enum(['path', 'citation', 'architecture', 'status', 'capture', 'operation']),
  label: z.string().min(1),
  value: z.string().min(1),
  sourcePath: z.string().min(1).optional(),
});

const spreadSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  question: z.string().min(1),
  narrative: z.array(z.string().min(1)).min(1),
  artifactIds: z.array(z.string().min(1)).min(1),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/data/projects' }),
  schema: z.object({
    order: z.number().int().nonnegative(),
    title: z.string().min(1),
    role: z.string().min(1).optional(),
    date: z.string().min(1).optional(),
    status: z.enum(['public', 'private', 'in-progress', 'deployed', 'link-pending']),
    statusLabel: z.string().min(1),
    chapterType: z.enum(['field-note', 'case-study', 'flagship']),
    themeAvailability: z.enum(['both', 'recruiter-only']),
    recruiterSummary: z.string().min(1),
    story: z.array(z.string().min(1)).min(1),
    technicalNarrative: z.array(z.string().min(1)).min(1),
    technologies: z.array(z.string().min(1)).min(1),
    verifiedClaims: z.array(z.string().min(1)),
    evidence: z.array(evidenceSchema),
    spreads: z.array(spreadSchema),
    links: z.array(linkSchema),
    architecture: z.array(z.string().min(1)).optional(),
    operations: z.array(z.string().min(1)).optional(),
    lessons: z.array(z.string().min(1)).optional(),
    outcome: z.string().min(1).optional(),
    legacyHashes: z.array(z.string().regex(/^#note-[a-z0-9-]+$/)),
  }).superRefine((project, ctx) => {
    if (project.chapterType === 'flagship' && project.spreads.length !== 5) {
      ctx.addIssue({ code: 'custom', path: ['spreads'], message: 'A flagship requires exactly five spreads.' });
    }
    if (project.links.some((link) => link.href.includes('example.com'))) {
      ctx.addIssue({ code: 'custom', path: ['links'], message: 'Unverified example links are forbidden.' });
    }
    if (['private', 'in-progress', 'link-pending'].includes(project.status) && project.links.length > 0) {
      ctx.addIssue({ code: 'custom', path: ['links'], message: 'Private, in-progress, and link-pending projects cannot publish links.' });
    }
  }),
});

export const collections = { projects };
