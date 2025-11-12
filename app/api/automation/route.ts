import { NextResponse } from 'next/server';
import { getAutomationSnapshot, setAutomationEnabled } from '@/lib/state';

export async function POST(request: Request) {
  const body = await request.json();
  const { enabled } = body as { enabled?: boolean };

  if (typeof enabled !== 'boolean') {
    return NextResponse.json({ error: 'Valeur invalide' }, { status: 400 });
  }

  setAutomationEnabled(enabled);
  return NextResponse.json(getAutomationSnapshot());
}
