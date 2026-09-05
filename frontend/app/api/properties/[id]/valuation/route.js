import properties from '../../../../data/properties.json';
import { sampleValuation } from '../../../../utils/catalog.mjs';
export async function GET(request, { params }) {
  const { id } = await params;
  const property = properties.find(p => p.id === id);
  return property ? Response.json(sampleValuation(property)) : Response.json({ error: 'Property not found' }, { status: 404 });
}
