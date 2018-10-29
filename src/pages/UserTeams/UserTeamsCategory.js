import React from 'react'
import { UserTeamsListItem } from './UserTeamsListItem'
import { ItemListCategory } from '../../components/ItemListCategory'
import PropTypes from 'prop-types'

class UserTeamsCategory extends React.Component {

  render () {
    const {teams} = this.props
    const items = teams.map(element =>
      <UserTeamsListItem
        key={element.id}
        id={element.id}
        description={element.description}
        name={element.name}
        marketSharesAvailable={[1]}
      />
    )
    return (
      <ItemListCategory items={items}/>
    )
  }
}

UserTeamsCategory.propTypes = {
  teams: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default UserTeamsCategory