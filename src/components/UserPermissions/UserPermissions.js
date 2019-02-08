import React from 'react';
import { connect } from 'react-redux';
import { getCurrentUser } from '../../store/Users/reducer';

const mapStateToProps = state => ({
  _upUser: getCurrentUser(state.usersReducer),
});

const permissionsArrayToObject = (array) => {
  const reducer = (accumulator, current) => {
    accumulator[current] = true;
    return accumulator;
  };
  return array.reduce(reducer, {});
};

function withUserAndPermissions(WrappedComponent) {
  class UserPermissionsWrapper extends React.Component {
    constructor(props) {
      super(props);
      this.getUserPermissions = this.getUserPermissions.bind(this);
    }

    getUserPermissions() {
      const { _upUser } = this.props;
      if (!_upUser || !_upUser.market_presence) {
        return {};
      }
      const { available_apis, operation_permissions } = _upUser.market_presence;
      if (!available_apis || !operation_permissions) {
        return {};
      }
      const apisObject = permissionsArrayToObject(available_apis);
      const opObject = permissionsArrayToObject(operation_permissions);
      // console.log(apisObject)
      const canDeleteMarketInvestible = apisObject.delete_investible && opObject.delete_market_investible;
      const canEditMarketInvestible = apisObject.update_investible && opObject.update_market_investible;
      // console.log(_upUser)
      const canInvest = apisObject.create_investment || false;
      const canListAccountTeams = apisObject.list_teams || false;
      const canCategorize = apisObject.category_create || false;
      return {
        canDeleteMarketInvestible, canInvest, canEditMarketInvestible, canListAccountTeams, canCategorize,
      };
    }

    render() {
      const userPermissions = this.getUserPermissions();
      // remove the up user
      const newProps = { ...this.props };
      delete newProps._upUserLoading;
      delete newProps._upUser;

      // technically we're passing the user and Permissions here which is fine
      return <WrappedComponent {...newProps} userPermissions={userPermissions} />;
    }
  }
  return connect(mapStateToProps)(UserPermissionsWrapper);
}

export { withUserAndPermissions };
