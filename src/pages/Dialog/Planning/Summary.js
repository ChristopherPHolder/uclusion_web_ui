import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, useIntl } from 'react-intl'
import { Card, CardActions, CardContent, Grid, Typography, useMediaQuery, useTheme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import clsx from 'clsx'
import { MarketPresencesContext } from '../../../contexts/MarketPresencesContext/MarketPresencesContext'
import {
  getMarketPresences,
  marketHasOnlyCurrentUser
} from '../../../contexts/MarketPresencesContext/marketPresencesHelper'
import DialogActions from '../../Home/DialogActions'
import CardType, { AGILE_PLAN_TYPE } from '../../../components/CardType'
import ParentSummary from '../ParentSummary'
import { useMetaDataStyles } from '../../Investible/Planning/PlanningInvestible'
import { useHistory } from 'react-router'
import Collaborators from '../Collaborators'
import AttachedFilesList from '../../../components/Files/AttachedFilesList'
import { attachFilesToMarket, deleteAttachedFilesFromMarket } from '../../../api/markets'
import { addMarketToStorage } from '../../../contexts/MarketsContext/marketsContextHelper'
import { MarketsContext } from '../../../contexts/MarketsContext/MarketsContext'
import { DiffContext } from '../../../contexts/DiffContext/DiffContext'
import { EMPTY_SPIN_RESULT } from '../../../constants/global'
import { doSetEditWhenValid, invalidEditEvent } from '../../../utils/windowUtils'
import DialogBodyEdit from '../DialogBodyEdit'
import _ from 'lodash'
import { pushMessage } from '../../../utils/MessageBusUtils'
import { LOCK_MARKET, LOCK_MARKET_CHANNEL } from '../../../contexts/MarketsContext/marketsContextMessages'
import SpinningIconLabelButton from '../../../components/Buttons/SpinningIconLabelButton'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { findMessageOfTypeAndId } from '../../../utils/messageUtils'
import { getDiff, markDiffViewed } from '../../../contexts/DiffContext/diffContextHelper'
import { NotificationsContext } from '../../../contexts/NotificationsContext/NotificationsContext'
import { ExpandLess, SettingsBackupRestore } from '@material-ui/icons'
import { deleteSingleMessage } from '../../../api/users'
import { removeMessage } from '../../../contexts/NotificationsContext/notificationsContextReducer'
import { OperationInProgressContext } from '../../../contexts/OperationInProgressContext/OperationInProgressContext'
import MenuBookIcon from '@material-ui/icons/MenuBook'
import { formMarketArchivesLink, navigate } from '../../../utils/marketIdPathFunctions'

const useStyles = makeStyles(theme => ({
  section: {
    alignItems: 'flex-start',
    display: 'flex',
    width: '50%'
  },
  collaborators: {
    backgroundColor: theme.palette.grey['300'],
    borderRadius: 6,
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(1, 1),
    "&:first-child": {
      marginLeft: 0
    },
    "& dt": {
      color: "#828282",
      fontSize: 10,
      fontWeight: "bold",
      marginBottom: theme.spacing(0.5)
    },
    "& dd": {
      fontSize: 20,
      margin: 0,
      lineHeight: "26px"
    },
    maxWidth: "60%",
    "& ul": {
      margin: 0,
      padding: 0
    },
    "& li": {
      display: "inline-flex",
      marginLeft: theme.spacing(1),
      "&:first-child": {
        marginLeft: 0
      }
    }
  },
  root: {
    alignItems: "flex-start",
    display: "flex",
    flexWrap: "wrap",
    overflow: "visible",
    justifyContent: "space-between"
  },
  actions: {
    justifyContent: 'flex-end',
    [theme.breakpoints.down("sm")]: {
      justifyContent: 'start'
    },
    '& > button': {
      marginRight: '-8px'
    }
  },
  editContent: {
    flexBasis: "100%",
    padding: theme.spacing(4, 1, 4, 1),
    [theme.breakpoints.down("sm")]: {
      padding: '15px'
    }
  },
  content: {
    flexBasis: "100%",
    padding: theme.spacing(2, 4, 4, 4),
    [theme.breakpoints.down("sm")]: {
      padding: '15px'
    }
  },
  divider: {
    marginBottom: theme.spacing(3)
  },
  fieldset: {
    border: "none",
    display: "inline-block",
    padding: theme.spacing(0),
    "& > *": {
      marginLeft: theme.spacing(3),
      "&:first-child": {
        marginLeft: 0,
      }
    }
  },
  type: {
    display: "inline-flex"
  },
  mobileColumn: {
    [theme.breakpoints.down("sm")]: {
      flexDirection: 'column'
    }
  },
  draft: {
    color: "#E85757"
  },
  borderLeft: {
    paddingRight: '1rem',
    paddingLeft: '1rem',
    [theme.breakpoints.down('sm')]: {
      paddingTop: '1rem',
      marginTop: '1rem',
      borderLeft: 'none',
      borderTop: '1px solid #e0e0e0',
      flexGrow: 'unset',
      maxWidth: 'unset',
      flexBasis: 'auto'
    },
    [theme.breakpoints.down('md')]: {
      paddingRight: 0
    }
  },
  assignments: {
    padding: 0,
    "& ul": {
      flex: 4,
      margin: 0,
      padding: 0,
      flexDirection: 'row',
    },
    "& li": {
      display: "inline-block",
      marginLeft: theme.spacing(1)
    }
  },
  group: {
    backgroundColor: '#ecf0f1',
    borderRadius: 6,
    display: "flex",
    flexDirection: "row",
    padding: theme.spacing(1, 1),
    "&:first-child": {
      marginLeft: 0
    }
  },
  fullWidth: {
    [theme.breakpoints.down("sm")]: {
      maxWidth: '100%',
      flexBasis: '100%'
    }
  },
  fullWidthEditable: {
    cursor: "url('/images/edit_cursor.svg') 0 24, pointer",
    [theme.breakpoints.down("sm")]: {
      maxWidth: '100%',
      flexBasis: '100%'
    }
  },
  assignmentContainer: {
    width: '100%',
    textTransform: 'capitalize'
  },
  fullWidthCentered: {
    alignItems: 'center',
    justifyContent: 'center',
    display: "flex",
    marginTop: '20px',
    [theme.breakpoints.down("sm")]: {
      maxWidth: '100%',
      flexBasis: '100%',
      flexDirection: 'column'
    }
  },
}));

function Summary(props) {
  const { market, investibleId, hidden, activeMarket, inArchives, pageState, updatePageState, pageStateReset } = props
  const history = useHistory()
  const intl = useIntl()
  const classes = useStyles()
  const theme = useTheme()
  const mobileLayout = useMediaQuery(theme.breakpoints.down('md'))
  const {
    id,
    market_stage: marketStage,
    market_type: marketType,
    parent_market_id: parentMarketId,
    parent_investible_id: parentInvestibleId,
    attached_files: attachedFiles,
    locked_by: lockedBy,
    name,
  } = market
  const [, setOperationRunning] = useContext(OperationInProgressContext);
  const [marketPresencesState] = useContext(MarketPresencesContext);
  const [, marketsDispatch] = useContext(MarketsContext);
  const [diffState, diffDispatch] = useContext(DiffContext);
  const [messagesState, messagesDispatch] = useContext(NotificationsContext);
  const myMessage = findMessageOfTypeAndId(id, messagesState);
  const diff = getDiff(diffState, id);
  const {
    beingEdited,
    showDiff
  } = pageState;
  const marketPresences = getMarketPresences(marketPresencesState, id) || []
  let lockedByName;
  if (lockedBy) {
    const lockedByPresence = marketPresences.find(
      presence => presence.id === lockedBy
    );
    if (lockedByPresence) {
      const { name } = lockedByPresence;
      lockedByName = name;
    }
  }
  const isDraft = marketHasOnlyCurrentUser(marketPresencesState, id);
  const myPresence =
    marketPresences.find(presence => presence.current_user) || {};
  const metaClasses = useMetaDataStyles();
  const isAdmin = myPresence.is_admin;

  function isEditableByUser() {
    return isAdmin && !inArchives;
  }

  function onAttachFile(metadatas) {
    return attachFilesToMarket(id, metadatas)
      .then((market) => {
        addMarketToStorage(marketsDispatch, diffDispatch, market, false);
      })
  }

  function onDeleteFile(path) {
    return deleteAttachedFilesFromMarket(id, [path])
      .then((market) => {
        addMarketToStorage(marketsDispatch, diffDispatch, market, false);
        return EMPTY_SPIN_RESULT;
      })
  }

  function mySetBeingEdited(isEdit, event) {
    if (!isEdit || lockedBy === myPresence.id || !_.isEmpty(lockedBy)) {
      // Either don't lock or throw the modal up - both of which InvestibleBodyEdit can handle
      return doSetEditWhenValid(isEdit, isEditableByUser,
        (value) => updatePageState({beingEdited: value, name}), event, history);
    }
    if (!isEditableByUser() || invalidEditEvent(event, history)) {
      return;
    }
    updatePageState({beingEdited: true, name});
    return pushMessage(LOCK_MARKET_CHANNEL, { event: LOCK_MARKET, marketId: id });
  }

  function toggleDiffShow() {
    if (showDiff) {
      markDiffViewed(diffDispatch, id);
    }
    updatePageState({showDiff: !showDiff});
  }

  return (
    <Card className={classes.root} id="summary" elevation={3}>
      <CardType className={classes.type} type={AGILE_PLAN_TYPE} myBeingEdited={beingEdited} />
      <Grid container className={classes.mobileColumn}>
        <Grid item xs={10} className={!beingEdited && isEditableByUser() ? classes.fullWidthEditable : classes.fullWidth}
              onClick={(event) => !beingEdited && mySetBeingEdited(true, event)}>
          <CardContent className={beingEdited ? classes.editContent : classes.content}>
            {lockedBy && myPresence.id !== lockedBy && isAdmin && !inArchives && (
              <Typography>
                {intl.formatMessage({ id: "lockedBy" }, { x: lockedByName })}
              </Typography>
            )}
            {isDraft && activeMarket && (
              <Typography className={classes.draft}>
                {intl.formatMessage({ id: "draft" })}
              </Typography>
            )}
            {!activeMarket && (
              <Typography className={classes.draft}>
                {intl.formatMessage({ id: "inactive" })}
              </Typography>
            )}
            {id && myPresence.id && (
              <DialogBodyEdit hidden={hidden} setBeingEdited={mySetBeingEdited} market={market} marketId={id}
                              pageState={pageState} pageStateUpdate={updatePageState} pageStateReset={pageStateReset}
                              userId={myPresence.id} isEditableByUser={isEditableByUser} beingEdited={beingEdited}/>
            )}
          </CardContent>
        </Grid>
        <Grid className={classes.borderLeft} item xs={2}>
          <CardActions className={classes.actions}>
            <DialogActions
              isAdmin={isAdmin}
              isFollowing={myPresence.following}
              marketPresences={marketPresences}
              marketStage={marketStage}
              marketType={marketType}
              parentMarketId={parentMarketId}
              parentInvestibleId={parentInvestibleId}
              marketId={id}
              initiativeId={investibleId}
              mySetBeingEdited={mySetBeingEdited}
              beingEdited={beingEdited}
            />
          </CardActions>
        <dl className={metaClasses.root}>
          <div className={classes.assignmentContainer}>
            <FormattedMessage id="dialogParticipants" />
              <div className={clsx(classes.group, classes.assignments)}>
              <Collaborators
                marketPresences={marketPresences}
                intl={intl}
                marketId={id}
                history={history}
              />
            </div>
          </div>
          <ParentSummary market={market} hidden={hidden}/>
          {myMessage && (
            <>
              <div style={{paddingTop: '0.5rem'}} />
              <SpinningIconLabelButton icon={SettingsBackupRestore}
                                       onClick={() => {
                                         deleteSingleMessage(myMessage).then(() => {
                                           messagesDispatch(removeMessage(myMessage));
                                           setOperationRunning(false);
                                         }).finally(() => {
                                           setOperationRunning(false);
                                         });
                                       }}
                                       doSpin={true}>
                <FormattedMessage id={mobileLayout ? 'markReadMobile' : 'markDescriptionRead'}/>
              </SpinningIconLabelButton>
            </>
          )}
          {myMessage && diff && (
            <SpinningIconLabelButton icon={showDiff ? ExpandLess : ExpandMoreIcon}
                                     onClick={toggleDiffShow} doSpin={false}>
              <FormattedMessage id={showDiff ? 'diffDisplayDismissLabel' : 'diffDisplayShowLabel'}/>
            </SpinningIconLabelButton>
          )}
          <div style={{ paddingTop: '1rem' }}></div>
          <AttachedFilesList
            key="files"
            marketId={id}
            isAdmin={myPresence.is_admin}
            onDeleteClick={onDeleteFile}
            attachedFiles={attachedFiles}
            onUpload={onAttachFile}/>
          {mobileLayout && (
            <SpinningIconLabelButton icon={MenuBookIcon}
                                     onClick={() => navigate(history, formMarketArchivesLink(id))} doSpin={false}>
              <FormattedMessage id={'planningDialogViewArchivesLabel'}/>
            </SpinningIconLabelButton>
          )}
        </dl>
        </Grid>
      </Grid>
    </Card>
  );
}

Summary.propTypes = {
  market: PropTypes.object.isRequired,
  investibleId: PropTypes.string,
  hidden: PropTypes.bool.isRequired,
  activeMarket: PropTypes.bool.isRequired,
  inArchives: PropTypes.bool.isRequired,
  unassigned: PropTypes.array
};

Summary.defaultProps = {
  investibleId: undefined,
  unassigned: []
};

export default Summary;
