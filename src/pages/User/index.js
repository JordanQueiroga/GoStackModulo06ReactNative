import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

function User({ navigation, route }) {
  const [stars, setStars] = useState([]);
  const [user, setUser] = useState({});
  const [page, setPage] = useState(1);

  useEffect(() => {
    setUser(route.params.user);
  }, []);

  const resquestStars = useCallback(() => {
    async function resquestStarsApi() {
      const response = await api.get(`/users/${user.login}/starred`, {
        params: {
          page,
          per_page: 30,
        },
      });
      setStars([...stars, ...response.data]);
      setPage(page + 1);
    }
    resquestStarsApi();
  }, [user, page]);

  useEffect(() => {
    if (user.login) {
      navigation.setOptions({ title: user.name });
      resquestStars();
    }
  }, [user]);

  return (
    <Container>
      <Header>
        <Avatar source={{ uri: user.avatar }} />
        <Name>{user.name}</Name>
        <Bio>{user.bio}</Bio>
      </Header>
      <Stars
        data={stars}
        keyExtractor={(start) => String(start.id)}
        onEndReached={resquestStars}
        renderItem={({ item }) => (
          <Starred>
            <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
            <Info>
              <Title>{item.name}</Title>
              <Author>{item.owner.login}</Author>
            </Info>
          </Starred>
        )}
      />
    </Container>
  );
}

User.propTypes = {
  navigation: PropTypes.shape({
    setOptions: PropTypes.func,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      user: PropTypes.shape({
        name: PropTypes.string,
        login: PropTypes.string,
      }),
    }),
  }).isRequired,
};

export default User;
