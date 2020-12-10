import React from 'react'
import { AppBar, makeStyles, Toolbar, Tooltip, Typography, } from '@material-ui/core'
import PropTypes from 'prop-types'
import {
  SECTION_SUB_HEADER,
  SECTION_TYPE_SECONDARY,
  SECTION_TYPE_SECONDARY_WARNING,
  SECTION_TYPE_TERTIARY_WARNING
} from '../../constants/global'
import { useIntl } from 'react-intl'

const useStyles = makeStyles((theme) => {
  return {
    hide: {
      display: 'none'
    },
    secondarySubHeaderWarning: {
      boxShadow: 'none',
      background: '#D54F22',
      color: '#fff',
      borderRadius: '6px 6px 0 0'
    },
    subHeaderWarning: {
      boxShadow: 'none',
      background: '#e6e969',
      color: 'black',
      borderRadius: '6px 6px 0 0'
    },
    tertiarySubHeaderWarning: {
      boxShadow: 'none',
      background: '#2F80ED',
      color: '#fff',
      borderRadius: '6px 6px 0 0'
    },
    secondarySubHeader: {
      boxShadow: 'none',
      background: '#3F6B72',
      color: '#fff',
      borderRadius: '6px 6px 0 0'
    },
    sectionSubHeader: {
      boxShadow: 'none',
      background: theme.palette.grey["300"],
      color: 'black',
      borderRadius: '6px 6px 0 0'
    },
    grow: {
      flexGrow: 1,
    },
    headerTitle: {
      fontSize: 16,
      lineHeight: 1,
      cursor: 'default',
      whiteSpace: 'nowrap'
    },
    headerPrimaryTitle: {
      fontSize: 18,
      lineHeight: '18px',
      cursor: 'default',
    },
    toolbar: theme.mixins.toolbar,
    searchContainer: {
      display: 'flex',
      [theme.breakpoints.down("xs")]: {
        flexDirection: 'column'
      }
    },
  };
});

function SubSection(props) {
  const {
    children,
    hidden,
    title,
    actionButton,
    searchBar,
    type,
    titleIcon,
    id,
    helpTextId
  } = props;
  const intl = useIntl();
  const classes = useStyles();

  return (
    <React.Fragment>
      <AppBar
        id={id}
        className={type === SECTION_TYPE_SECONDARY ? classes.secondarySubHeader :
          type === SECTION_TYPE_SECONDARY_WARNING ? classes.secondarySubHeaderWarning :
            type === SECTION_TYPE_TERTIARY_WARNING ? classes.tertiarySubHeaderWarning :
              type === SECTION_SUB_HEADER ? classes.sectionSubHeader : classes.subHeaderWarning}
        position="static"
        hidden={hidden}
      >
        <Toolbar variant="dense">
          {titleIcon}
          {helpTextId && (
            <Tooltip
              title={intl.formatMessage({ id: helpTextId })}
            >
              <Typography className={classes.headerTitle}>
                {title}
              </Typography>
            </Tooltip>
          )}
          {!helpTextId && (
            <Typography className={classes.headerTitle}>
              {title}
            </Typography>
          )}
          <div className={classes.grow}/>
          <div className={classes.searchContainer}>
            {searchBar}
            {actionButton}
          </div>
        </Toolbar>
      </AppBar>
      <div className={children ? classes.toolbar : classes.hide}>
        {children}
      </div>
    </React.Fragment>

  );
}

SubSection.propTypes = {
  hidden: PropTypes.bool,
  title: PropTypes.string,
  children: PropTypes.any,
  actionButton: PropTypes.object,
  searchBar: PropTypes.object,
  type: PropTypes.string,
  titleIcon: PropTypes.element,
  id: PropTypes.string,
};

SubSection.defaultProps = {
  title: '',
  hidden: false,
  children: undefined,
  type: SECTION_TYPE_SECONDARY,
  titleIcon: undefined,
  id: undefined,
};

export default SubSection;
