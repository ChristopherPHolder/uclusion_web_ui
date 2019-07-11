import React from 'react';
import { connect } from 'react-redux';
import { withTheme } from '@material-ui/core/styles';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { withA2HS } from 'a2hs';
import SelectableMenuList from '../SelectableMenuList';
import { withMarketId } from '../../components/PathProps/MarketId';
import menuItems from '../../config/menuItems';
import { setUclusionLocalStorageItem } from '../../components/utils';


import { userLogout } from '../../store/auth/actions';
import drawerActions from '../../store/drawer/actions';
import { getCurrentUser } from '../../store/Users/reducer';
import { bindActionCreators } from 'redux';

const DrawerContent = (props) => {
  const {
    history,
    match,
    width,
    setDrawerOpen,
  } = props;

  const handleChange = (event, index) => {
    const smDown = isWidthDown('sm', width);
    if (index !== undefined && smDown) {
      setDrawerOpen(false);
    }

    if (index !== undefined && index !== Object(index)) {
      history.push(index);
    }
  };

  const handleSignOut = () => {
    setUclusionLocalStorageItem('auth', null);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
    }}
    >
      <SelectableMenuList
        items={menuItems({ ...props, handleSignOut })}
        onIndexChange={handleChange}
        index={match ? match.path : '/'}
      />

    </div>

  );
};

function mapStateToProps(state){
  return {
    user: getCurrentUser(state.usersReducer),
    userLogout,
  }
}

function mapDispatchToProps(dispatch) {
  const boundCreators = bindActionCreators({ ...drawerActions }, dispatch);
  return { ...boundCreators, dispatch };
}


export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withWidth()(withTheme()(withRouter(withA2HS(withMarketId(DrawerContent)))))));
