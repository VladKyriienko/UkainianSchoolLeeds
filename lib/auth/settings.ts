// Boolean toggles to determine which auth types are allowed
const allowOauth = true;
const allowEmail = true;
const allowPassword = true;
const allowSignUp = false;

// Organisation feature toggles
const allowOrganisations = false;
const allowUserCreateOrganisations = false;
const allowOrganisationInvites = false;
const allowOrganisationRoleManagement = false;
const requireOrganisationForSignup = false;

// Post-signup completion requirements
const requirePostSignupCompletion = false;
const postSignupCompletionPath = '/admin/profile/complete';

// Check that at least one of allowPassword and allowEmail is true
if (!allowPassword && !allowEmail)
  throw new Error('At least one of allowPassword and allowEmail must be true');

export const getAuthTypes = () => {
  return { allowOauth, allowEmail, allowPassword, allowSignUp };
};

export const getOrganisationSettings = () => {
  return {
    allowOrganisations,
    allowUserCreateOrganisations,
    allowOrganisationInvites,
    allowOrganisationRoleManagement,
    requireOrganisationForSignup
  };
};

export const getPostSignupSettings = () => {
  return {
    requirePostSignupCompletion,
    postSignupCompletionPath
  };
};
