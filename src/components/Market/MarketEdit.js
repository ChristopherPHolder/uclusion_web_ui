import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardActions, CardContent, TextField, withStyles } from '@material-ui/core';
import { updateMarket } from '../../api/markets';
import { injectIntl } from 'react-intl';
import HtmlRichTextEditor from '../TextEditors/HtmlRichTextEditor';
import useAsyncMarketsContext from '../../contexts/useAsyncMarketsContext';

const styles = theme => ({
  root: {
    padding: theme.spacing(2),
  },
  row: {
    marginBottom: theme.spacing(2),
    '&:last-child': {
      marginBottom: 0,
    },
  },
});

function MarketEdit(props) {

  const { editToggle, onSave, market, classes, intl } = props;
  const { updateMarketLocally } = useAsyncMarketsContext();
  const [currentValues, setCurrentValues] = useState(market);

  const { id, name, description } = currentValues;

  function handleChange(name) {
    return (event) => {
      const { value } = event.target;
      setCurrentValues({ [name]: value });
    };
  }

  function handleSave() {
    return updateMarket(id, name, description)
      .then(market => updateMarketLocally(market))
      .then(() => onSave());
  }

  return (
    <Card>
      <CardContent>
        <TextField
          className={classes.row}
          inputProps={{ maxLength: 255 }}
          InputLabelProps={{ shrink: true }}
          id="name"
          label={intl.formatMessage({ id: 'marketEditTitleLabel' })}
          margin="normal"
          fullWidth
          value={name}
          onChange={handleChange('name')}
        />
        <HtmlRichTextEditor value={description} onChange={handleChange('description')}/>
      </CardContent>
      <CardActions>
        <Button onClick={editToggle}>
          {intl.formatMessage({ id: 'marketEditCancelLabel' })}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
        >
          {intl.formatMessage({ id: 'marketEditSaveLabel' })}
        </Button>
      </CardActions>
    </Card>
  );
}

MarketEdit.propTypes = {
  market: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  editToggle: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default withStyles(styles)(injectIntl(MarketEdit));
