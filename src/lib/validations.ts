export type RequestValues = {company:string;description:string;requirements:string;date:string;budget:string;notes:string};
export function validateRequest(values: Partial<RequestValues> | null | undefined, today: string): Partial<Record<keyof RequestValues, string>> {
  const errors: Partial<Record<keyof RequestValues, string>> = {};
  const company = typeof values?.company === 'string' ? values.company : '';
  const description = typeof values?.description === 'string' ? values.description : '';
  const requirements = typeof values?.requirements === 'string' ? values.requirements : '';
  const date = typeof values?.date === 'string' ? values.date : '';
  const budget = typeof values?.budget === 'string' ? values.budget : '';
  if (company.trim().length < 2) errors.company = 'Enter your name or company name (at least 2 characters).';
  if (description.trim().length < 20) errors.description = 'Tell us a little more about your project (at least 20 characters).';
  if (requirements.trim().length < 5) errors.requirements = 'Describe the content or deliverables you need.';
  const parsedDate = new Date(`${date}T00:00:00Z`);
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(parsedDate.valueOf()) && parsedDate.toISOString().slice(0, 10) === date;
  if (!validDate || date < (today ?? '')) errors.date = 'Choose today or a future date.';
  if (!budget || !Number.isFinite(Number(budget)) || Number(budget) <= 0) errors.budget = 'Enter a budget greater than zero.';
  return errors;
}
