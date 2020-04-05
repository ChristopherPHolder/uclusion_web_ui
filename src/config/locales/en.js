import { defineMessages } from 'react-intl'

const messages = defineMessages({
  app_name: 'Uclusion',
  support: 'Support',
  page_not_found_demo: 'Page not found demo',
  404: '404',
  warning_404_message: '404 Page not found',
  warning_404_description: 'We are sorry but the page you are looking for does not exist.',
  warning_404_categories: 'No categories configured for this market.',
  warning: 'Warning',
  slack_register_failed: 'Slack registration failure.',
  settings: 'Settings',
  language: 'Language',
  theme: 'Theme',
  responsive: 'Responsive',
  en: 'English',
  de: 'Deutsch',
  bs: 'Bosanski',
  ru: 'Русский',
  es: 'Español',
  dark: 'Dark',
  light: 'Light',
  default: 'Default',
  green: 'Green',
  red: 'Red',
  sign_out: 'Sign out',
  day_mode: 'Day Mode',
  daysLeft: 'days left',
  hoursLeft: 'hours left',
  minutesLeft: 'min left',
  night_mode: 'Night Mode',
  sign_in: 'Sign in',
  sign_up: 'Sign up',
  continue: 'Continue',
  homeBreadCrumb: 'Home',
  reset_password_header: 'Reset Password',
  login_header: 'Log In',
  sign_in_with_google: 'Sign in with Google',
  sign_in_with_facebook: 'Sign in with Facebook',
  sign_in_with_twitter: 'Sign in with Twitter',
  sign_in_with_github: 'Sign in with Github',
  my_account: 'My account',
  name: 'Name',
  adminName: 'Name of new admin',
  email: 'E-Mail',
  password: 'Password',
  new_password: 'New Password',
  confirm_password: 'Confirm Password',
  forgort_password: 'Forgot Password?',
  reset_password: 'Reset Password',
  change_password: 'Change Password',
  change_photo: 'Change Photo',
  change_email: 'Change E-Mail',
  reset_password_hint: 'Enter your E-Mail',
  save: 'Save',
  delete_account: 'Delete account',
  select_file: 'Select file',
  cancel: 'Cancel',
  submit: 'Submit',
  delete: 'Delete',
  ok: 'OK',
  delete_account_dialog_title: 'Delete Account?',
  delete_account_dialog_message: 'Your account will be deleted and you will lose all your data!',
  email_not_verified: 'E-Mail is not verified!',
  email_verified: 'E-Mail is verified',
  send_verification_email: 'Send verification E-Mail',
  send_verification_email_again: 'Send verification E-Mail again',
  check_email_code: 'Please check your email for a verification code',
  investibles: 'Investibles',
  users: 'Users',
  manage: 'Add Collaborators',
  edit: 'Edit',
  edit_lock: 'Someone else is editing!',
  online: 'Online',
  offline: 'Offline',
  no_connection_warning: 'No connection!',
  title_label: 'Title',
  title_hint: 'Enter title',
  no_connection: 'No connection',
  delete_task_title: 'Delete task?',
  delete_task_message: 'The task will be deleted!',
  error: 'Error!',
  description_label: 'Description',
  description_hint: 'Enter description',
  name_label: 'Name',
  name_hint: 'Enter name',
  public_chats: 'Public chat',
  delete_message_title: 'Delete message?',
  delete_message_message: 'Message will be deleted!',
  user_registrationg_graph_label: 'User registrations',
  required: 'Required',
  facebook: 'Facebook',
  github: 'Github',
  twitter: 'Twitter',
  phone: 'Phone',
  google: 'Google',
  facebook_color: '#303F9F',
  github_color: '#263238',
  twitter_color: '#36A2EB',
  phone_color: '#90A4AE',
  google_color: '#EA4335',
  password_color: '#4CAF50',
  chats: 'Chats',
  write_message_hint: 'Write message...',
  load_more_label: 'More...',
  my_location: 'My Location',
  select_user: 'Select user',
  operator_like_label: 'like',
  operator_notlike_label: 'not like',
  operator_equal_label: 'equal',
  operator_notequal_label: 'not equal',
  operator_novalue_label: 'no value',
  administration: 'Administration',
  roles: 'Roles',
  grants: 'Grants',
  private: 'Private',
  public: 'Public',
  created_by: 'Created by',
  observers: 'Approver:',
  dialogParticipants: 'collaborators',
  dialogObservers: 'Observers',
  unassigned: 'unassigned',
  isObserver: 'Notifications off',
  browserNotSupported: 'Currently only the latest Chrome browser is supported',
  addDecision: 'Add Dialog',
  addPlanning: 'Add Workspace',
  addInitiative: 'Add Initiative',
  author: 'author',
  done: 'Done',

  // Support
  supportInfoText: 'Create bugs (but not feature requests) in <a>Uclusion issues</a> or send an email to <b>support</b> which includes the version and user ID above.',
  featureRequest: 'Feature Request',
  createFeatureRequest: 'Create feature request',
  // Loadable Image
  loadableImageAlt: 'User provided image',

  // Sidebar Nav menu names
  sidebarNavDialogs: 'Decision Dialogs',
  sidebarNavActionItems: 'Action Items',
  sidebarNavTemplates: 'Templates',
  sidebarNavNotifications: 'Action Center',
  sideBarNavTempSignout: 'Signout(Temp)',
  sidebarNewPlanning: 'Create New Workspace',

  loadingMessage: 'Please wait while your page loads.',
  loadingMarket: 'Processing Invite',
  loadingSlack: 'Slack Integration',

  // ExpirationSelector
  expirationSelectorOneDay: '1 day',
  expirationSelectorXDays: '{x} days',

  // Market Add
  marketAddTitleDefault: 'Add a name...',
  marketAddTitleLabel: 'Name',
  marketAddDescriptionDefault: 'Add a description...',
  marketAddCancelLabel: 'Cancel',
  marketAddSaveLabel: 'Save',
  decisionAddExpirationLabel: 'Dialog ends after {x} day(s)',
  initiativeAddExpirationLabel: 'Initiative ends after {x} day(s)',
  investmentExpirationInputLabel: 'Number of days before a vote expires',
  maxMaxBudgetInputLabel: 'Maximum number of days for story budget',
  daysEstimateInputLabel: 'Very rough number of days to complete',
  votesRequiredInputLabel: 'Votes required to move a story to in progress',
  votesRequiredInputLabelShort: 'votes required',
  votesRequiredInputHelperText: 'Votes required to move a story to in progress',
  investmentExpiration: 'before votes expire',
  initiativeExpiration: 'before initiative expires',
  decisionExpiration: 'before dialog expires',
  storyTitlePlaceholder: 'Name your story',
  optionTitlePlaceholder: 'Name your option',
  agilePlanFormTitlePlaceholder: 'Name your workspace',
  decisionTitlePlaceholder: 'Name your dialog',
  initiativeTitlePlaceholder: 'Name your initiative',
  agilePlanFormTitleLabel: 'Name',
  agilePlanFormFieldsetLabelOptional: 'Optional',
  agilePlanFormFieldsetLabelRequired: 'Required',
  agilePlanFormDaysEstimateLabel: 'Days estimate',
  agilePlanFormDaysEstimatePlaceholder: 'Very rough number of days to complete',
  agilePlanFormInvestmentExpirationLabel: 'vote expiration',
  agilePlanFormMaxMaxBudgetInputLabel: 'story budget',
  agilePlanFormSaveLabel: 'Save & Post',

  // Market Nav
  marketNavTabContextLabel: 'Context',
  marketNavTabAddIdeaLabel: 'Add New',

  // Market Edit
  marketEditTitleLabel: 'Name',
  marketEditCancelLabel: 'Close',
  marketEditSaveLabel: 'Save',

  editMarketButtonPlan: 'Edit workspace',
  editMarketButtonDecision: 'Edit dialog',
  editMarketButtonInitiative: 'Edit initiative',

  // InvestibleEditButton
  investibleEditButtonTooltip: 'Edit',
  daysEstimateLabel: 'effort estimate',

  // CurrentVoting
  numVoting: '{x} votes',
  certainty100: 'Very Certain',
  certainty75: 'Certain',
  certainty50: 'Somewhat Certain',
  certainty25: 'Somewhat Uncertain',
  certainty5: 'Uncertain',
  maxBudgetLabel: 'effort value',
  maxBudgetValue: '{x} days',
  certaintyQuestion: 'Rate Your Certainty',
  reasonQuestion: 'Why did you vote for this option?',
  saveVote: 'Cast Vote',
  updateVote: 'Update Vote',
  yourReason: 'Your reason...',
  cancelVote: 'Cancel',
  removeVote: 'Remove Vote',
  maxBudgetInputLabel: 'effort value',
  maxBudgetInputHelperText: 'value must be less than {x}',
  draft: 'Draft',
  inactive: 'Inactive',

  // Address list
  addressAddCancelLabel: 'Close',
  addressAddClearLabel: 'Close',
  addressAddSaveLabel: 'Add collaborators',
  inviteParticipantsLabel: 'Invite by email',
  addExistingCollaborator: 'Add',

  // InvestibleAdd
  investibleAddTitleDefault: 'Add a name...',
  investibleAddTitleLabel: 'Name',
  investibleAddDescriptionDefault: 'Add a description...',
  investibleAddCancelLabel: 'Cancel',
  investibleAddSaveLabel: 'Save',


  // InvestibleEdit
  investibleEditTitleLabel: 'Title',
  investibleEditCancelLabel: 'Cancel',
  investibleEditSaveLabel: 'Save',
  investibleEditAcceptLabel: 'Accept Story',
  investibleEditArchiveLabel: 'Archive Story',
  investibleEditSubmitLabel: 'Submit',
  descriptionEdit: 'Description. Changes will be stored locally until you save or cancel.',

  // Investible
  investibleEditLabel: 'Edit',
  investibleAssignLabel: 'Assign',
  investibleAssign: 'Story - Assignments',
  createAssignment: 'Assign story',
  investibleAssignForVotingLabel: 'Assign & Move Voting',
  investibleAddHeader: 'Add Investible',
  investibleEditStageHelper: 'Select to change stage',
  investibleEditInvestibleFetchFailed: 'There was a problem loading your investible for edit. Please try again later',
  investibleAddToVotingLabel: 'Move to Candidates',
  investibleBackToOptionPoolLabel: 'Back to Option Pool',
  investibleAddToVotingExplanation: 'Once in voting you will still be able to remove this option',
  investibleRemoveFromVotingExplanation: 'Remove current votes and move back to Option Pool',
  investibleDeleteLabel: 'Permanently Delete',
  investibleDeleteExplanationLabel: 'Permanently remove this option from the dialog',
  planningInvestibleToVotingLabel: 'Move to Voting',
  planningInvestibleNextStageAcceptedLabel: 'Move to In Progress',
  planningInvestibleNextStageInReviewLabel: 'Move to In Review',
  planningInvestibleMoveToVerifiedLabel: 'Move to Verified',
  planningInvestibleMoveToFurtherWorkLabel: 'Move to Ready for Further Work',
  planningInvestibleMoveToNotDoingLabel: 'Move to Not Doing',
  planningInvestibleAcceptedExplanation: 'Move to in progress when you have enough votes and are ready to start',
  planningInvestibleInReviewExplanation: 'Move to in review when a story is done but you want feedback',
  planningInvestibleNotDoingExplanation: 'Move to not doing will unassign and archive the story',
  planningInvestibleVerifiedExplanation: 'Move to verified when you no longer anticipate further work on the story',
  planningInvestibleFurtherWorkExplanation: 'Move to this stage when a handoff to another assignee is expected for this story',
  planningInvestibleVotingExplanation: 'Move to voting allows certainty and estimates to be re-collected',
  planningVotingStageLabel: 'Voting',
  planningAcceptedStageLabel: 'In Progress',
  planningBlockedStageLabel: 'Blocked',
  planningReviewStageLabel: 'In Review',
  planningVerifiedStageLabel: 'Verified',
  planningFurtherWorkStageLabel: 'Ready for Further Work',
  planningNotDoingStageLabel: 'Not Doing',
  planningInvestibleAssignments: 'assigned',
  planningInvestibleDecision: 'Create Child Dialog',
  planningInvestibleCantVote: 'You can\'t vote if you\'re assigned',
  planningInvestibleDescription: '- Description',
  daysEstimateHelp: 'How many days is this story worth? That is if the assigned worked on it longer than that it might not be useful.',
  votesRequiredHelp: 'How many votes are required before a story can be moved to \'In Progress\'',
  workspaceDaysEstimateHelp: 'If this workspace is a project and a very rough estimate is required then can enter here.',
  maxBudgetHelp: 'Maximum days effort value allowed for a story. Used to prevent stories from being too large.',
  voteExpirationHelp: 'How many days can a story remain in voting before its votes expire. Prevents very old voting from being used to move a story in progress.',
  reassignToMove: 'Re-assigning will move into voting.',
  initiativePlanningParent: 'Create Child Workspace',
  marketLinksSection: 'children',
  parentLinkSection: 'parent',
  marketParticipationLink: 'Participate in - {x}',
  inlineMarketName: 'Decision {x}',
  marketObservationLink: 'Observe - {x}',
  lockedBy: 'Locked by {x}',
  lockFailedWarning: 'Failed to acquire lock. Retry?',
  breakLock: 'Break Lock',
  newStory: 'New Story',
  newOption: 'New Option',
  noVoters: 'No Voters',
  storyHelp: 'Need something assigned and voted on now that takes a day or longer? Use the plus icon in the sidebar menu.',
  // Issues
  issueResolveLabel: 'Resolve',
  issueReplyLabel: 'Reply',
  issueProceed: 'Proceed',
  // lock dialog
  lockDialogCancel: 'cancel',
  pageLockEditPage: 'edit page',
  lockDialogTitle: 'page locked',
  lockDialogContent: 'A user is currently editing this page, would you like to take over editing capabilities?',

  // CommentAdd
  commentAddIssueDefault: 'Your issue...',
  commentAddQuestionDefault: 'Your question...',
  commentAddSuggestDefault: 'Your suggestion...',
  commentAddReplyDefault: 'Your reply...',
  commentAddSaveLabel: 'Save',
  commentAddCancelLabel: 'Clear',
  issueWarning: 'Opening an issue will halt voting on this dialog.',
  issueWarningInvestible: 'Opening an issue will halt voting on this option.',
  issueWarningPlanning: 'Opening an issue will move this story to blocked and stop execution or voting.',

  // CommentBox
  commentIconRaiseIssueLabel: 'Raise Issue',
  commentIconAskQuestionLabel: 'Ask Question',
  commentIconSuggestChangesLabel: 'Suggest Changes',

  // Comments
  commentReplyDefault: 'Your reply...',
  commentReplyLabel: 'Reply',
  commentEditLabel: 'Edit',
  commentReplySaveLabel: 'Save',
  commentReplyCancelLabel: 'Cancel',
  commentReopenLabel: 'Reopen',
  commentResolveLabel: 'Resolve',
  commentViewThreadLabel: 'View Thread',
  commentCloseThreadLabel: 'Close Thread',
  lastUpdatedBy: 'Last Updated By',

  // card types
  cardTypeLabelIssue: 'issue',
  cardTypeLabelQuestion: 'question',
  cardTypeLabelSuggestedChange: 'suggestion',
  cardTypeAgilePlan: 'workspace - description',

  // Notices
  noticeNewApplicationVersion: 'A new version of the application is available! It will load when you close this message.',
  noticeVersionForceLogout: 'This version of the application requires signout which will happen when you close this message.',

  // stages
  marketStageFollowTooltip: 'Subscribe',
  marketStageUnFollowTooltip: 'Unsubscribe',
  changeStage: 'Change stage',

  // markets
  marketSelectDefault: 'Your Dialogs',
  marketFollowTooltip: 'Subscrbe',
  marketUnFollowTooltip: 'Unsubscribe',
  marketUnspent: 'Total unspent uShares in this market',
  marketActiveInvestments: 'Total actively invested uShares in this market',

  // Rich text editor
  RichTextEditorAddLinkTitle: 'Add Link',
  RichTextEditorEnterUrl: 'Enter the URL of the link:',
  RichTextEditorEnterTextAndLink: 'Enter the URL and text of the link:',
  RichTextEditorLinkLabel: 'Link',
  RichTextEditorTextLabel: 'Text',
  RichTextEditorToManyBytes: 'To much data. Please remove items from the editor',

  // Investible detail
  investibleDetailClose: 'Close',

  // Home
  homeSubsectionPlanning: 'Workspaces',
  homeSubsectionDecision: 'Dialogs',
  homeAddDecision: 'Create Dialog',
  homeAddPlanning: 'Create Workspace',
  homeAddPlanningExplanation: 'Create a workspace when you want to discuss a project or assign stories',
  homeAddDecisionExplanation: 'Create a dialog when you want to brainstorm solution alternatives',
  homeAddInitiativeExplanation: 'Create an initiative to measure support for an idea',
  homeViewArchivesExplanation: 'Archive is where dismissed items go',
  homeAddInitiative: 'Create Initiative',
  homePlanningReport: 'Active Story Value Estimates (in days)',
  homeViewArchives: 'View Archive',
  homeViewAbout: 'About',
  homeCreatedAt: 'Created on {dateString}',
  archiveWarning: 'Deactivating cannot be undone.',
  new: 'New',
  information: 'Information',
  message: 'Message',
  // Archives
  archivesTitle: 'Archive',
  openDrawer: 'Open or close full sidebar menu',


  // Decision Dialogs
  decisionDialogsStartedBy: 'Started By: {name}',
  decisionDialogsExpires: 'Expires:',
  decisionDialogsObserverLabel: 'Observer',
  decisionDialogsParticipantLabel: 'Participant',
  decisionDialogsExtendDeadline: 'Extend Deadline',
  decisionDialogsDismissDialog: 'Dismiss',
  decisionDialogsRestoreDialog: 'Restore',
  decisionDialogsBecomeObserver: 'Silence notifications',
  decisionDialogsBecomeParticipant: 'Activate notifications',
  decisionDialogsInviteParticipant: 'Invite Participant',
  decisionDialogsArchiveDialog: 'Deactivate',

  // Planning Dialog
  planningDialogManageParticipantsLabel: 'Add Collaborators',
  planningDialogSummaryLabel: 'Workspace Detail',
  planningDialogPeopleLabel: 'collaborator\'s stories',
  planningDialogDiscussionLabel: 'Discussion',
  planningDialogAddInvestibleLabel: 'Create Story',
  planningDialogAddInvestibleExplanation: 'Create a story and collaborate on what to do',
  planningDialogManageParticipantsExplanation: 'Add collaborators to this workspace',
  planningDialogViewArchivesExplanation: 'See stories in Verified and Not Doing',
  planningDialogViewArchivesLabel: 'View Archive',
  planningNoneAcceptedWarning: 'No in progress story',
  planningNoneInDialogWarning: 'No votable story',
  planningNoneInReviewWarning: 'No in review story',
  planningNoneInBlockingWarning: 'No blockers',
  acceptedInvestiblesUpdatedAt: 'In progress from ',
  reviewingInvestiblesUpdatedAt: 'In review from ',
  inDialogInvestiblesUpdatedAt: 'Assigned for voting on ',
  blockedInvestiblesUpdatedAt: 'Blocked since ',
  planningAddHelp: 'A workspace is your place for all stories, questions, issues, requirements and decisions about a project or topic.',
  planningInvestibleAddHelp: 'Stories allow collaboration on what should be done, by whom, how and status at a glance without a meeting.',
  planningInvestibleEnoughVotesHelp: 'This story has enough votes so consider using the up arrow in the sidebar menu to move \'In Progress\'',
  planningInvestibleAcceptedFullHelp: 'You can only have one story at a time \'In Progress\' so the up arrow is not visible yet.',
  planningEditHelp: 'Workspace descriptions communicate requirements well with notifications and a difference display of the change.',
  planningInvestibleAcceptedHelp: 'For help brainstorming how to do this story choose the link icon from the sidebar menu to create a child dialog.',
  planningInvestibleVotingHelp: 'Vote how certain you are this story should be done or open an issue.',
  inlineAddLabel: 'Add Option',
  inlineAddExplanation: 'Add a how to do this story option and collect votes on it.',
  // Decision Dialog
  decisionDialogSummaryLabel: 'Background Information',
  decisionDialogCurrentVotingLabel: 'Candidates',
  storyCurrentVotingLabel: 'Options for doing this story',
  decisionDialogProposedOptionsLabel: 'Option Pool',
  decisionDialogDiscussionLabel: 'Discussion',
  decisionDialogAddInvestibleLabel: 'Add Option',
  decisionDialogAddExplanationLabel: 'Add a new option directly into voting',
  decisionDialogProposeInvestibleLabel: 'Propose Option',
  decisionDialogProposeExplanationLabel: 'Propose an option for consideration of being added to voting',
  decisionDialogExtendDaysLabel: 'Number of days to extend deadline?',
  decisionDialogNoInvestiblesWarning: 'No votable options',
  childDialogExplanation: 'Click here to create and link in a child dialog deciding something relevant to this parent.',
  childPlanExplanation: 'Click here to create and link in a child workspace relevant to this initiative.',
  decisionAddHelp: 'A Dialog gives you a timed box way to decide with others between options that you control.',
  backToOptionPoolWarning: 'Moving this option back to the Option Pool deletes all votes.',

  // Investibles in decision dialog display
  decisionDialogInvestiblesUpdatedAt: 'Last Updated:',
  dialogAddParticipantsLabel: 'Add Collaborators',
  storyAddParticipantsLabel: 'Change Assigned',
  dialogEditExpiresLabel: 'Add Time',
  dialogExpiresLabel: 'Once the Dialog expires it is frozen for changes and cannot be re-activated.',
  searchParticipantsLabel: 'Select existing Uclusion collaborators to send to:',
  noCollaboratorsLabel: 'There are no existing collaborators to choose from. Invite some below.',
  searchParticipantsPlaceholder: 'Use commas to separate multiple email addresses',
  inviteParticipantsEmailLabel: 'Email addresses to send Uclusion invitations to:',

  // DecisionIvestibleSave
  decisionInvestibleSaveAddAnother: 'Save & add another',

  // DecisionInvestible
  decisionInvestibleYourVoting: 'Your Vote',
  decisionInvestibleOthersVoting: 'Current Votes',
  decisionInvestibleDescription: 'Option - Description',
  decisionInvestibleDiscussion: 'Discussion',
  decisionInvestibleVotingBlockedMarket: 'Voting is blocked because there is an open issue on the decision',
  decisionInvestibleVotingBlockedInvestible: 'Voting is blocked because there is an open issue',
  decisionInvestibleProposedHelp: 'You can move this option to be voted on by using the up arrow on the sidebar.',

  // InitiativeInvestible
  initiativeInvestibleVotingBlocked: 'Voting is blocked because there is an open issue',
  initiativeInvestibleYourVoting: 'Your Vote',
  initiativeInvestibleOthersVoting: 'Candidates',
  initiativeInvestibleDescription: 'Initiative - Description',
  investibleDescription: 'Story - Description',
  dialogDescription: 'Dialog - Description',
  dialogAddress: 'Dialog - Add collaborators',
  planAddress: 'Workspace - Add collaborators',
  initiativeAddress: 'Initiative - Add collaborators',
  dialogExtend: 'Dialog - Delay expiration',
  initiativeExtend: 'Initiative - Delay expiration',
  initiativeInvestibleDiscussion: 'Discussion',
  initiativeVotingFor: 'Votes For',
  initiativeVotingAgainst: 'Votes Against',
  initiativeAddHelp: 'Create an initiative to quickly gather opinions on your next potential project.',

  // About
  sidebarNavAbout: 'About',
  aboutApplicationVersionLabel: 'Version',
  aboutMarketIdLabel: 'Dialog ID',
  aboutAccountIdLabel: 'Account ID',
  aboutAccountNameLabel: 'Account Name',
  aboutUserIdLabel: 'User ID',
  aboutUserNameLabel: 'User Name',
  aboutUclusionEmailLabel: 'Support',
  aboutClearStorageButton: 'Clear Storage',

  // Quill Editor
  quillEditorUploadInProgress: 'Uploading image(s)',

  //Planning Manage Users
  manageParticipantsCurrentTitle: 'Current Participants',
  manageParticipantsAddTitle: 'New Participants',
  manageParticipantsMakeObserver: 'Make Approver',
  manageParticipantsMakeParticipant: 'Make Collaborator',
  manageParticipantsHasAsignments: 'Has stories',
  manageParticipantsObserver: 'Approver',
  manageParticipantsParticipant: 'collaborator',

  // decision sidebar
  addOptionLabel: 'Add Option',

  // diff displaydeci
  diffDisplayDismissLabel: 'Hide Changes',
  diffDisplayShowLabel: 'Show Changes',

  // expiration extender
  deadlineExtenderSave: 'Modify',
  deadlineExtenderCancel: 'Close',
  allowMultiVote: 'Can Dialog participants vote for more than one option?',

  // invite linker
  inviteLinkerDirectionsDecision: 'Share this link to invite others to the dialog',
  inviteLinkerDirectionsPlan: 'Share this link to invite others to the workspace',
  inviteLinkerDirectionsInitiative: 'Share this link to invite others to the initiative',
  inviteLinkerCopyToClipboard: 'Copy to clipboard',
  participationHelp: 'Select someone in the list and Add is immediate. Otherwise share the link or have Uclusion send email for you.',
  slackIntegrationSuccessful: 'Slack was successfully integrated.',
  slackIntegrationPartial: 'Almost there! Now type /uclusion in any Slack channel to complete installation.',

  // Assignment List
  assignmentListHeader: 'Assigned to',
  // Address List
  addressListHeader: 'Addressed to',
  addressListMakeObserver: 'Make Yourself an Observer',
  addressListMakeParticipant: 'Make Yourself a Participant',

  // Dialog Archives
  dialogArchivesNotDoingHeader: 'Not Doing',
  dialogArchivesVerifiedHeader: 'Verified',
  dialogArchivesLabel: 'Workspace Archive',
  readyFurtherWorkHeader: 'Ready for Further Work',

  // SignIn
  signInEmailLabel: 'Email',
  signInPasswordLabel: 'Password',
  signInNoAccount: 'Don\'t have an account? Sign up',
  signInForgotPassword: 'Forgot Password?',
  signInSignIn: 'Sign In',


  // Signup
  signupNameLabel: 'Name',
  signupEmailLabel: 'Email',
  signupPasswordLabel: 'Password',
  signupPasswordHelper: '6 Characters Minimum',
  signupPasswordRepeatLabel: 'Repeat Password',
  signupPasswordRepeatHelper: 'Must match Password',
  signupSignupLabel: 'Create Account',
  signupTitle: 'Sign Up',
  signupHaveAccount: 'Already have an account? Sign in',
  signupAccountExists: 'An account with that email already exists, please log in.',
  signupAccountExistsLoginLink: 'Log In',
  signupSentEmail: 'We have sent a verification email to you. Please click the link inside to continue.',
  signupCreatedUser: 'Your user is created, and a verification link has been sent to your email. Please click the link inside to continue.',
  signupResendCodeButton: 'Resend Link',
  signupAgreeTermsOfUse: 'I agree to the Uclusion ',
  signupTermsOfUse: 'Beta Program Terms of Use',

  // Forgot Password
  forgotPasswordHeader: 'Reset your password',
  forgotPasswordEmailLabel: 'Enter your email address',
  forgotPasswordCodeLabel: 'Reset Code',
  forgotPasswordNewPasswordLabel: 'New Password',
  forgotPasswordRepeatLabel: 'Repeat New Password',
  forgotPasswordSendCodeButton: 'Send Reset Code',
  forgotPasswordResetPasswordButton: 'Submit',
  forgotPasswordResendCode: 'Resend Reset Code',
  forgotPasswordEmailNotFound: 'That email address was not found',
  forgotPasswordInvalidCode: 'An invalid code was entered',
  forgotPasswordHelper: '6 Characters Minimum',
  forgotPasswordRepeatHelper: 'Must match Password',

  // Change Password
  errorChangePasswordFailed: 'Change password failed. Please try again.',
  changePasswordHeader: 'Change your password',
  changePasswordNewLabel: 'New password',
  changePasswordRepeatLabel: 'Repeat new password',
  changePasswordOldLabel: 'Old password',
  changePasswordButton: 'Change Password',

  // Sign out
  signOutButton: 'Sign Out',
  errorSignOutFailed: 'Sign out failed. Please try again.',

  // Change Preferences
  changePreferencesHeader: 'Change your notification preferences',
  emailEnabledLabel: 'Send daily digest of notifications via email',
  slackEnabledLabel: 'Send notifications via Slack',
  changePreferencesButton: 'Update Preferences',
  slackDelayInputLabel: 'Minimum delay between notifications in Slack in minutes',
  emailDelayInputLabel: 'Minimum delay between emails of notifications in minutes',

  // your voting
  yourVotingVoteForThisPlanning: 'Vote for this story',
  yourVotingVoteForThisDecision: 'Vote for this option',
  yourVotingVoteForThisInitiative: 'Vote for this',
  voteFor: 'Vote For',
  voteAgainst: 'Vote Against',
  clearVotes: 'Your other vote will be cleared',
  addAVote: 'Add a vote for your favorite option',
  addMultiVote: 'Add a vote for all options you like',
  pleaseVote: 'Please vote',
  pleaseVoteStory: 'Vote certainty on this assignment and effort',
  changeVote: 'Change vote',
  decisionInvestibleVotingSingleHelp: 'Help decide by voting for the best option or adding your own option.',
  decisionInvestibleVotingMultiHelp: 'Help decide by voting for options you like and adding any that are missing.',
  initiativeVotingHelp: 'Vote for or against this initiative and choose how certain you are of that vote.',

  // add participants
  addParticipantsNewPerson: 'Need to add someone not on this list?',

  // Spinning
  spinVersionCheckError: 'There was an error. Please retry your operation.',

  //upgradeMenu
  billingMenuItem: 'Manage Subscription',


  // upgrade form
  upgradeFormCardName: 'Cardholder Name',
  upgradeFormCardPhone: 'Cardholder Phone Number',
  upgradeFormCardEmail: 'Cardholder Email',
  upgradeFormUpgradeLabel: 'Update Card',
  upgradeFormRestartLabel: 'Restart Subscription',


  // API errors
  errorDecisionInvestibleAddFailed: 'There was a problem adding the option.',
  errorInvestibleAddFailed: 'There was a problem adding.',
  errorInvestibleDeleteFailed: 'There was a problem deleting.',
  errorPlanningInvestibleAddFailed: 'There was a problem adding the story',
  errorInvestibleStageChangeFailed: 'There was a problem accepting or archiving the story',
  errorInvestibleUpdateFailed: 'There was a problem updating the option.',
  errorCommentFetchFailed: 'There was a problem retrieving comments',
  errorCommentSaveFailed: 'There was a problem saving your comment',
  errorInvestmentUpdateFailed: 'There was a problem updating your vote',
  errorAddParticipantsFailed: 'There was a problem adding participants',
  errorInviteParticipantsFailed: 'There was a problem inviting participants',
  errorDecisionAddFailed: 'There was a problem creating your Dialog',
  errorInitiativeAddFailed: 'There was a problem creating your Initiative',
  errorPlanningAddFailed: 'There was a problem creating your Workspace',
  errorFileUploadFailed: 'There was a problem uploading your file',
  errorEditLockFailed: 'There was a problem getting permission to edit',
  errorEditLockReleaseFailed: 'There was a problem releasing edit permission',
  errorSubmitToModeratorFailed: 'There was a problem submitting to the moderator',
  errorChangeToObserverFailed: 'There was a problem changing to approver',
  errorChangeToParticipantFailed: 'There was a problem changing to collaborator',
  errorMarketUpdateFailed: 'There was a problem editing the dialog',
  errorMarketExpirationExtendFailed: 'There was a problem extending the deadline',
  errorMarketShowFailed: 'There was a problem restoring the dialog',
  errorMarketHideFailed: 'There was a problem dismissing the dialog',
  errorCommentResolveFailed: 'There was a problem resolving',
  errorCommentReopenFailed: 'There was a problem reopening',
  errorMarketArchiveFailed: 'There was a problem deactivating the dialog',
  errorInvestibleMoveToCurrentVotingFailed: 'There was a problem moving the option to Candidates. Please try again.',
  errorInvestibleMoveToOptionPoolFailed: 'There was a problem moving the option back to the Option Pool. Please try again.',
  errorInvestibleFetchFailed: 'There was a problem receiving the data',
  errorInvestibleListFetchFailed: 'There was a problem fetching the data list',
  errorSignupFailed: 'There was a problem signing up. Please try again',
  errorResendFailed: 'There was a problem resending the link. Please try again',
  errorVerifyFailed: 'There was a problem verifying your email. Please try again',
  errorForgotPasswordCodeFailed: 'There was a problem sending your reset code. Please try again',
  errorForgotPasswordSetFailed: 'There was an error changing your password. Please try again',
  errorClearFailed: 'There was a problem clearing your data. Please try again',
  errorGetIdFailed: 'There was a problem displaying your identification.',
  errorUpdateUserFailed: 'There was a problem updating your profile. Please try again.',
  errorMarketFetchFailed: 'There was an error processing your invite. Please try again.',
  warningAlreadyInMarket: 'You are already a part of this market.',

  // home cheat sheet
  homeCheatWelcome: 'Welcome to Uclusion!',
  homeStartTour: 'Start Tour',
  //summary
  summaryExpiredAt: 'Expired on {expireDate}',

  //assigneeFilterDropdown
  assigneeFilterDropdownAll: 'Everyone',
  assigneeFilterLabel: 'Show stories for:',

  // warnings
  warningOffline: 'You are offline',
  optionalEdit: 'These fields are optional and can be changed at any time',

  // Issue Present
  issuePresent: 'Issue',
  questionPresent: 'Question',
  suggestPresent: 'Suggestion',

  // Search
  searchBoxPlaceholder: 'Search',
  commentSearchResultIssue: 'Issue in {name}',
  commentSearchResultJustify: 'Vote reason in {name}',
  commentSearchResultSuggestion: 'Suggestion in {name}',
  commentSearchResultQuestion: 'Question in {name}',
});

export default messages;
