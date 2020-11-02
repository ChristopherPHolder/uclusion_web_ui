import React, { useContext } from 'react'
import { AvatarGroup } from '@material-ui/lab'
import { Avatar, CardActions, CardContent, Grid, Link, Tooltip, Typography } from '@material-ui/core'
import _ from 'lodash'
import { useHistory } from 'react-router'
import { makeStyles } from '@material-ui/styles'
import PropTypes from 'prop-types'
import { useIntl } from 'react-intl'
import {
  getMarketPresences,
  marketHasOnlyCurrentUser
} from '../../contexts/MarketPresencesContext/marketPresencesHelper'
import { MarketPresencesContext } from '../../contexts/MarketPresencesContext/MarketPresencesContext'
import { MarketsContext } from '../../contexts/MarketsContext/MarketsContext'
import { getMarket } from '../../contexts/MarketsContext/marketsContextHelper'
import { formInvestibleLink, formMarketLink, navigate } from '../../utils/marketIdPathFunctions'
import RaisedCard from '../../components/Cards/RaisedCard'
import ProgressBar from '../../components/Expiration/ProgressBarExpiration'
import { getDialogTypeIcon } from '../../components/Dialogs/dialogIconFunctions'
import { ACTIVE_STAGE } from '../../constants/markets'
import DialogActions from './DialogActions'
import ExpiredDisplay from '../../components/Expiration/ExpiredDisplay'
import { CommentsContext } from '../../contexts/CommentsContext/CommentsContext'
import { getMarketComments } from '../../contexts/CommentsContext/commentsContextHelper'
import { InvestiblesContext } from '../../contexts/InvestibesContext/InvestiblesContext'
import {
  getInvestibleName,
  getMarketInvestibles
} from '../../contexts/InvestibesContext/investiblesContextHelper'
import { getMarketUpdatedAt, getVoteTotalsForUser } from '../../utils/userFunctions'
import { ISSUE_TYPE } from '../../constants/comments'
import CardType from '../../components/CardType'
import Chart from '../../components/Cards/Chart'
import { nameToAvatarText } from '../../utils/stringFunctions'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import clsx from 'clsx'
import ThumbDownIcon from '@material-ui/icons/ThumbDown'
import md5 from 'md5'

const dialogStyles = makeStyles((theme) => ({
  paper: {
    textAlign: 'left',
  },
  textData: {
    fontSize: 12,
  },
  draft: {
    color: '#E85757',
  },
  countdownContainer: {
    width: 'auto',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  gridSliver: {
    maxWidth: '3.3%',
    flexBasis: '3.3%'
  },
  green: {
    backgroundColor: '#3f6b72',
  },
  contentContainer: {
    flexGrow: 0,
    maxWidth: '96%',
    flexBasis: '96%',
  },
  byline: {
    display: 'inline-block',
    width: 'auto',
    verticalAlign: 'top',
    marginLeft: '5px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '.75rem',
      marginLeft: 0
    },
  },
  childText: {
    fontSize: '.825rem'
  },
  isLinked: {
    cursor: 'pointer',
  },
  borderRight: {
    borderRight: '1px solid #f2f2f2',
    [theme.breakpoints.down('sm')]: {
      borderRight: 'none'
    },
  },
  chartContainer: {
    justifyContent: 'flex-end',
    paddingRight: '2rem',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'flex-start',
      paddingRight: 0,
      paddingLeft: '1rem'
    },
  },
  cardContent: {
    [theme.breakpoints.down('sm')]: {
      '&:last-child':{
        paddingBottom: 0
      }
    },
  },
  chartContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '-75%',
  },
  chartValue: {
    backgroundColor: '#3f6b72',
    color: '#ffffff',
    padding: '3px 10px',
    borderRadius: '12px',
    fontWeight: '900',
    marginTop: '5px',
  },
  lastChild: {
    '&.MuiGrid-item': {
      padding: '10px',
    },
    '&:last-child': {
      marginBottom: '16px'
    }
  },
  mobileExpired: {
    maxWidth: '100%',
    flexBasis: '100%'
  },
  expiredContentContainer: {
    flexGrow: 0,
    maxWidth: '100%',
    flexBasis: '100%',
  }
}));

const initiativeStyles = makeStyles((theme) => ({
  paper: {
    textAlign: 'left',
  },
  textData: {
    fontSize: 12,
  },
  draft: {
    color: '#E85757',
  },
  green: {
    backgroundColor: '#3f6b72',
  },
  countdownContainer: {
    width: 'auto',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  gridSliver: {
    maxWidth: '3.3%',
    flexBasis: '3.3%'
  },
  contentContainer: {
    flexGrow: 0,
    maxWidth: '96%',
    flexBasis: '96%',
  },
  byline: {
    display: 'inline-block',
    width: 'auto',
    verticalAlign: 'top',
    marginLeft: '5px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '.75rem',
      marginLeft: 0
    },
  },
  borderRight: {
    borderRight: '1px solid #f2f2f2',
    [theme.breakpoints.down('sm')]: {
      borderRight: 'none'
    },
  },
  childText: {
    fontSize: '.825rem'
  },
  isLinked: {
    cursor: 'pointer',
  },
  chartContainer: {
    justifyContent: 'flex-end',
    paddingRight: '2rem',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'flex-start',
      paddingRight: 0,
      paddingLeft: '1rem'
    },
  },
  cardContent: {
    [theme.breakpoints.down('sm')]: {
      '&:last-child':{
        paddingBottom: 0
      }
    },
  },
  chartContent: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '-75%',
  },
  voteContainer: {
    fontWeight: '900',
    margin: '.375rem',
    fontSize: '1.2rem'
  },
  thumbs: {
    fontSize: '1.25rem',
    position: 'relative',
    top: '-2px'
  },
  spacer: {
    marginRight: '.5rem;'
  },
  lastChild: {
    '&.MuiGrid-item': {
      padding: '10px',
    },
    '&:last-child': {
      marginBottom: '16px'
    }
  },
  mobileExpired: {
    maxWidth: '100%',
    flexBasis: '100%'
  },
  expiredContentContainer: {
    flexGrow: 0,
    maxWidth: '100%',
    flexBasis: '100%',
  }
}));

function InitiativesAndDialogs(props) {
  const history = useHistory();
  const dialogClasses = dialogStyles();
  const initiativeClasses = initiativeStyles();
  const intl = useIntl();
  const { dialogs, initiatives } = props;
  const [marketPresencesState] = useContext(MarketPresencesContext);
  const [commentsState] = useContext(CommentsContext);
  const [marketsState] = useContext(MarketsContext);
  const [investibleState] = useContext(InvestiblesContext);
  const [investiblesState] = useContext(InvestiblesContext);
  
  function getParticipantInfo(presences, classes) {

    return (
      <div className={classes.borderRight} style={{flex: 2, display: 'inline-block', height: '100%', minWidth: '70%'}}>
        <Grid
          container
          style={{height: '100%' }}
        >
          <Grid
            item
            xs={12}
            style={{alignSelf: 'center', display: 'flex', justifyContent: 'flex-end', paddingRight: '1rem'}}
          >
            <AvatarGroup
              max={window.outerWidth > 600 ? 4 : 1}
              spacing="small">
              {presences.map((presence) => {
                const { id: userId, name, email } = presence;
                return <Tooltip key={`tip${userId}`} title={name}>
                  <Avatar className={classes.green} key={userId}
                          src={`https://www.gravatar.com/avatar/${md5(email, {encoding: "binary"})}?d=404`}>
                    {nameToAvatarText(name)}
                  </Avatar></Tooltip>
                })
              }
            </AvatarGroup>
            </Grid> 
        </Grid>
      </div>
    );
  }

  function getInvestibleVotes(investibles, marketPresences) {
    const strippedInvestibles = investibles.map(inv => inv.investible);

    // first set every investibles support and investments to 0
    const tallies = strippedInvestibles.reduce((acc, inv) => {
      const { id } = inv;
      acc[id] = {
        ...inv,
        investments: [],
        numSupporters: 0
      };
      return acc;
    }, {});
    // now we fill in votes from market presences
    marketPresences.forEach(presence => {
      const userInvestments = getVoteTotalsForUser(presence);
      Object.keys(userInvestments).forEach((investible_id) => {
        const oldValue = tallies[investible_id];
        if (oldValue) {
          const newInvestments = [
            ...oldValue.investments,
            userInvestments[investible_id],
          ];
          tallies[investible_id] = {
            ...oldValue,
            investments: newInvestments,
            numSupporters: newInvestments.length,
          };
        }
      });
    });
    Object.keys(tallies).forEach((investibleId) => {
      if (tallies[investibleId].numSupporters === 0) {
        delete tallies[investibleId];
      }
    });
    return tallies;
  }

  function getDialogItems() {
    const classes = dialogClasses;
    return dialogs.map((market, index) => {
      const {
        id: marketId, name, created_at: createdAt, expiration_minutes: expirationMinutes, created_by: createdBy,
        market_type: marketType, market_stage: marketStage, updated_at: updatedAt, parent_market_id: parentMarketId,
        parent_investible_id: parentInvestibleId,
      } = market;
      
      const marketPresences = getMarketPresences(marketPresencesState, marketId) || [];
      const isDraft = marketHasOnlyCurrentUser(marketPresencesState, marketId);
      const myPresence = marketPresences.find((presence) => presence.current_user) || {};
      const isAdmin = myPresence && myPresence.is_admin;
      const marketPresencesFollowing = marketPresences.filter((presence) => presence.following && !presence.market_banned);
      const sortedPresences = _.sortBy(marketPresencesFollowing, 'name');
      const active = marketStage === ACTIVE_STAGE;
      const comments = getMarketComments(commentsState, marketId) || [];
      const marketIssues = comments.filter((comment) => comment.comment_type === ISSUE_TYPE && !comment.resolved && !comment.investible_id);
      const hasMarketIssue = !_.isEmpty(marketIssues);
      const creator = sortedPresences.find((presence) => (presence.id === createdBy)) || {name: ''};
      const isSmall = true;
      const investibles = getMarketInvestibles(investiblesState, marketId);
      const marketUpdatedAt = getMarketUpdatedAt(updatedAt, marketPresences, investibles, comments, marketId);

      const votes = getInvestibleVotes(investibles, marketPresences);
      const votesArray = Object.values(votes);
      // descending order of support
      const sortedVotesArray = _.sortBy(
        votesArray,
        'numSupporters',
        'name'
      ).reverse();
      const chartData = [];
      sortedVotesArray.map((sortedVote) => sortedVote.investments.map((investment) => chartData.push(investment)));
      let parentName;
      if (parentInvestibleId) {
        parentName = getInvestibleName(parentInvestibleId, investibleState);
      } else if (parentMarketId) {
        const parentMarketDetails = getMarket(marketsState, parentMarketId) || {};
        parentName = parentMarketDetails.name;
      }
      const item = <Grid
        item
        id={`dia${index}`}
        key={marketId}
        xs={12}
        className={classes.lastChild}
      >
        <RaisedCard
          className={classes.paper}
          border={1}
        >
          <Grid container >
            <div className={active ? classes.gridSliver : classes.mobileExpired}>
              <div className={classes.countdownContainer}>
                {!active && (
                  <ExpiredDisplay expiresDate={updatedAt}/>
                )}
                {active && expirationMinutes && (
                  <ProgressBar
                    createdAt={createdAt}
                    expirationMinutes={expirationMinutes}
                    showEdit={isAdmin}
                    history={history}
                    marketId={marketId}
                  />
                )}
              </div>
            </div>

            <div
              className={active ? classes.contentContainer : classes.expiredContentContainer}
            >
              <Grid container>
                <Grid item xs={12} md={6}>
                  <CardContent className={classes.cardContent}>
                    {parentName &&
                    <Link
                      href={formMarketLink(parentMarketId)}
                      variant="inherit"
                      underline="always"
                      color="primary"
                      onClick={
                        (event) => {
                          event.stopPropagation();
                          event.preventDefault();
                          navigate(history, formMarketLink(parentMarketId));
                        }
                      }
                    >
                      <Typography className={classes.childText}>
                        Child of {parentName}
                      </Typography>
                    </Link>
                    }
                    <div
                      className={classes.isLinked}
                      onClick={(event) => {
                        event.preventDefault();
                        navigate(history, formMarketLink(marketId));
                      }}>
                      {isDraft && (
                        <Typography
                          className={classes.draft}
                        >
                          {intl.formatMessage({ id: 'draft' })}
                        </Typography>
                      )}
                      <Typography variant={window.outerWidth > 600 ? 'h6' : 'body1'}>
                        {name}
                      </Typography>
                    </div>
                    {window.outerWidth > 600 ? getDialogTypeIcon(marketType, isSmall) : <span/>}
                    <Typography className={classes.byline}>
                      {intl.formatMessage({id: 'homeDialogLabel'},
                        {x: creator.name, y: intl.formatDate(marketUpdatedAt)})}
                    </Typography>
                    {hasMarketIssue && (
                      <CardType className={classes.commentType} type={ISSUE_TYPE}/>
                    )}
                  </CardContent>
                </Grid>
                <Grid item xs={6} md={2} container className={classes.chartContainer}>
                  {sortedVotesArray && sortedVotesArray.length > 0 &&
                  <div className={classes.chartContent}>
                    <Chart data={chartData} />
                    <span className={classes.chartValue}>
                          {intl.formatMessage({ id: 'numVoting' }, { x: chartData.length })}
                        </span>
                  </div>
                  }
                </Grid>
                <Grid item md={4} xs={5} style={{display: 'flex'}}>
                  {getParticipantInfo(sortedPresences, classes)}
                  <CardActions style={{display: 'inline-block', flex: 5, alignSelf: 'center'}}>
                    <DialogActions
                      isAdmin={myPresence.is_admin}
                      isFollowing={myPresence.following}
                      isGuest={myPresence.market_guest}
                      marketStage={marketStage}
                      marketType={marketType}
                      parentMarketId={parentMarketId}
                      parentInvestibleId={parentInvestibleId}
                      marketId={marketId}
                      hideEdit={true}
                    />
                  </CardActions>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </RaisedCard>
      </Grid>;
      return {marketUpdatedAt, item};
    });
  }

  function getInitiativeItems() {
    const classes = initiativeClasses;
    return initiatives.map((market, index) => {
      const {
        id: marketId, created_at: createdAt, expiration_minutes: expirationMinutes, created_by: createdBy,
        market_type: marketType, market_stage: marketStage, updated_at: updatedAt, parent_market_id: parentMarketId,
        parent_investible_id: parentInvestibleId,
      } = market;
      const investibles = getMarketInvestibles(investiblesState, marketId);
      if (!investibles || _.isEmpty(investibles)) {
        return <></>;
      }
      const baseInvestible = investibles[0];
      const { investible } = baseInvestible;
      const { name, id: investibleId } = investible;
      const marketPresences = getMarketPresences(marketPresencesState, marketId) || [];
      const isDraft = marketHasOnlyCurrentUser(marketPresencesState, marketId);
      const marketPresencesFollowing = marketPresences.filter((presence) => presence.following && !presence.market_banned);
      const myPresence = marketPresences.find((presence) => presence.current_user) || {};
      const isAdmin = myPresence && myPresence.is_admin;
      const sortedPresences = _.sortBy(marketPresencesFollowing, 'name');
      const active = marketStage === ACTIVE_STAGE;
      const creator = marketPresences.find(presence => {return presence.id === createdBy}) || {name: ''};
      const isSmall = true;
      let parentName;
      if(parentMarketId){
        const parentMarketDetails = getMarket(marketsState, parentMarketId);
        parentName = parentMarketDetails.name;
      }
      const comments = getMarketComments(commentsState, marketId) || [];
      const marketUpdatedAt = getMarketUpdatedAt(updatedAt, marketPresences, investibles, comments, marketId);
      const votes = getInvestibleVotes(investibles, marketPresences);
      const votesArray = Object.values(votes);
      // descending order of support
      const sortedVotesArray = _.sortBy(
        votesArray,
        'numSupporters',
        'name'
      ).reverse();
      const voting = [];
      sortedVotesArray.map((sortedVote) => sortedVote.investments.map((investment) => voting.push(investment)));

      const votesFor = voting.filter(vote => {return vote.y > 0 });
      const votesAgainst = voting.filter(vote => { return vote.y < 0});
      const item = <Grid
        item
        id={`ini${index}`}
        key={marketId}
        xs={12}
        className={classes.lastChild}

      >
        <RaisedCard
          className={classes.paper}
          border={1}
        >
          <Grid container >
            <div className={active ? classes.gridSliver : classes.mobileExpired}>
              <div className={classes.countdownContainer}>
                {!active && (
                  <ExpiredDisplay expiresDate={updatedAt}/>
                )}
                {active && (
                  <ProgressBar
                    createdAt={createdAt}
                    expirationMinutes={expirationMinutes}
                    showEdit={isAdmin}
                    history={history}
                    marketId={marketId}
                  />
                )}
              </div>
            </div>

            <div
              className={active ? classes.contentContainer : classes.expiredContentContainer}
            >
              <Grid container>
                <Grid item xs={12} md={6}>
                  <CardContent>
                    {parentMarketId &&
                    <Link
                      href={formMarketLink(parentMarketId)}
                      variant="inherit"
                      underline="always"
                      color="primary"
                      onClick={
                        (event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          navigate(history, formMarketLink(parentMarketId));
                        }
                      }
                    >
                      <Typography className={classes.childText}>
                        Child of {parentName}
                      </Typography>
                    </Link>
                    }
                    <div
                      className={classes.isLinked}
                      onClick={(event) => {
                        event.preventDefault();
                        navigate(history, formInvestibleLink(marketId, investibleId));}}
                    >
                      {isDraft && (
                        <Typography
                          className={classes.draft}
                        >
                          {intl.formatMessage({ id: 'draft' })}
                        </Typography>
                      )}
                      <Typography variant={window.outerWidth > 600 ? 'h6' : 'body1'}>
                        {name}
                      </Typography>
                    </div>
                    {window.outerWidth > 600 ? getDialogTypeIcon(marketType, isSmall) : <span/>}
                    <Typography className={classes.byline}>
                      {intl.formatMessage({id: 'homeInitiativeLabel'},
                        {x: creator.name, y: intl.formatDate(marketUpdatedAt)})}
                    </Typography>
                  </CardContent>
                </Grid>
                <Grid item md={2} xs={6} container className={classes.chartContainer}>
                  <div className={classes.chartContent}>
                    <span className={classes.voteContainer}>{votesFor && votesFor.length}</span>
                    <ThumbUpIcon htmlColor="#828282" className={clsx(classes.thumbs, classes.spacer)}/>
                    <ThumbDownIcon htmlColor="#828282" className={classes.thumbs}/>
                    <span className={classes.voteContainer}>{votesAgainst && votesAgainst.length}</span>
                  </div>
                </Grid>
                <Grid item xs={5} md={4} style={{display: 'flex'}}>
                  {getParticipantInfo(sortedPresences, classes)}
                  <CardActions style={{display: 'inline-block', flex: 5, alignSelf: 'center'}}>
                    <DialogActions
                      isAdmin={myPresence.is_admin}
                      isFollowing={myPresence.following}
                      isGuest={myPresence.market_guest}
                      marketStage={marketStage}
                      marketType={marketType}
                      parentMarketId={parentMarketId}
                      parentInvestibleId={parentInvestibleId}
                      marketId={marketId}
                      hideEdit={true}
                    />
                  </CardActions>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </RaisedCard>
      </Grid>;

      return {marketUpdatedAt, item};
    });
  }

  const rawAllItems = getDialogItems().concat(getInitiativeItems());
  const sortedAllItems = _.sortBy(rawAllItems, 'marketUpdatedAt').reverse();
  const allItems = sortedAllItems.map((anItem) => anItem.item);
  return (
    <Grid container spacing={4}>
      {allItems}
    </Grid>
  );
}

InitiativesAndDialogs.propTypes = {
  dialogs: PropTypes.arrayOf(PropTypes.object).isRequired,
  initiatives: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default InitiativesAndDialogs;
