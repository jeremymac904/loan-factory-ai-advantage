import { redirect } from 'next/navigation';

/**
 * /showcase was renamed to /templates-examples per the screenshot-review brief.
 * Keep the route alive as a permanent server-side redirect so external links
 * (and the existing Header nav cached in users' browsers) keep working.
 */
export default function ShowcaseRedirect(): never {
  redirect('/templates-examples');
}
