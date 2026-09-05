import properties from '../../data/properties.json';
import { catalogReply } from '../../utils/catalog.mjs';
export async function POST(request) {
  try {
    const { message } = await request.json();
    const result = catalogReply(message, properties);
    return Response.json({ response: result.reply, reply: result.reply, properties: result.properties, propertyRecommendations: result.properties, mode: 'rule-based-sample' });
  } catch {
    return Response.json({ error: 'Enter a message of 1–2000 characters.' }, { status: 400 });
  }
}
