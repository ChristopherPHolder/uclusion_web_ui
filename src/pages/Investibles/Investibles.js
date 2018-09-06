import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import { withTheme } from '@material-ui/core/styles'
import { fetchInvestibles, fetchCategoriesInvestibles } from '../../containers/Investibles/actions'
import { getInvestiblesFetching, getInvestibles, investiblePropType } from '../../containers/Investibles/reducer'
import InvestiblesList from './InvestiblesList'
import { injectIntl } from 'react-intl'
import { Activity } from 'uclusion-react-scripts'

class Investibles extends Component {
  constructor (props) {
    super(props)
    // https://medium.freecodecamp.org/react-binding-patterns-5-approaches-for-handling-this-92c651b5af56
    this.readTrendingInvestibles = this.readTrendingInvestibles.bind(this)
  }

  componentDidMount () {
    this.readTrendingInvestibles()
  }

  componentDidUpdate () {
    // this.readTrendingInvestibles()
  }

  readTrendingInvestibles () {
    const { dispatch } = this.props
    dispatch(fetchInvestibles({
      market_id: 'slack_TB424K1GD',
      trending_window_date: '2015-01-22T03:23:26Z'
    }))
  }

  readCategoriesInvestibles (page, categoryName) {
    const { dispatch } = this.props
    dispatch(fetchCategoriesInvestibles({
      market_id: 'slack_TB424K1GD',
      category: categoryName,
      page,
      per_page: 20
    }))
  }

  render () {
    const { intl, loading, investibles } = this.props

    if (loading === 1 && investibles.length === 0) {
      return (
        <div>
          Loading
        </div>
      )
    }

    if (investibles.length === 0) {
      return (
        <div><p>No investibles found.</p></div>
      )
    }

    return (
      <Activity
        isLoading={investibles === undefined}
        containerStyle={{ overflow: 'hidden' }}
        title={intl.formatMessage({ id: 'investibles' })}>
        <InvestiblesList
          investibles={_.orderBy(investibles, ['quantity'], ['desc'])}
        />
      </Activity>
    )
  }
}

Investibles.propTypes = {
  dispatch: PropTypes.func.isRequired,
  loading: PropTypes.number.isRequired,
  investibles: PropTypes.arrayOf(investiblePropType).isRequired
}

const mapStateToProps = (state) => ({
  loading: getInvestiblesFetching(state.investiblesReducer),
  investibles: getInvestibles(state.investiblesReducer)
})

function mapDispatchToProps (dispatch) {
  return Object.assign({ dispatch }, bindActionCreators({ fetchInvestibles }, dispatch))
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(withTheme()((Investibles))))
