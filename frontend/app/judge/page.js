import JudgeClient from './JudgeClient';
export default async function JudgePage({ searchParams }) {
  const params = await searchParams;
  return <JudgeClient token={typeof params.token === 'string' ? params.token : ''} />;
}
