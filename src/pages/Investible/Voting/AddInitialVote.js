import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  makeStyles,
  Radio,
  RadioGroup,
  TextField
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { getMarketUnits } from '../../../contexts/MarketPresencesContext/marketPresencesHelper'
import { MarketPresencesContext } from '../../../contexts/MarketPresencesContext/MarketPresencesContext'
import { useEditor } from '../../../components/TextEditors/quillHooks';
import { getQuillStoredState } from '../../../components/TextEditors/QuillEditor2'

const useStyles = makeStyles(
  theme => {
    return {
      sideBySide: {
        display: 'flex',
      },
      overTop: {
        display: 'flex',
        paddingBottom: '3px',
      },
      maxBudgetUnit: {
        width: 230
      },
      certainty: {},
      cardContent: {
        padding: theme.spacing(6),
        paddingTop: theme.spacing(3),
        "& > *": {
          "flex-grow": 1,
          margin: theme.spacing(1, 0),
          "&:first-child": {
            marginTop: 0
          },
          "&:last-child": {
            marginBottom: 0
          }
        },
        '& > ul': {
          flex: 4,
          [theme.breakpoints.down('sm')]: {
            flex: 12,
          },
        },
        [theme.breakpoints.down('sm')]: {
          padding: '16px',
        },
      },
      certaintyGroup: {
        display: "flex",
        flexDirection: "row"
      },
      certaintyLabel: {
        marginBottom: theme.spacing(2),
        textTransform: "capitalize"
      },
      certaintyValue: {
        backgroundColor: theme.palette.grey["300"],
        borderRadius: 6,
        paddingLeft: theme.spacing(1),
        margin: theme.spacing(0, 2, 2, 0)
      },
      certaintyValueLabel: {
        fontWeight: "bold"
      },
      divider: {
        margin: theme.spacing(2, 0)
      },
      maxBudget: {
        display: "block"
      },
    };
  },
  { name: "VoteAdd" }
);

function AddInitialVote(props) {
  const {
    marketId,
    storyMaxBudget,
    onBudgetChange,
    onChange,
    onUnitChange,
    newQuantity,
    maxBudget,
    maxBudgetUnit,
    editorName
  } = props;
  const intl = useIntl();
  const classes = useStyles();
  const [marketPresencesState] = useContext(MarketPresencesContext);
  const myHelperText = storyMaxBudget ?
    intl.formatMessage({ id: "maxBudgetInputHelperText" }, { x: storyMaxBudget + 1 }) : '';
  const units = getMarketUnits(marketPresencesState, marketId, intl);
  const defaultProps = {
    options: units,
    getOptionLabel: (option) => option,
  };

  const editorSpec = {
    marketId,
    placeholder: intl.formatMessage({ id: "yourReason" }),
    uploadDisabled: true,
    value: getQuillStoredState(editorName)
  };

  const [Editor] = useEditor(editorName, editorSpec);

  return (
    <Card>
      <CardContent className={classes.cardContent}>
        <h2>{ intl.formatMessage({ id: 'pleaseVoteStory' }) }</h2>
        <FormControl className={classes.certainty}>
          <FormLabel
            className={classes.certaintyLabel}
            id="add-vote-certainty"
          >
            <FormattedMessage id="certaintyQuestion" />
          </FormLabel>
          <RadioGroup
            aria-labelledby="add-vote-certainty"
            className={classes.certaintyGroup}
            onChange={onChange}
            value={newQuantity}
          >
            {[5, 25, 50, 75, 100].map(certainty => {
              return (
                <FormControlLabel
                  key={certainty}
                  className={classes.certaintyValue}
                  classes={{
                    label: classes.certaintyValueLabel
                  }}
                  /* prevent clicking the label stealing focus */
                  onMouseDown={e => e.preventDefault()}
                  control={<Radio />}
                  label={<FormattedMessage id={`certainty${certainty}`} />}
                  labelPlacement="start"
                  value={certainty}
                />
              );
            })}
          </RadioGroup>
        </FormControl>
        <div className={classes.overTop}>
          <FormattedMessage id="agilePlanFormMaxMaxBudgetInputLabel" />
        </div>
        <div className={classes.sideBySide}>
          <TextField
            className={classes.maxBudget}
            id="vote-max-budget"
            label={intl.formatMessage({ id: "maxBudgetInputLabel" })}
            type="number"
            variant="filled"
            onChange={onBudgetChange}
            value={maxBudget}
            error={storyMaxBudget > 0 && maxBudget > storyMaxBudget}
            helperText={myHelperText}
          />
          <Autocomplete
            {...defaultProps}
            id="addBudgetUnit"
            key="budgetUnit"
            freeSolo
            renderInput={(params) => <TextField {...params}
                                                label={intl.formatMessage({ id: 'addUnit' })}
                                                variant="outlined" />}
            value={maxBudgetUnit}
            className={classes.maxBudgetUnit}
            onInputChange={onUnitChange}
          />
        </div>
        {Editor}
      </CardContent>
    </Card>
  );
}

AddInitialVote.propTypes = {
  storyMaxBudget: PropTypes.number,
  marketId: PropTypes.string.isRequired,
  onBudgetChange: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onUnitChange: PropTypes.func.isRequired,
  newQuantity: PropTypes.number,
  maxBudget: PropTypes.any,
  maxBudgetUnit: PropTypes.any,
  body: PropTypes.string
};

export default AddInitialVote;
