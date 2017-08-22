import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import steemconnect from '../../utils/steemconnect';

import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import Popover from 'material-ui/Popover'
import Menu from 'material-ui/Menu'

import { selectMe } from '../User/selectors';
import { logoutBegin } from '../User/actions/logout';

import logo from '../../styles/assets/imgs/logos/logo.png'
import CreatePost from '../../components/__common/CreatePost'
import AvatarSteemit from '../../components/AvatarSteemit';
import GreenButton from '../../components/GreenButton';

import { COUNTRIES } from '../../constants/constants'

const countriesItems = Object.keys(COUNTRIES).map(index => (
  <MenuItem
    className={`icon_flag icon_flag_${COUNTRIES[index].flag}`}
    value={index}
    key={index}
    primaryText={COUNTRIES[index].name}
    label={<span
      className={`selected_flag icon_flag_${COUNTRIES[index].flag}`}>{COUNTRIES[index].name}</span>}
  />
));

class Header extends Component {
  static propTypes = {
    me: PropTypes.string.isRequired,
    logout: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      filter: {
        post: 1,
        category: 1,
        country: "1",
      },
      dropdownMenu: {
        open: false,
      },
      collapseOpen: false,
    }
  }

  handleSelectPost = (event, index, value) => {
    this.setState(state => {
      state.filter.post = value
    })
  };

  handleSelectCategory = (event, index, value) => {
    this.setState(state => {
      state.filter.category = value
    })
  };

  handleSelectCountry = (event, index, value) => {
    this.setState(state => {
      state.filter.country = value
    })
  };

  handleShowDropdownMenu = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      dropdownMenu: {
        open: true,
        anchorEl: event.currentTarget,
      }
    })
  };

  handleCloseDropdownMenu = () => {
    this.setState(state => {
      state.dropdownMenu.open = false
    })
  };

  handleControlCollapse = () => {
    this.setState(state => {
      state.collapseOpen = !state.collapseOpen
    })
  };

  render() {
    const { me } = this.props;
    const { filter, dropdownMenu, collapseOpen } = this.state;
    return (
      <header className="header clearfix">
        <div className="header__group header__group--search float_left">
          <Link to="/" id="logo">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        {me && (
          <div className="header__collapse__control">
            <IconButton onTouchTap={this.handleControlCollapse}>
              <i className="material-icons">{collapseOpen ? "close" : "menu"}</i>
            </IconButton>
          </div>
        )}
        {me && (
          <div className={`header__collapse collapse ${collapseOpen ? 'in' : ''}`}>
            <SelectField
              value={filter.post}
              onChange={this.handleSelectPost}
              className="select_filter"
              maxHeight={400}
              fullWidth={true}
              autoWidth={true}
            >
              <MenuItem value={1} key={1} primaryText="all posts" />
              <MenuItem value={2} key={2} primaryText="my posts" />
            </SelectField>
            <SelectField
              value={filter.category}
              onChange={this.handleSelectCategory}
              className="select_filter"
              maxHeight={400}
              fullWidth={true}
              autoWidth={true}
            >
              <MenuItem value={1} key={1} primaryText="videos only" />
              <MenuItem value={2} key={2} primaryText="articles only" />
            </SelectField>
            <SelectField
              value={filter.country}
              onChange={this.handleSelectCountry}
              className="select_filter"
              fullWidth={true}
              autoWidth={true}
            >
              {countriesItems}
            </SelectField>
            <CreatePost />
            <button className="header__group__username"
                    onTouchTap={this.handleShowDropdownMenu}>
              {me}
            </button>
            <div>
              <AvatarSteemit name={me} />
            </div>
            <Popover
              className="header__group__dropdownmenu"
              open={dropdownMenu.open}
              anchorEl={dropdownMenu.anchorEl}
              anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
              targetOrigin={{ horizontal: 'left', vertical: 'top' }}
              onRequestClose={this.handleCloseDropdownMenu}
            >
              <Menu>
                <MenuItem>
                  <Link to="#">
                    <i className="material-icons">notifications</i>Notifications
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link to="#">
                    <i className="material-icons">sms</i>Blog
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link to="/profile">
                    <i className="material-icons">account_circle</i>My Profile
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link to="#">
                    <i className="material-icons">mail_outline</i>Transactions
                  </Link>
                </MenuItem>
                <MenuItem className="divider">
                  <Link to="#">
                    <i className="material-icons">settings</i>Settings
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link to="#">
                    <i className="material-icons">question_answer</i>Support
                  </Link>
                </MenuItem>
                <MenuItem className="divider">
                  <Link to="#" onClick={this.props.logout}>
                    <i className="material-icons">power_settings_new</i>Sign Out
                  </Link>
                </MenuItem>
              </Menu>
            </Popover>
          </div>
        )}
        {!me && (
          <div className="connect">
            <a href={steemconnect.getLoginURL()}>
              <GreenButton>Connect</GreenButton>
            </a>
          </div>
        )}
      </header>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  me: selectMe(),
});

const mapDispatchToProps = (dispatch, props) => ({
  logout: () => dispatch(logoutBegin()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));