export const getZodMessage = (error) => {
  const issue = error?.issues?.[0] || error?.errors?.[0];
  return issue?.message || 'Validation failed';
};
