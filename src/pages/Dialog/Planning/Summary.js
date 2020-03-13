import React, { useContext } from "react";
import PropTypes from "prop-types";
import { useIntl } from "react-intl";
import {
  Typography,
  CardActions,
  Card,
  CardContent,
  Divider
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { MarketPresencesContext } from "../../../contexts/MarketPresencesContext/MarketPresencesContext";
import {
  getMarketPresences,
  marketHasOnlyCurrentUser
} from "../../../contexts/MarketPresencesContext/marketPresencesHelper";
import DialogActions from "../../Home/DialogActions";
import DescriptionOrDiff from "../../../components/Descriptions/DescriptionOrDiff";
import CardType, { AGILE_PLAN_TYPE } from "../../../components/CardType";
import {
  IdealDelivery,
  MaxBudget,
  VoteExpiration,
  Votes
} from "../../../components/AgilePlan";

const useStyles = makeStyles(theme => ({
  root: {
    alignItems: "flex-start",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between"
  },
  actions: {},
  content: {
    flexBasis: "100%",
    padding: theme.spacing(0, 4)
  },
  divider: {
    marginBottom: theme.spacing(3)
  },
  fieldset: {
    border: "none",
    display: "inline-block",
    padding: theme.spacing(0),
    "& > *": {
      margin: theme.spacing(2),
      "&:first-child, &:last-child": {
        marginLeft: 0,
        marginRight: 0
      }
    }
  },
  type: {
    display: "inline-flex"
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: "42px",
    paddingBottom: "9px",
    [theme.breakpoints.down("xs")]: {
      fontSize: 25
    }
  },
  draft: {
    color: "#E85757"
  }
}));

function Summary(props) {
  const { market, investibleId, hidden } = props;
  const intl = useIntl();
  const classes = useStyles();
  const {
    id,
    name,
    description,
    market_stage: marketStage,
    market_type: marketType,
    max_budget: maxBudget,
    investment_expiration: investmentExpiration,
    days_estimate: daysEstimate,
    votes_required: votesRequired
  } = market;
  const [marketPresencesState] = useContext(MarketPresencesContext);
  const marketPresences = getMarketPresences(marketPresencesState, id) || [];
  const isDraft = marketHasOnlyCurrentUser(marketPresencesState, id);
  const myPresence =
    marketPresences.find(presence => presence.current_user) || {};

  return (
    <Card className={classes.root} id="summary">
      <CardType className={classes.type} type={AGILE_PLAN_TYPE} />
      <CardActions className={classes.actions}>
        <DialogActions
          isAdmin={myPresence.is_admin}
          isFollowing={myPresence.following}
          marketStage={marketStage}
          marketType={marketType}
          inArchives={myPresence.market_hidden}
          marketId={id}
          initiativeId={investibleId}
        />
      </CardActions>
      <CardContent className={classes.content}>
        {isDraft && (
          <Typography className={classes.draft}>
            {intl.formatMessage({ id: "draft" })}
          </Typography>
        )}
        <Typography className={classes.title} variant="h3" component="h1">
          {name}
        </Typography>
        <DescriptionOrDiff hidden={hidden} id={id} description={description} />
        <Divider className={classes.divider} />
        <fieldset className={classes.fieldset}>
          <MaxBudget readOnly value={maxBudget} />
          <VoteExpiration readOnly value={investmentExpiration} />
          <Votes readOnly value={votesRequired} />
        </fieldset>
        <fieldset className={classes.fieldset}>
          {daysEstimate && <daysEstimate readOnly value={daysEstimate} />}
        </fieldset>
      </CardContent>
    </Card>
  );
}

Summary.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  market: PropTypes.object.isRequired,
  investibleName: PropTypes.string,
  investibleDescription: PropTypes.string,
  investibleId: PropTypes.string,
  hidden: PropTypes.bool.isRequired,
  unassigned: PropTypes.array
};

Summary.defaultProps = {
  investibleName: undefined,
  investibleDescription: undefined,
  investibleId: undefined,
  unassigned: []
};

export default Summary;
