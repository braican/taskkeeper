import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import ContentEditable from 'react-contenteditable';

import { ClientContext } from '../index';

import { className, sanitizeInput } from '../../../utils';

import FormattedPrice from '../../Utils/FormattedPrice';
import FormEl from '../../Forms/FormEl';
import GearIcon from '../../../svg/Gear';

import styles from './Header.module.scss';

const Header = ({ userRef }) => {
  const { client } = useContext(ClientContext);
  const [isEditing, setIsEditing] = useState(false);
  const [address, setAddress] = useState(client.address);
  const [symbol, setSymbol] = useState(client.symbol);
  const [updated, setUpdated] = useState(false);

  const handleSave = () => {
    setIsEditing(false);

    if (!userRef || !updated) {
      return;
    }

    setUpdated(false);
    const update = {};

    if (address) {
      update.address = sanitizeInput(address);
    }

    if (symbol) {
      update.symbol = symbol;
    }

    userRef
      .collection('clients')
      .doc(client.id)
      .update(update);
  };

  return (
    <header className={styles.header}>
      <div className={styles.header__left}>
        <h2 className={styles.client__name}>{client.name}</h2>

        <p>
          <FormattedPrice price={client.rate} />
        </p>
      </div>

      <div {...className('stack', styles.header__right, isEditing && styles.editingClient)}>
        <div className={styles.address}>
          <label className={styles.address__label} htmlFor="client-address">
            Address
          </label>
          <ContentEditable
            html={address || ''}
            disabled={!isEditing}
            onChange={event => {
              setAddress(event.target.value);
              setUpdated(true);
            }}
            tagName="p"
            className={styles.address__input}
          />
        </div>

        <FormEl
          id="client-symbol"
          label="Symbol"
          className={styles.symbol__input}
          value={symbol}
          onChange={event => {
            setSymbol(event.target.value);
            setUpdated(true);
          }}
        />
      </div>

      <div className={styles.edit__actions}>
        {isEditing ? (
          <button onClick={handleSave} className="button">
            Save
          </button>
        ) : (
          <button className={styles.edit__button} onClick={() => setIsEditing(true)}>
            <GearIcon />
          </button>
        )}
      </div>
    </header>
  );
};

Header.propTypes = {
  userRef: PropTypes.object,
};

Header.defaultProps = {
  userRef: null,
};

export default compose(connect(({ userRef }) => ({ userRef })))(Header);
