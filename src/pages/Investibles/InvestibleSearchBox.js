import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { injectIntl } from 'react-intl';
import elasticlunr from 'elasticlunr';
import {
  FormControl,
  Input,
  InputLabel,
  InputAdornment,
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import { updateSearchResults } from '../../store/ActiveSearches/actions';
import { getActiveInvestibleSearches } from '../../store/ActiveSearches/reducer';
import { getSerializedMarketIndexes } from '../../store/SearchIndexes/reducer';
import { withMarketId } from '../../components/PathProps/MarketId';

const styles = theme => ({

  root: {
    color: 'inherit',
    margin: theme.spacing.unit,
    marginTop: theme.spacing(2),
    width: 384,
    [theme.breakpoints.only('xs')]: {
      width: '100%',
    },
  },
  input: {
    color: 'inherit',
  },
});

function InvestibleSearchBox(props) {
  const [searchQuery, setSearchQuery] = useState(undefined);
  const [searchInProgress, setSearchInProgress] = useState(undefined);
  const {
    dispatch,
    marketId,
    serializedIndexes,
    searches,
    classes,
    intl,
  } = props;

  const marketSearch = searches[marketId];
  const marketSearchQuery = marketSearch ? marketSearch.query : '';

  function doSearch(newQuery) {
    setSearchQuery(newQuery);
  }

  function clearSearch() {
    setSearchQuery('');
  }

  function runSearch() {
    if (marketId && searchQuery !== undefined) {
      const serializedIndex = serializedIndexes[marketId];
      // if we don't have an index, there's nothing to search against
      if (serializedIndex) {
        const index = elasticlunr.Index.load(JSON.parse(serializedIndex));
        // Without this working around "we" returns nothing but "web" returns things - see https://github.com/olivernn/lunr.js/issues/38
        // However in that bug they removed stemmer and I am removing stopWordFilter
        // BUT STOP WORDS ARE STILL IN EFFECT
        // on the search results - this just removes the processing of stop words from the input
        index.pipeline._queue = index.pipeline._queue.filter(lunrPipeLineFunction => lunrPipeLineFunction.label !== 'stopWordFilter');
        const results = index.search(searchQuery, { expand: true });
        dispatch(updateSearchResults(searchQuery, results, marketId));
      }
    }
  }

  useEffect(() => {
    // search time is 1000ms after current time
    const timerDuration = 1000;
    if (searchInProgress) {
      clearTimeout(searchInProgress);
    }
    const timer = setTimeout(() => {
      setSearchInProgress(undefined);
      runSearch();
    }, timerDuration);
    setSearchInProgress(timer);
    return () => {};
  }, [marketId, searchQuery]);

  return (
    <FormControl className={classes.root}>
      <InputLabel className={classes.input} htmlFor="adornment-search" shrink>{intl.formatMessage({ id: 'searchBoxLabel' })}</InputLabel>
      <Input
        className={classes.input}
        id="adornment-search"
        type="text"
        placeholder={intl.formatMessage({ id: 'searchBoxHelper' })}
        value={marketSearchQuery || searchQuery}
        onChange={event => doSearch(event.target.value)}
        startAdornment={(searchQuery && (
          <InputAdornment position="start">
            <ClearIcon onClick={() => clearSearch() }/>
          </InputAdornment>
          ))}
        endAdornment={(
          <InputAdornment position="end">
            <SearchIcon />
          </InputAdornment>
        )}
      />
    </FormControl>
  );
}

function mapStateToProps(state) {
  const searches = getActiveInvestibleSearches(state.activeSearches);
  const serializedIndexes = getSerializedMarketIndexes(state.searchIndexes);

  return {
    searches,
    serializedIndexes,
  };
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withMarketId(injectIntl(InvestibleSearchBox))));
