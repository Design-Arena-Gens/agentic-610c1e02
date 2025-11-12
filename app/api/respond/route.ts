import { NextResponse } from 'next/server';
import { getPanelClient } from '@/lib/panel-client';
import { registerResolution } from '@/lib/state';
import { runGuardianAgent, buildAgentReport } from '@/lib/agent';

export async function POST(request: Request) {
  const body = await request.json();
  const { requestId } = body as { requestId?: string };

  if (!requestId) {
    return NextResponse.json({ error: 'requestId manquant' }, { status: 400 });
  }

  const client = getPanelClient();
  const requests = await client.fetchRequests();
  const target = requests.find((item) => item.id === requestId);

  if (!target) {
    return NextResponse.json({ error: 'Ticket introuvable' }, { status: 404 });
  }

  const resolution = runGuardianAgent(target);
  const delivery = await client.postResponse(target, resolution);
  const report = buildAgentReport(resolution, target);

  registerResolution(target, resolution.inference.confidence);

  return NextResponse.json({
    success: true,
    request: target,
    resolution,
    report,
    delivery,
  });
}
