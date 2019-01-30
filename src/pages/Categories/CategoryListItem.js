import PropTypes from 'prop-types'
import React from 'react'
import { ExpansionPanel, ExpansionPanelSummary, Typography } from '@material-ui/core'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import { injectIntl } from 'react-intl'

const styles = (theme) => ({
  headerBox: {
    display: 'flex',
    justifyContent: 'space-between'
  },

  details: {
    alignItems: 'center',
  },

  helper: {},

  investment: {
    display: 'inline-block'
  },

  column: {
    flexBasis: '33.33%',
  },

  mainGrid: {
    padding: theme.spacing.unit * 2,
    justifyContent: 'flex-end'
  },

  tabSection: {
    borderTop: `1px solid ${theme.palette.divider}`,
    display: 'block'
  },

  wholeWidth: {
    flexBasis: '100%'
  }
})

class CategoryListItem extends React.Component {
  render () {
    const { name, classes, investiblesIn } = this.props
    return (
      <ExpansionPanel>
        <ExpansionPanelSummary>
          <div className={classes.column}>
            <Typography>
              {name}
            </Typography>
          </div>
          <div className={classes.column}>
            <Typography>
              {investiblesIn}
            </Typography>
          </div>
          <div className={classNames(classes.column, classes.helper)} />
        </ExpansionPanelSummary>
      </ExpansionPanel>
    )
  }
}

CategoryListItem.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  investiblesIn: PropTypes.number
}

export default injectIntl(withStyles(styles)(CategoryListItem))
