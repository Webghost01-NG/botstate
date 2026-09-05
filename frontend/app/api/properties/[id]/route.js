import { NextResponse } from 'next/server';
import properties from '../../../data/properties.json';
import { sampleAsset } from '../../../utils/sample.mjs';

export async function GET(request, { params }) {
  const { id } = await params;
  if (id === sampleAsset.id) return NextResponse.json({ property: sampleAsset, mode: 'sample', aiAnalysis: 'Fictional sample asset; no independent appraisal.', comparables: [] });
  const property = properties.find(p => p.id === id);

  if (!property) {
    return NextResponse.json({ error: 'Property not found' }, { status: 404 });
  }

  // Find comparable properties in same region or price range
  const comparables = properties
    .filter(p => p.id !== property.id && (
      p.country === property.country ||
      Math.abs(p.price - property.price) < property.price * 0.35
    ))
    .slice(0, 3);

  return NextResponse.json({
    property,
    aiAnalysis: 'Sample catalog data; not a verified appraisal.',
    mode: 'sample',
    riskScore: property.riskScore,
    comparables
  });
}
