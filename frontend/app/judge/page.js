import JudgeClient from './JudgeClient';
import deployment from '../data/active-deployment.json';
export default function JudgePage() {
  return <JudgeClient token={deployment.sample.address} />;
}
