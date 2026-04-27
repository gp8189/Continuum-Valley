import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const DATA_FILE = join(process.cwd(), 'content.json');

const DEFAULT_CONTENT = {
  donorEmail: 'your@email.com',
  investorEmail: 'your@email.com',
  instagramUrl: '#',
  tiktokUrl: '#',
  youtubeUrl: '#',
  statuses: {
    foodProduction: 'In Development',
    communityVenue: 'In Development',
    educationHub: 'Planned',
    mutualAid: 'Planned',
    franchiseBlueprint: 'Planned',
  },
  adminPassword: 'continuum2026',
};

function loadContent() {
  if (!existsSync(DATA_FILE)) return DEFAULT_CONTENT;
  try {
    return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return DEFAULT_CONTENT;
  }
}

export async function GET() {
  return NextResponse.json(loadContent());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const current = loadContent();

  // Require correct current password to save
  if (body.currentPassword !== current.adminPassword) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const updated = {
    ...current,
    donorEmail: body.donorEmail ?? current.donorEmail,
    investorEmail: body.investorEmail ?? current.investorEmail,
    instagramUrl: body.instagramUrl ?? current.instagramUrl,
    tiktokUrl: body.tiktokUrl ?? current.tiktokUrl,
    youtubeUrl: body.youtubeUrl ?? current.youtubeUrl,
    statuses: {
      foodProduction: body.statuses?.foodProduction ?? current.statuses.foodProduction,
      communityVenue: body.statuses?.communityVenue ?? current.statuses.communityVenue,
      educationHub: body.statuses?.educationHub ?? current.statuses.educationHub,
      mutualAid: body.statuses?.mutualAid ?? current.statuses.mutualAid,
      franchiseBlueprint: body.statuses?.franchiseBlueprint ?? current.statuses.franchiseBlueprint,
    },
    adminPassword: body.newPassword && body.newPassword.trim() !== ''
      ? body.newPassword.trim()
      : current.adminPassword,
  };

  writeFileSync(DATA_FILE, JSON.stringify(updated, null, 2));
  return NextResponse.json({ ok: true });
}
