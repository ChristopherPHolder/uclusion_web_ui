import { createMyInitiative } from '../../components/AddNew/Initiative/initiativeCreator';
import { createMyDialog } from '../../components/AddNew/Dialog/dialogCreator';
import { doCreateRequirementsWorkspace } from '../../components/AddNew/Workspace/RequirementsWorkspace/workspaceCreator';
import { getRandomSupportUser } from '../../utils/userFunctions'
import { addParticipants } from '../../api/users'

export function createECPMarkets (dispatchers) {
  let initiativeId = null;
  return createInitiative(dispatchers)
    .then((createdId) => {
      initiativeId = createdId;
      return createDialog(dispatchers);
    }).then(() => createTeamWorkspace(dispatchers))
    .then(() => createProjectWorkspace(dispatchers))
    .then(() => initiativeId);
}

function createInitiative (dispatchers) {
  const initiativeExpiration = 1440 * 14;
  const initiativeName = 'Checkout Uclusion Initiatives';
  const initiativeDescription = '<p>' +
    '    Uclusion Initiatives are a great way to measure support for an idea, and are a good introduction to' +
    ' <a href="https://www.uclusion.com/autonomousteamwork">autonomous teamwork</a>.' +
    '</p>' +
    '<p></p>' +
    '<p>' +
    '    Initiatives don\'t require you to make big process changes, and have several features to make sure you get timely' +
    '    constructive feedback:' +
    '</p>' +
    '<p></p>' +
    '<p>' +
    '    Initiatives have a deadline, and collaborators will be notified to respond as it approaches.<br>' +
    '    <img src="https://www.uclusion.com/static/media/onboarding/expiry.png" height="160"/>' +
    '</p>' +
    '<p/>' +
    '<p>' +
    '    Communication is <em>structured</em> so you always know what a collaborator is trying to say.' +
    '    <img src="https://www.uclusion.com/static/media/onboarding/suggestion.png"/>' +
    '</p>' +
    '<p></p>' +
    '<p>' +
    'Your collaborators can vote for or against the idea, express how certain they are, and give reasons for their vote.<br/>' +
    '<img src="https://www.uclusion.com/static/media/onboarding/initiative_vote.png"/>' +
    '</p>' +
    '<p/>' +
    '<p>' +
    '    We present a simple tally on your home page, so you can see how it\'s going at a glance.<br/>' +
    '    <img src="https://www.uclusion.com/static/media/onboarding/initiative_outcome.png"/>' +
    '</p>' +
    '<p></p>' +
    '<p></p>' +
    '<p>' +
    '    In short, we eliminate the incessant back and forth on emails, and the uncertainty of whether people really agree with you or not.' +
    '</p>' +
    '<p></p>' +
    '<p>' +
    '    <b>With Uclusion, you know exactly where your idea stands at all times.</b>' +
    '</p>';
  return createMyInitiative(dispatchers, { initiativeName, initiativeDescription, initiativeExpiration },
    () => {});
}

function createDialog (dispatchers) {
  const dialogExpiration = 1440 * 14;
  const dialogName = 'How should I make decisions with my team?';
  const dialogReason = '<p>This is a free Dialog with a staff member of Uclusion so you can get experience with Dialogs and we can learn more about you.</p><p/>\n' +
    '<p>Please include other collaborators in this Dialog if you want.</p>';
  const dialogOptions = [{ optionName: 'Your current tools', optionDescription: '<p>Approve this option to continue making team decisions with current tool set.</p>' },
    { optionName: 'Use Uclusion', optionDescription: '<p>Once everyone is using Uclusion Dialogs, you have a good chance of avoiding meetings entirely,' +
        ' but if not the options and opinions are known so the meeting will be short.</p><p/>' +
        '<p>They also serve as ‘Architecture Decision Records’ when you add a link to the Dialog in your code or commit messages.</p>', optionDoNotPromote: true }];
  const supportUser = getRandomSupportUser();
  return createMyDialog(dispatchers,
    { dialogName, dialogReason, dialogOptions, dialogExpiration },
    () => {}).then((marketId) => {
    return addParticipants(marketId, [{
      user_id: supportUser.user_id,
      account_id: supportUser.account_id,
      is_observer: false,
    }]);
  });
}

function createTeamWorkspace (dispatchers) {
  const workspaceName = 'Your Team Workspace';
  const workspaceDescription = '<p>We created this workspace for your team so you can organize team wide documentation, store onboarding materials, and drive important discussions about team wide topics</p>' +
    '<p>To get started, invite everyone on your team, and have them edit this description as they see fit.</p>';

  return doCreateRequirementsWorkspace(dispatchers, { workspaceName, workspaceDescription });
}

function createProjectWorkspace (dispatchers) {
  const workspaceName = 'Your Small Project Workspace';
  const workspaceDescription = '<p>We created this workspace to help your team to run a small project from start to finish inside Uclusion.</p>' +
  'List all the requirements just like you would do for a wiki, but this time use the comments' +
  ' section to drive discussion.</p>' +
  '<p>You’ll get incremental updates of changes, but won’t be tied to' +
  ' meetings in order to create good requirements and you’ll have Dialogs linked to the Workspace to' +
  ' help make and record any decisions.</p>' +
  '<p>When ready to start work, create stories in the Workspace.</p>' +
  '<p>Each story gets its own discussion section, and the status of that story takes discussion into' +
  ' account, so you won’t need your normal standup meetings.</p>';
  return doCreateRequirementsWorkspace(dispatchers, { workspaceName, workspaceDescription });
}