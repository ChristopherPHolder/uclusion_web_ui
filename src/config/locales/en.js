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
  warningQuestion: 'Important Choice',
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
  manage: 'Manage Collaborators',
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
  selectDate: 'Click to select a date',
  advanced: 'Advanced',

  // Support
  supportInfoText: 'Create bugs (but not feature requests) in <a>Uclusion issues</a> or send an email to <b>support</b> which includes the version and user ID above.',
  featureRequest: 'Feature Request',
  onboardingWorkspace: 'Support help for {x}',
  createFeatureRequest: 'Create feature request',
  createOnboardingWorkspace: 'Get support help',
  // Loadable Image
  loadableImageAlt: 'User provided image',

  archiveInlineTitle: 'Dialog',

  loadingMessage: 'Page Loading',
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
  maxMaxBudgetInputLabel: 'maximum number of days for story budget',
  daysEstimateInputLabel: 'Very rough number of days to complete',
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
  agilePlanFormInvestmentExpirationLabel: 'vote expiration (in days)',
  agilePlanFormMaxMaxBudgetInputLabel: 'An upper bound on the value of this story to avoid a blank check vote',
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
  maxBudgetValue: '{name}: {x} days',
  certaintyQuestion: 'Rate Your Certainty',
  reasonQuestion: 'Why did you vote for this option?',
  saveVote: 'Cast Vote',
  updateVote: 'Update Vote',
  yourReason: 'Your reason...',
  cancelVote: 'Cancel',
  removeVote: 'Remove Vote',
  maxBudgetInputLabel: 'worth in days',
  maxBudgetInputHelperText: 'must be less than {x}',
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
  investibleAddToVotingLabel: 'Move to Options',
  investibleBackToOptionPoolLabel: 'Back to Proposed Options',
  investibleAddToVotingExplanation: 'Once in voting you will still be able to remove this option',
  investibleRemoveFromVotingExplanation: 'Remove current votes and move back to Proposed Option',
  investibleDeleteLabel: 'Permanently Delete',
  investibleDeleteExplanationLabel: 'Permanently remove this option from the dialog',
  planningInvestibleToVotingLabel: 'Proposed',
  planningInvestibleNextStageAcceptedLabel: 'In Progress',
  planningInvestibleNextStageInReviewLabel: 'Review',
  planningInvestibleMoveToVerifiedLabel: 'Verified',
  planningInvestibleMoveToFurtherWorkLabel: 'Ready for Further Work',
  planningInvestibleMoveToNotDoingLabel: 'Not Doing',
  planningInvestibleAcceptedExplanation: 'Move to in progress when you have enough votes and are ready to start',
  planningInvestibleInReviewExplanation: 'Move to review when a story is done but you want feedback',
  planningInvestibleNotDoingExplanation: 'Move to not doing will unassign and archive the story',
  planningInvestibleVerifiedExplanation: 'Move to verified when you no longer anticipate further work on the story',
  planningInvestibleFurtherWorkExplanation: 'Move to this stage when a handoff to another assignee is expected for this story',
  planningInvestibleVotingExplanation: 'Move to voting allows certainty and estimates to be re-collected',
  planningVotingStageLabel: 'Proposed',
  planningAcceptedStageLabel: 'In Progress',
  planningBlockedStageLabel: 'Blocked',
  planningReviewStageLabel: 'Review',
  planningVerifiedStageLabel: 'Verified',
  planningFurtherWorkStageLabel: 'Ready for Further Work',
  planningNotDoingStageLabel: 'Not Doing',
  planningInvestibleAssignments: 'assigned',
  planningInvestibleDecision: 'Add Dialog',
  planningInvestibleCantVote: 'You can\'t vote if you\'re assigned',
  planningEstimatedCompletion: 'Estimated completion',
  planningInvestibleDescription: '- Description',
  daysEstimateHelp: 'Optional very rough expected date of completion.',
  daysEstimateMarketLabel: 'date of completion',
  votesRequiredHelp: 'Votes required before a story can be moved in progress',
  maxBudgetHelp: 'Maximum days effort value allowed for a story. Used to prevent stories from being too large.',
  voteExpirationHelp: 'How many days before votes expire. Prevents very old voting from being used to move a story in progress.',
  reassignToMove: 'Re-assigning will move into voting.',
  initiativePlanningParent: 'Create Child Workspace',
  marketLinksSection: 'links',
  parentLinkSection: 'parent',
  marketParticipationLink: 'Participate in - {x}',
  homeChildLinkName: 'Child of {x}',
  homeUpdated: 'Updated {x}',
  homeArchived: 'Deactivated {x}',
  homeInitiativeLabel: 'Initiative by {x} on {y}',
  homeDialogLabel: 'Dialog by {x} on {y}',
  inlineMarketName: 'Decision {x}',
  marketObservationLink: 'Observe - {x}',
  lockedBy: 'Locked by {x}',
  lockFailedWarning: 'Failed to acquire lock. Retry?',
  breakLock: 'Break Lock',
  newStory: 'New Story',
  newOption: 'New Option',
  noVoters: 'No Voters',
  storyHelp: 'Need something assigned and voted on now that takes a day or longer? Use the Create Story button.',
  reassignWarning: 'Re-assigning will remove all votes.',
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
  commentAddTODODefault: 'Your TODO...',
  commentAddQuestionDefault: 'Your question...',
  commentAddSuggestDefault: 'Your suggestion...',
  commentAddReplyDefault: 'Your reply...',
  commentAddReportDefault: 'Your progress report...',
  commentAddSaveLabel: 'Save',
  commentAddCancelLabel: 'Clear',
  commentAddSelectIssueLabel: 'Please select a type',
  issueWarning: 'Opening an issue will halt voting on this dialog.',
  issueWarningInvestible: 'Opening an issue will halt voting on this option.',
  issueWarningPlanning: 'Opening an issue will move this story to blocked and stop execution or voting.',
  todoWarningPlanning: 'Opening a TODO prevents this story from changing stages until resolved.',
  todoWarningDone: 'Opening a TODO moves this story to proposed.',

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
  commentRemoveLabel: 'Delete',
  commentViewThreadLabel: 'View Thread',
  commentCloseThreadLabel: 'Close Thread',
  lastUpdatedBy: 'Last Updated By',

  // card types
  cardTypeLabelIssue: 'blocking issue',
  cardTypeLabelQuestion: 'question',
  cardTypeLabelSuggestedChange: 'suggestion',
  cardTypeLabelTodo: 'todo',
  cardTypeLabelProgressReport: 'progress report',
  cardTypeAgilePlan: 'workspace - description',

  // Notices
  noticeNewApplicationVersion: 'A new version of the application is available! It will load when you close this message.',
  noticeVersionForceLogout: 'This version of the application requires signout which will happen when you close this message.',

  // stages
  marketStageFollowTooltip: 'Subscribe',
  marketStageUnFollowTooltip: 'Unsubscribe',
  changeStage: 'Change stage',

  // markets
  signupInvite: '{x} invites you to collaborate on {y}',

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
  archiveWarning: 'Archiving will unassign any active story and prevent further assignment.',
  deactivateWarning: 'Archiving will permanently deactivate this workspace and stop further work',
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
  decisionDialogsBecomeObserver: 'Archive',
  decisionDialogsBecomeParticipant: 'Activate notifications and move from archive',
  decisionDialogsInviteParticipant: 'Invite Participant',
  decisionDialogsArchiveDialog: 'Deactivate',

  // Planning Dialog
  planningDialogManageParticipantsLabel: 'Manage Collaborators',
  planningDialogSummaryLabel: 'Workspace Detail',
  planningDialogPeopleLabel: 'collaborator\'s stories',
  planningDialogDiscussionLabel: 'Discussion',
  planningDialogAddInvestibleLabel: 'Create Story',
  planningDialogAddInvestibleExplanation: 'Create a story and collaborate on what to do',
  planningDialogManageParticipantsExplanation: 'Add collaborators to this workspace',
  planningDialogViewArchivesExplanation: 'See stories in Verified and Not Doing',
  planningDialogViewArchivesLabel: 'View Archive',
  planningNoneAcceptedWarning: 'No in progress story',
  planningNoneInDialogWarning: 'No proposed story',
  planningNoneInReviewWarning: 'No in review story',
  planningNoneInBlockingWarning: 'No blockers',
  acceptedInvestiblesUpdatedAt: 'In progress from ',
  reviewingInvestiblesUpdatedAt: 'In review from ',
  inDialogInvestiblesUpdatedAt: 'Assigned for voting on ',
  blockedInvestiblesUpdatedAt: 'Blocked since ',
  planningAddHelp: 'A workspace is your place for all stories, questions, issues, requirements and decisions about a project or topic.',
  planningInvestibleAddHelp: 'Stories allow collaboration on what should be done, by whom, how and status at a glance without a meeting.',
  planningInvestibleEnoughVotesHelp: 'This story has enough votes so consider using the up arrow to move \'In Progress\'',
  planningInvestibleAcceptedFullHelp: 'You can only have one story at a time \'In Progress\' so the up arrow is not visible yet.',
  planningEditHelp: 'Workspace descriptions communicate requirements well with notifications and a difference display of the change.',
  planningInvestibleAcceptedHelp: 'For help brainstorming how to do this story use Add Option to create a child dialog.',
  planningInvestibleVotingHelp: 'Vote how certain you are this story should be done or open an issue.',
  inlineAddLabel: 'Add Option',
  inlineAddExplanation: 'Add a how to do this story option and collect votes on it.',
  deactivateInlineQuestion: 'Deactivate the dialog associated with this story?',
  deactivateDialogQuestion: 'Do you want to deactivate and stop any further work?',
  yesAndProceed: 'Change stage and deactivate',
  noAndProceed: 'Change stage only',
  // Decision Dialog
  decisionDialogSummaryLabel: 'Background Information',
  decisionDialogCurrentVotingLabel: 'Options',
  storyCurrentVotingLabel: 'Options for doing this story',
  decisionDialogProposedOptionsLabel: 'Proposed Options',
  decisionDialogDiscussionLabel: 'Discussion',
  decisionDialogAddInvestibleLabel: 'Add Option',
  decisionDialogAddExplanationLabel: 'Add a new option directly into voting',
  decisionDialogProposeInvestibleLabel: 'Propose Option',
  decisionDialogProposeExplanationLabel: 'Propose an option for consideration of being added to voting',
  decisionDialogExtendDaysLabel: 'Number of days to extend deadline?',
  decisionDialogNoInvestiblesWarning: 'No votable options',
  childDialogExplanation: 'Click to create and link in an additional dialog.',
  childPlanExplanation: 'Click to create and link in a child workspace relevant to this initiative.',
  decisionAddHelp: 'A Dialog gives you a timed box way to decide with others between options that you control.',
  backToOptionPoolWarning: 'Moving this option back to Proposed Options deletes all votes.',
  yesAndProceedDeactive: 'Archive and deactivate',
  noAndProceedDeactivate: 'Archive only',
  // Investibles in decision dialog display
  decisionDialogInvestiblesUpdatedAt: 'Last Updated:',
  dialogAddParticipantsLabel: 'Manage Collaborators',
  dialogRemoveParticipantsLabel: 'Remove Collaborators',
  storyAddParticipantsLabel: 'Change Assigned',
  dialogEditExpiresLabel: 'Add Time',
  dialogExpiresLabel: 'Once the Dialog expires it is frozen for changes and cannot be re-activated.',
  searchParticipantsLabel: 'Search in Uclusion',
  noCollaboratorsLabel: 'There are no existing collaborators to choose from. Invite some below.',
  searchParticipantsPlaceholder: 'Use commas to separate multiple email addresses',
  inviteParticipantsEmailLabel: 'Add by email addresses',
  collaboratorNotFollowing: 'This user has archived and will not receive notifications.',

  // DecisionIvestibleSave
  decisionInvestibleSaveAddAnother: 'Save & add another',

  // DecisionInvestible
  decisionInvestibleYourVoting: 'Your Vote',
  decisionInvestibleOthersVoting: 'Current Votes',
  decisionInvestibleDescription: 'Option - Description',
  decisionInvestibleDiscussion: 'Discussion',
  decisionInvestibleVotingBlockedMarket: 'Voting suspended until the open issue on this dialog is resolved',
  decisionInvestibleVotingBlockedInvestible: 'Voting suspended until the open issue on this option is resolved',
  decisionInvestibleProposedHelp: 'You can move this option to be voted on by using the up arrow.',

  // InitiativeInvestible
  initiativeInvestibleVotingBlocked: 'Voting is blocked because there is an open issue',
  initiativeInvestibleYourVoting: 'Your Vote',
  initiativeInvestibleOthersVoting: 'Options',
  initiativeInvestibleDescription: 'Initiative - Description',
  investibleDescription: 'Story - Description',
  dialogDescription: 'Dialog - Description',
  dialogAddress: 'Add collaborators',
  planAddress: 'Add collaborators',
  planRemoveAddress: 'Remove collaborators',
  initiativeAddress: 'Add collaborators',
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

  // decision sidebar
  addOptionLabel: 'Add Option',

  // diff displaydeci
  diffDisplayDismissLabel: 'Hide Changes',
  diffDisplayShowLabel: 'Show Recent Changes',

  // expiration extender
  deadlineExtenderSave: 'Modify',
  deadlineExtenderCancel: 'Close',
  allowMultiVote: 'Can collaborator\'s vote for more than one option?',

  // invite linker
  inviteLinkerDirectionsDecision: 'Share this link',
  inviteLinkerDirectionsPlan: 'Share this link',
  inviteLinkerDirectionsInitiative: 'Share this link',
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
  signInGithubSignIn: 'Sign In with GitHub',
  signInGoogleSignIn: 'Sign In with Google',


  // Signup
  signupNameLabel: 'Name',
  signupEmailLabel: 'Email',
  signupPasswordLabel: 'Password',
  signupPhoneLabel: 'Phone Number',
  signupPasswordHelper: '6 Characters Minimum',
  signupPasswordRepeatLabel: 'Repeat Password',
  signupPasswordRepeatHelper: 'Must match Password',
  signupSignupLabel: 'Create Account',
  signupTitle: 'Try for Free',
  signupHaveAccount: 'Already have an account? Sign in',
  signupAccountExists: 'An account with that email already exists, please log in.',
  signupAccountExistsLoginLink: 'Log In',
  signupSentEmail: 'We have sent a verification email to you. Please click the link inside to continue.',
  signupCreatedUser: 'Your user is created, and a verification link has been sent to your email. Please click the link inside to continue.',
  signupResendCodeButton: 'Resend Link',
  signupAgreeTermsOfUse: 'I agree to the Uclusion ',
  signupTermsOfUse: 'Beta Program Terms of Use',
  signupGithubSignup: 'Sign Up with GitHub',
  signupGoogleSignup: 'Sign Up with Google',

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
  addParticipantsNewPerson: 'Not on Uclusion? Send Invite',

  // Spinning
  spinVersionCheckError: 'There was an error. Please retry your operation.',

  //upgradeMenu
  billingMenuItem: 'Manage Subscription',
  billingFreeTier: 'You are currently on the Free plan.',
  billingStandardTier: 'You are currently on the Standard plan.',
  billingUnknownTier: 'You are on a custom plan.',
  billingSubCanceled: 'Your subscription is cancelled.',
  billingSubUnsubscribed: 'You have no subscription.',
  billingSubTrial: 'You are in a free trial.',
  billingSubActive: 'Your subscription is active.',
  billingSubUnknown: 'You have a custom subscription.',
  billingSubEnd: 'Subscription End:',
  billingSubBegin: 'Begin Subscription',
  billingSubCancel: 'Cancel Subscription',
  billingMustPay: 'Create not available because trial period is over. Please go to manage subscription.',
  billingStartSubscription: 'Please go to manage subscription and start a free trial to enable create.',

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
  errorCommentDeleteFailed: 'There was a problem removing',
  errorCommentReopenFailed: 'There was a problem reopening',
  errorMarketArchiveFailed: 'There was a problem deactivating the dialog',
  errorInvestibleMoveToCurrentVotingFailed: 'There was a problem moving the option to Options. Please try again.',
  errorInvestibleMoveToOptionPoolFailed: 'There was a problem moving the option back to Proposed Options. Please try again.',
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
  errorBanUserFailed: 'There was a problem removing the collaborator. Please try again.',
  errorCancelSubFailed: 'There was a problem cancelling your subscription. Please try again.',
  errorStartSubFailed: 'There was a problem starting your subscription. Please try again.',
  errorRestartSubFailed: 'There was a problem restarting your subscription. Please try again.',
  errorUnbanUserFailed: 'There was a problem readmitting the collaborator. Please try again.',
  errorUpdatePaymentFailed: 'There was a problem updating your payment card. Please try again.',
  warningAlreadyInMarket: 'You are already a part of this market.',

  homeNoMarkets: "You don't have anything here, so you'll have to create a new Workspace, Dialog or Initiative to get going again.",
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
  issuePresent: 'Blocking Issue',
  questionPresent: 'Question',
  suggestPresent: 'Suggestion',
  reportPresent: 'Progress Report',
  todoPresent: 'TODO',
  issueTip: 'Use to halt an option or story until resolved.',
  questionTip: 'Question',
  suggestTip: 'Suggestion',
  reportTip: 'After estimated completion date use to report daily status.',
  todoTip: 'Use to insure this item is done in this story.',

  // Search
  searchBoxPlaceholder: 'Search',
  commentSearchResultIssue: 'Issue in {name}',
  commentSearchResultJustify: 'Vote reason in {name}',
  commentSearchResultSuggestion: 'Suggestion in {name}',
  commentSearchResultTodo: 'TODO in {name}',
  commentSearchResultQuestion: 'Question in {name}',
  commentSearchResultReport: 'Report in {name}',

  // existing users
  existingUsersBanUser: 'Remove collaborator',
  existingUsersUnBanUser: 'Readmit collaborator',
  banUserWarning: 'Removing a collaborator will prevent them from seeing any future updates',
  unbanUserWarning: 'Readmitting a collaborator will allow them to see any future updates',

  // Notifications
  notificationMulitpleUpdates: '{n} Updates',

  // phone field
  phoneFieldErrorText: 'Phone should begin with plus or just be the digits',

  // Onboarding
  OnboardingWizardTitle: 'Welcome to Uclusion',
  OnboardingWizardSkipOnboarding: 'I\'ve used Uclusion before and want to go right to the app',
  OnboardingWizardStartOver: 'Start over',
  OnboardingWizardTrySomethingElse: 'I\'ve shared the link and want to try something else',
  OnboardingWizardGoBack: 'Go Back',
  OnboardingWizardContinue: 'Continue',
  OnboardingWizardFinish: 'Finish',
  OnboardingWizardSkip: 'Skip',
  OnboardingWizardCurrentStoryStepLabel: 'Current Story',
  OnboardingWizardCurrentStoryProgressStepLabel: 'Current Story Progress (Optional)',
  OnboardingWizardNextStoryStepLabel: 'Next Story(Optional)',
  OnboardingWizardCurrentStoryNamePlaceHolder: 'Your current story\'s name',
  OnboardingWizardCurrentStoryDescriptionPlaceHolder: 'Your current story\'s description',
  OnboardingWizardNextStoryNamePlaceHolder: 'Your next story\'s name',
  OnboardingWizardNextStoryDescriptionPlaceHolder: 'Your next story\'s description',
  OnboardingWizardCurrentStoryProgressPlaceHolder: 'Your progress so far',

  //RequirementsWorkspaceWizard
  ReqWorkspaceWizardTitle: 'Your workspace',
  ReqWorkspaceWizardNamePlaceHolder: 'Your workspace Name',
  ReqWorkspaceWizardNameStepLabel: 'Requirements Workspace',
  ReqWorkspaceWizardRequirementsStepLabel: 'Initial Requirements',
  ReqWorkspaceWizardInitialRequirementsPlaceHolder: 'Your initial requirements',
  ReqWorkspaceWizardTodoStepLabel: 'What\'s still TODO?',
  ReqWorkspaceWizardTodoPlaceholder: 'Things TODO',
  ReqWorkspaceWizardCreatingworkspaceStepLabel: 'Creating Workspace',


  //StoryWorkspaceWizard
  WorkspaceWizardTitle: 'Your Workspace',
  WorkspaceWizardMeetingPlaceHolder: 'Your Workspace Name',
  WorkspaceWizardMeetingStepLabel: 'Workspace Name',
  WorkspaceWizardCreatingWorkspaceStepLabel: 'Workspace Creation',
  WorkspaceWizardWorkspaceDescription: 'Workspace for {meetingName}',
  WorkspaceWizardTakeMeToWorkspace: 'I\'ve shared the link, take me to my Workspace',

  //SignupWizard
  SignupWizardTitle: 'What do you want to do?',
  SignupWizardQuestion: 'What do you want to do?',
  SignupWizardRequirementsWorkspace: 'Determine requirements for a project',
  SignupWizardStoryWorkspace: 'Choose everyone\'s next story and track progress',
  SignupWizardDialog: 'Make a group decision',
  SignupWizardInitiative: 'Measure support for an idea',

  //DialogWizard
  DialogWizardTitle: 'Your Dialog',
  DialogWizardDialogNameStepLabel: 'Your Dialog',
  DialogWizardDialogReasonStepLabel: 'Why does this decision need to be made?',
  DialogWizardReasonPlaceHolder: 'Your reason for making this decision',
  DialogWizardDialogNamePlaceHolder: 'Your dialog\'s name',
  DialogWizardDialogExpirationPlaceHolder: 'Days until Decision Expires',
  DialogWizardDialogExpirationStepLabel: 'How many days until the deadline?',
  DialogWizardAddOptionsStepLabel: 'What are the options?',
  DialogWizardTakeMeToDialog: 'I\'ve shared the link, take me to my Dialog',
  DialogWizardCreatingDialogStepLabel: 'Dialog Creation',

  //AddOptionWizard
  AddOptionWizardTitle: 'Your Option',
  AddOptionWizardOptionNameStepLabel : 'Option Name',
  AddOptionWizardOptionDescriptionStepLabel: 'Option Description',
  AddOptionWizardOptionNamePlaceHolder: 'Your option\'s name',
  AddOptionWizardOptionDescriptionPlaceHolder: 'Your option\'s description',

  //InitiativeWizard
  InitiativeWizardTitle: 'Your Initiative',
  InitiativeWizardInitiativeNameStepLabel: 'Your Initiative',
  InitiativeWizardInitiativeNamePlaceholder: 'Your Initiative\'s Name',
  InitiativeWizardInitiativeDescriptionStepLabel: 'Describe your idea',
  InitiativeWizardInitiativeDescriptionPlaceholder: 'Your idea',
  InitiativeWizardCreatingInitiativeStepLabel: 'Initiative Creation',
  InitiativeWizardInitiativeExpirationStepLabel: 'How long can you wait?',
  InitiativeWizardInitiativeExpirationPlaceHolder: 'Days you can wait',
  InitiativeWizardTakeMeToInitiative: 'I\'ve shared the link, take me to my Initiative',

});

export default messages;
