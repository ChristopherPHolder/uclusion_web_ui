import PropTypes from 'prop-types';
import React from 'react';
import MemberListItem from './MemberListItem';
import ItemListCategory from '../Lists/ItemListCategory';

class MemberListCategory extends React.PureComponent {
  render() {
    const { members } = this.props;
    const items = members.map(element => <MemberListItem key={element.id} {...element} />);
    return (
      <ItemListCategory items={items} />
    );
  }
}

MemberListCategory.propTypes = {
  members: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default MemberListCategory;
